"""A version's MASTER — a mastering pass on a finished sound file.

ONE FILE, IN TWO REPOS, kept the same: the piece's (synthesi-alpha — docs/PLAN.md S7, docs/
RUNNING_LOG.md §6 … §9) and the engine's (live-electronics-engine — docs/plan/mastering-stage.md,
journal 263). A version's folder is versions/seed-N in the piece, build/versions/seed-N in the engine.

    python tools/master.py --selftest
    python tools/master.py --candidates versions/seed-1    ->  build/masters/seed-1/<name>.flac + candidates.json
                                                               then listen: engine/master.html?v=seed-1
    python tools/master.py --keep NAME versions/seed-1     ->  versions/seed-1/master.flac + master.json   (at his word)
    python tools/master.py versions/seed-1                 ->  build/masters/seed-1/master.flac, at the voice's dials
    python tools/master.py --into build/versions/seed-7    ->  build/versions/seed-7/master.flac, beside the sound
                                                               (what making a version ends with)
    python tools/master.py IN.flac OUT.flac [--lowpass HZ] [--comp] [--ceiling DB]

FILE IN, FILE OUT. The piece is not played again: the master is made from the version's own sound,
the same take — the same length, the same rate, not moved by a sample, so the one picture record
fits both. The source is never written over.

J, 2026-10-12 (log §6): "a mastering bus pass on the sound files ... just some basic like low pass
and compression if necessary and limiter." And what it is for (log §7): THE HALL — he on stage, the
file through the PA. So: nothing over -1 dB; loudness is not chased ("the house's fader"); the
low-pass and the compressor are dials, off unless his ear turns them on; the limiter is always on.

THE CHAIN, in order:

  the low-pass     12 dB an octave, -3 dB at the named frequency, NO phase shift (the whole file's
                   spectrum is shaped at once, so nothing is delayed or smeared to one side)
  the compressor   both channels as one · the running level over 30 ms · a soft knee. Under its
                   knee it multiplies by exactly 1. "makeup": "to its own loudness" then brings the
                   whole file back up to the loudness it was made at (measured, EBU R 128) — the
                   quiet pages come up, the loud ones down, and the limiter takes the peaks
  the limiter      LOOKS AHEAD · both channels as one · reads the TRUE peak (the wave between the
                   samples too, four points a sample) · CANNOT OVERSHOOT: the gain is already down
                   when the peak arrives, and lets go slowly after. Where nothing is over the
                   ceiling its gain is exactly 1
  16 bits          rounded and packed lossless (FLAC), as a version's own sound is. With only the
                   limiter on there is no dither: a sample it did not turn down stays the sample
                   it was. With the low-pass or the compressor on, every sample has changed, and
                   the rounding is dithered (triangular, from a fixed seed)

The design is piece 6's bus (decibel_TENOR_2026 docs/RUNNING_LOG.md §164 — high-pass · low-pass ·
soft-knee RMS compressor · a linked look-ahead limiter at -1 dB · a meter), done on a file where
that one runs live. A file has no clock to keep, so the limiter here looks as far ahead as it
needs and the low-pass costs no delay.

THE DIALS are a voice's: voices/<voice>/master.json — "dials" (what a master is made with) and
"candidates" (what is put to his ear, `--candidates`). Without that file: the limiter only.

Needs: numpy, soundfile, and ffmpeg on the path (the packing, and the loudness meter — EBU R 128).
"""
import argparse
import datetime
import hashlib
import json
import math
import pathlib
import re
import shutil
import subprocess
import sys

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "build" / "masters"

DIALS = {"ceilingDb": -1.0, "lowpassHz": None, "compressor": None}
# the limiter's two speeds: it comes down over this long for each dB it has to, and lets go over this long
LIMITER = {"attackMsPerDb": 1.5, "releaseMsPerDb": 60.0}
COMP = {"thresholdDb": -24.0, "ratio": 2.0, "kneeDb": 6.0, "windowMs": 30.0, "attackMs": 30.0, "releaseMs": 250.0,
        "makeupDb": 0.0}
# a choice is offered to his ear only if it moves something by a just-noticeable difference (the
# engine's choice methodology): about 2 dB in level or range, about 15 % in where the spectrum sits
JND = {"db": 2.0, "centroid": 0.15}

db = lambda v: 20 * math.log10(v) if v > 0 else -math.inf


# ---- the wave between the samples (the true peak): three points between each pair ----
TAPS = 16


def _kernels():
    ks = []
    for d in (0.25, 0.5, 0.75):
        u = d - np.arange(-TAPS + 1, TAPS + 1)                      # from the point to each of 32 samples
        fade = np.i0(9.0 * np.sqrt(np.maximum(0.0, 1 - (u / TAPS) ** 2))) / np.i0(9.0)   # a Kaiser window
        g = np.sinc(u) * fade                                       # the ideal curve, faded to nothing at 16
        ks.append(g / g.sum())
    return ks


KERNELS = _kernels()


def peaks(x):
    """For every sample, both channels as one: the largest the WAVE gets at that sample or beside it."""
    pk = np.zeros(len(x))
    for c in range(x.shape[1]):
        np.maximum(pk, np.abs(x[:, c]), out=pk)
        xp = np.concatenate([np.zeros(TAPS - 1), x[:, c], np.zeros(TAPS)])
        for g in KERNELS:
            a = np.abs(np.correlate(xp, g, mode="valid"))            # the wave between n and n + 1 …
            np.maximum(pk, a, out=pk)                                # … counts for the sample before it
            np.maximum(pk[1:], a[:-1], out=pk[1:])                   # … and for the one after
    return pk


# ---- the low-pass ----
def lowpass(x, sr, hz):
    n = len(x)
    size = 1 << int(n + sr).bit_length()                             # room after the end for the filter to ring into
    shape = 1 / np.sqrt(1 + (np.fft.rfftfreq(size, 1 / sr) / hz) ** 4)
    out = np.empty_like(x)
    for c in range(x.shape[1]):
        out[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], size) * shape, size)[:n]
    return out


# ---- the compressor ----
def compress(x, sr, c):
    c = {**COMP, **c}
    n, hop = len(x), 64                                              # the gain is worked out 750 times a second
    w = max(1, int(round(sr * c["windowMs"] / 1000)))
    cs = np.concatenate([[0.0], np.cumsum((x * x).mean(axis=1))])
    at = np.arange(0, n, hop)
    lo, hi = np.clip(at - w // 2, 0, n), np.clip(at - w // 2 + w, 0, n)
    over = 10 * np.log10(np.maximum((cs[hi] - cs[lo]) / w, 1e-12)) - c["thresholdDb"]
    k = c["kneeDb"]
    bent = np.where(over <= -k / 2, 0.0, np.where(over >= k / 2, over, (over + k / 2) ** 2 / (2 * k))) if k > 0 \
        else np.maximum(over, 0.0)
    want = (bent * (1 - 1 / c["ratio"])).tolist()                    # dB to come down, 0 under the knee
    a = math.exp(-hop / (sr * c["attackMs"] / 1000))
    r = math.exp(-hop / (sr * c["releaseMs"] / 1000))
    red, g = np.empty(len(want)), 0.0
    for i, v in enumerate(want):
        g = v + (g - v) * (a if v > g else r)
        red[i] = g
    red = np.interp(np.arange(n), at, red)
    gain = 10 ** ((c["makeupDb"] - red) / 20)
    return x * gain[:, None], {"deepestDb": round(float(red.max()), 2), "meanDb": round(float(red.mean()), 2)}


# ---- the limiter ----
def limit(x, sr, ceiling_db, speeds=LIMITER):
    """-> the sound, what was done, and which samples were turned down."""
    n = len(x)
    top = 10 ** (ceiling_db / 20) - 2 / 32768                        # two steps of 16 bits kept for the rounding
    need = 20 * np.log10(np.maximum(peaks(x) / top, 1.0))            # dB each sample must come down: 0, mostly
    k = np.arange(n, dtype=np.float64)
    # after a peak the gain lets go at a fixed rate (dB a second); before it, it comes down at one.
    # Each is "the largest of every peak's own straight line", which a running maximum gives exactly
    # — so the gain is never less than a sample needs, and exactly 0 dB where no peak reaches.
    ramp = k / (speeds["releaseMsPerDb"] * sr / 1000)
    red = np.maximum.accumulate(need + ramp) - ramp
    ramp = k / (speeds["attackMsPerDb"] * sr / 1000)
    np.maximum(red, np.maximum.accumulate((need - ramp)[::-1])[::-1] + ramp, out=red)
    del ramp, k
    touched = red > 0
    gain = np.where(touched, 10 ** (-red / 20), 1.0)
    edges = int(np.count_nonzero(touched[1:] & ~touched[:-1]) + (1 if n and touched[0] else 0))
    stats = {"ceilingDb": ceiling_db, "samplesOverIt": int(np.count_nonzero(need > 0)),
             "samplesTurnedDown": int(np.count_nonzero(touched)),
             "secondsTurnedDown": round(float(np.count_nonzero(touched)) / sr, 3),
             "moments": edges, "deepestDb": round(float(red.max()) if n else 0.0, 2), **speeds}
    return x * gain[:, None], stats, touched


# ---- measuring ----
def centroid(x, sr):
    """Where the spectrum sits: the middle of its energy, Hz."""
    m, size = x.mean(axis=1), 8192
    fr = m[:len(m) // size * size].reshape(-1, size) * np.hanning(size)
    p = (np.abs(np.fft.rfft(fr, axis=1)) ** 2).sum(axis=0)
    return float((np.fft.rfftfreq(size, 1 / sr) * p).sum() / p.sum()) if p.sum() > 0 else 0.0


def loudness(path):
    """EBU R 128, by ffmpeg — not this file's own arithmetic: integrated loudness, range, true peak."""
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true",
                        "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    s = p.stderr[p.stderr.rfind("Integrated loudness"):]
    num = lambda pat: float(re.search(pat, s).group(1))
    return {"lufs": num(r"I:\s+(-?[\d.]+) LUFS"), "rangeLu": num(r"LRA:\s+(-?[\d.]+) LU"),
            "truePeakDb": num(r"Peak:\s+(-?[\d.]+) dBFS")}


def figures(path, x, sr):
    return {**loudness(path), "truePeakDbOwn": round(db(float(peaks(x).max())), 3),
            "samplePeakDb": round(db(float(np.abs(x).max())), 3), "centroidHz": round(centroid(x, sr), 1)}


# ---- 16 bits, packed ----
def write_flac(path, x, sr, dither):
    q = np.empty(x.shape, dtype="<i2")
    rng = np.random.default_rng(1)
    for i in range(0, len(x), 1 << 20):
        y = x[i:i + (1 << 20)] * 32768.0
        if dither:
            y = y + rng.random(y.shape) - rng.random(y.shape)
        q[i:i + (1 << 20)] = np.clip(np.rint(y), -32768, 32767)
    path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(sr), "-ac", str(x.shape[1]),
                    "-i", "-", "-c:a", "flac", "-compression_level", "8", str(path)], input=q.tobytes(), check=True)
    return q


# ---- a master: file in, file out, and its report ----
def master(src, out, dials, before=None, say=print):
    src, out = pathlib.Path(src), pathlib.Path(out)
    if out.resolve() == src.resolve():
        raise SystemExit("the source is never written over")
    dials = {**DIALS, **dials}
    x, sr = sf.read(str(src), dtype="float64", always_2d=True)
    n, lp, comp = len(x), dials["lowpassHz"], dials["compressor"]
    before = before or figures(src, x, sr)
    y, cstats = x, None
    if lp:
        y = lowpass(y, sr, lp)
    if comp:
        y, cstats = compress(y, sr, {k: v for k, v in comp.items() if k != "makeup"})
        if comp.get("makeup") == "to its own loudness":               # as loud as it was made: the quiet pages come up,
            tmp = out.with_name(out.stem + ".tmp.flac")              # the loud ones down, and the limiter takes the peaks
            write_flac(tmp, y, sr, False)
            up = before["lufs"] - loudness(tmp)["lufs"]
            tmp.unlink()
            y = y * 10 ** (up / 20)
            cstats["madeUpDb"] = round(up, 2)
    # THE CEILING IS HELD BY ANOTHER METER THAN THE LIMITER'S OWN: the file is measured by ffmpeg
    # (EBU R 128), and if its true peak stands over the ceiling the limiter is asked for that much
    # less and the file made again. (Two meters read the wave between the samples a little
    # differently, most of all near the top of the band.)
    asked, rounds, pre = dials["ceilingDb"], 0, y
    while True:
        rounds += 1
        y, lstats, touched = limit(pre, sr, asked)
        q = write_flac(out, y, sr, dither=bool(lp or comp))
        back, sr2 = sf.read(str(out), dtype="int16", always_2d=True)
        if len(back) != n or sr2 != sr or not np.array_equal(back, q):
            raise SystemExit(f"{out}: the file read back is not what was written")
        after = figures(out, back / 32768.0, sr)
        if after["truePeakDb"] <= dials["ceilingDb"] or rounds >= 5:
            break
        asked = round(asked - (after["truePeakDb"] - dials["ceilingDb"]) - 0.05, 3)
    if after["truePeakDb"] > dials["ceilingDb"]:
        raise SystemExit(f"{out}: the ceiling was not held — true peak {after['truePeakDb']} dB after {rounds} rounds")
    lstats.update({"ceilingDb": dials["ceilingDb"], "askedOfItDb": asked, "rounds": rounds})
    same = None
    if not lp and not comp:                                           # the limiter alone: the rest is the source, to the sample
        same = int(np.count_nonzero(back[~touched] != np.rint(x[~touched] * 32768).astype(np.int16)))
    git = lambda *a: subprocess.run(["git", *a], capture_output=True, text=True, cwd=ROOT).stdout.strip()
    rel = lambda p: p.resolve().relative_to(ROOT).as_posix() if ROOT in p.resolve().parents else str(p)
    report = {
        "schema": 1, "kind": "master", "made": datetime.date.today().isoformat(),
        "file": out.name, "frames": n, "sampleRate": sr, "channels": x.shape[1], "bits": 16,
        "bytes": out.stat().st_size,
        "source": {"file": rel(src), "sha256": hashlib.sha256(src.read_bytes()).hexdigest(), "frames": n},
        "dials": dials, "before": before, "after": after,
        "limiter": lstats, "compressor": cstats,
        "untouchedSamplesThatChanged": same,
        "tool": {"repo": ROOT.name, "commit": git("rev-parse", "HEAD"),
                 "clean": git("status", "--porcelain", "--", "tools/master.py") == ""},
    }
    out.with_suffix(".json").write_text(json.dumps(report, indent=1, ensure_ascii=False) + "\n", encoding="utf-8",
                                        newline="\n")
    a, lim = report["after"], lstats
    say(f"  {out.name}: {a['lufs']} LUFS · range {a['rangeLu']} LU · true peak {a['truePeakDb']} dB "
        f"(own meter {a['truePeakDbOwn']}) · the limiter worked on {lim['secondsTurnedDown']} s in "
        f"{lim['moments']} moments, {lim['deepestDb']} dB at most"
        + (f" · the compressor {cstats['deepestDb']} dB at most, made up {cstats.get('madeUpDb', 0)} dB" if cstats else "")
        + (f" · {same} untouched samples changed" if same is not None else ""))
    return report


# ---- a voice's dials, and a version's folder ----
def spec_of(voice):
    f = ROOT / "voices" / str(voice) / "master.json"
    spec = json.loads(f.read_text(encoding="utf-8")) if voice and f.exists() else {}
    spec.setdefault("dials", {})
    spec.setdefault("compressors", {})
    spec.setdefault("candidates", [{"name": "safe", "says": "as it was made, made safe — the limiter only"}])
    return spec, f


def dials_of(spec, row):
    comp = row.get("compressor")
    if isinstance(comp, str):
        comp = spec["compressors"][comp]
    return {**DIALS, "ceilingDb": spec["dials"].get("ceilingDb", DIALS["ceilingDb"]),
            "lowpassHz": row.get("lowpassHz"), "compressor": comp}


def version_of(vdir):
    vdir = pathlib.Path(vdir)
    facts = json.loads((vdir / "version.json").read_text(encoding="utf-8"))
    return vdir, facts, vdir / facts["sound"]["file"]


def candidates(vdir):
    vdir, facts, src = version_of(vdir)
    spec, _ = spec_of(facts.get("voice"))
    out = BUILD / vdir.name
    x, sr = sf.read(str(src), dtype="float64", always_2d=True)
    before = figures(src, x, sr)
    pk = np.abs(x).max(axis=1)
    loudest = int(np.argmax(pk[:len(pk) // sr * sr].reshape(-1, sr).max(axis=1)))
    del x, pk
    print(f"{vdir.name}: as it was made — {before['lufs']} LUFS · range {before['rangeLu']} LU · "
          f"true peak {before['truePeakDb']} dB · the spectrum's middle {before['centroidHz']} Hz")
    rows = []
    for c in spec["candidates"]:
        rep = master(src, out / f"{c['name']}.flac", dials_of(spec, c), before=before)
        rows.append({"name": c["name"], "says": c.get("says", ""), "file": rep["file"], "dials": rep["dials"],
                     "after": rep["after"], "limiter": rep["limiter"], "compressor": rep["compressor"]})
    ref = rows[0]["after"]
    for r in rows[1:]:
        a = r["after"]
        d = {"lufs": round(a["lufs"] - ref["lufs"], 1), "rangeLu": round(a["rangeLu"] - ref["rangeLu"], 1),
             "centroid": round(a["centroidHz"] / ref["centroidHz"] - 1, 3)}
        r["againstTheFirst"] = d
        r["clearsTheScreen"] = bool(abs(d["lufs"]) >= JND["db"] or abs(d["rangeLu"]) >= JND["db"]
                                    or abs(d["centroid"]) >= JND["centroid"])
        print(f"    against {rows[0]['name']}: loudness {d['lufs']:+} · range {d['rangeLu']:+} LU · the spectrum's "
              f"middle {d['centroid']:+.1%} — {'a choice' if r['clearsTheScreen'] else 'UNDER a just-noticeable difference'}")
    pic = vdir / "picture.json"
    pages = [m["c0"] for m in json.loads(pic.read_text(encoding="utf-8"))["main"]] if pic.exists() else []
    listing = {"schema": 1, "kind": "master candidates", "version": vdir.name, "made": datetime.date.today().isoformat(),
               "seconds": facts["sound"]["seconds"], "before": before, "pages": pages, "loudestSecond": loudest,
               "jnd": JND, "candidates": rows}
    (out / "candidates.json").write_text(json.dumps(listing, indent=1, ensure_ascii=False) + "\n", encoding="utf-8",
                                         newline="\n")
    print(f"-> {out.relative_to(ROOT).as_posix()}/  ({len(rows)} candidates) — listen: engine/master.html?v={vdir.name}")


def keep(name, vdir, over=False):
    vdir, facts, _ = version_of(vdir)
    cand = BUILD / vdir.name / f"{name}.flac"
    dst = vdir / "master.flac"
    if not cand.exists():
        raise SystemExit(f"no candidate {cand}")
    if dst.exists() and not over:
        raise SystemExit(f"{dst} is already kept — a master is not written over (say --over to replace it)")
    rep = json.loads(cand.with_suffix(".json").read_text(encoding="utf-8"))
    rep.update({"file": dst.name, "kept": datetime.date.today().isoformat(), "keptAs": name})
    shutil.copy(cand, dst)
    (vdir / "master.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False) + "\n", encoding="utf-8",
                                      newline="\n")
    # its dials become the voice's: what the next version's master is made with
    spec, f = spec_of(facts.get("voice"))
    if f.parent.exists():
        spec["dials"] = rep["dials"]
        spec.update({"schema": 1, "kind": "master dials"})
        f.write_text(json.dumps(spec, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    # the shelf says which file a version plays
    shelf = vdir.parent / "shelf.json"
    if shelf.exists():
        s = json.loads(shelf.read_text(encoding="utf-8"))
        for row in s.get("versions", []):
            if row.get("folder") == vdir.name:
                row["plays"] = dst.name
        shelf.write_text(json.dumps(s, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    print(f"kept: {dst} ({name}); its dials are the voice's now" + ("; the shelf plays it" if shelf.exists() else ""))


# ---- the self-test: made-up sounds, where the right answer is known ----
def selftest():
    sr, ok = 48000, True
    t = np.arange(sr * 2) / sr
    stereo = lambda m: np.stack([m, m], axis=1)
    tone = lambda hz, amp, ph=0.0: stereo(amp * np.sin(2 * np.pi * hz * t + ph))
    mid = slice(sr // 2, sr + sr // 2)
    top = db(10 ** (-1 / 20) - 2 / 32768)

    def check(what, good, got):
        nonlocal ok
        ok &= bool(good)
        print(f"  {'pass' if good else 'FAIL'}  {what}: {got}")

    rng = np.random.default_rng(7)
    quiet = stereo(rng.uniform(-0.5, 0.5, sr * 2))
    soft = quiet * 0.4
    y, st, touched = limit(soft, sr, -1.0)
    check("under the ceiling the limiter changes nothing", np.array_equal(y, soft) and not touched.any(),
          f"largest difference {float(np.abs(y - soft).max())} (white noise, the wave's peak {db(float(peaks(soft).max())):.2f} dB)")
    y, st, touched = limit(quiet, sr, -1.0)
    # the hardest case there is — the gain moving on every sample of a full-band noise. The limiter's own
    # arithmetic holds the SAMPLES exactly and the wave between them to a few thousandths of a dB;
    # the file's ceiling is then held by the second meter (master(), below)
    check("white noise at -6 dB: its samples are under the ceiling, the wave between them is not, and is held",
          bool(touched.any()) and db(float(np.abs(y).max())) <= -1.0 and db(float(peaks(y).max())) <= -0.98,
          f"the wave's peak {db(float(peaks(quiet).max())):.2f} -> {db(float(peaks(y).max())):.3f} dB, "
          f"the loudest sample {db(float(np.abs(y).max())):.3f} dB")
    for hz in (60, 220, 1000):
        y, st, _ = limit(tone(hz, 2.0), sr, -1.0)
        p, tp = db(float(np.abs(y).max())), db(float(peaks(y)[mid].max()))
        check(f"a {hz} Hz tone 6 dB over full scale leaves at the ceiling", p <= -1.0 and tp <= -0.95 and p > -1.2,
              f"loudest sample {p:.3f} dB, true peak {tp:.3f} dB")
    burst = stereo(2.0 * np.minimum(1, np.maximum(0, (t - 0.5) * 1000)) * np.exp(-np.maximum(0, t - 0.5) * 20)
                   * np.sin(2 * np.pi * 440 * t))
    y, st, _ = limit(burst, sr, -1.0)
    check("a struck burst 6 dB over, 1 ms to rise", db(float(np.abs(y).max())) <= -1.0,
          f"loudest sample {db(float(np.abs(y).max())):.3f} dB")
    # a tone at a quarter of the rate, an eighth of a cycle off: every sample is 3 dB under the wave's own peak
    q = tone(sr / 4, 1.0, np.pi / 4)
    read = db(float(peaks(q)[mid].max()))
    check("the peak between the samples is read", abs(read) < 0.05,
          f"loudest sample {db(float(np.abs(q).max())):.2f} dB, the wave's peak read {read:.3f} dB (it is 0)")
    y, st, _ = limit(q, sr, -1.0)
    held = db(float(peaks(y)[mid].max()))
    check("… and held: samples under the ceiling, the wave over it", held <= -1.0, f"true peak after {held:.3f} dB")
    click = np.zeros((sr, 2))
    click[sr // 2] = 0.99
    y, _, _ = limit(click, sr, -1.0)
    z = lowpass(click, sr, 2000)
    w, _ = compress(click, sr, {"thresholdDb": -40})
    at = [int(np.argmax(np.abs(v[:, 0]))) for v in (y, z, w)]
    check("nothing moves in time (a click, through each stage)", at == [sr // 2] * 3, f"at sample {at}, put at {sr // 2}")
    lev = lambda v: db(float(np.sqrt((v[mid] ** 2).mean()) * math.sqrt(2)))
    got = [round(lev(lowpass(tone(hz, 0.1), sr, 2000)) + 20, 2) for hz in (200, 2000, 8000)]
    check("the low-pass at 2 kHz: 200 Hz · 2 kHz · 8 kHz",
          abs(got[0]) < 0.02 and abs(got[1] + 3.01) < 0.05 and abs(got[2] + 24.1) < 0.1, f"{got} dB (0 · -3.01 · -24.1)")
    c = {"thresholdDb": -18.0, "ratio": 2.0, "kneeDb": 6.0}
    loud, soft, at_thr = tone(220, 10 ** (-6 / 20)), tone(220, 10 ** (-21 / 20)), tone(220, 10 ** (-15 / 20))
    g = [lev(compress(v, sr, c)[0]) - lev(v) for v in (loud, soft, at_thr)]
    check("the compressor: 9 dB over its threshold · 6 under · on it",
          abs(g[0] + 4.5) < 0.1 and g[1] == 0 and abs(g[2] + 0.375) < 0.05,
          f"{g[0]:.2f} · {g[1]:.2f} · {g[2]:.3f} dB (-4.5 · 0 · -0.375)")
    # a file, there and back: 16 bits, a few peaks over the ceiling, the limiter alone
    d = BUILD / "_selftest"
    x = np.clip(quiet * 0.6 + tone(330, 0.75) * (np.abs(t - 1.0) < 0.05)[:, None], -1, 1)
    d.mkdir(parents=True, exist_ok=True)
    sf.write(str(d / "in.flac"), np.rint(x * 32767).astype(np.int16), sr, subtype="PCM_16")
    rep = master(d / "in.flac", d / "out.flac", {}, say=lambda s: None)
    check("a file through it, the limiter alone", rep["untouchedSamplesThatChanged"] == 0 and rep["frames"] == len(x)
          and rep["after"]["truePeakDb"] <= -1.0 and rep["limiter"]["samplesTurnedDown"] > 0,
          f"{rep['frames']} frames in and out · {rep['untouchedSamplesThatChanged']} untouched samples changed · true peak "
          f"{rep['before']['truePeakDb']} -> {rep['after']['truePeakDb']} dB (ffmpeg), {rep['after']['truePeakDbOwn']} (own) · "
          f"{rep['limiter']['rounds']} round(s), the limiter asked for {rep['limiter']['askedOfItDb']} dB")
    shutil.rmtree(d)
    print("MASTER SELFTEST " + ("PASS" if ok else "FAIL"))
    return ok


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="A version's master: a mastering pass on a finished sound file.")
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--candidates", action="store_true", help="make what the voice's master.json puts to his ear")
    ap.add_argument("--keep", metavar="NAME", help="keep a candidate as the version's master")
    ap.add_argument("--over", action="store_true", help="with --keep: replace a master already kept")
    ap.add_argument("--into", action="store_true", help="a version, at its voice's dials: the master beside its sound")
    ap.add_argument("--lowpass", type=float)
    ap.add_argument("--comp", action="store_true", help="the compressor on, at its starting numbers")
    ap.add_argument("--ceiling", type=float)
    a = ap.parse_args()
    if a.selftest:
        sys.exit(0 if selftest() else 1)
    if a.candidates and len(a.paths) == 1:
        candidates(a.paths[0])
    elif a.keep and len(a.paths) == 1:
        keep(a.keep, a.paths[0], a.over)
    elif len(a.paths) == 1:                                           # a version, at its voice's dials
        vdir, facts, src = version_of(a.paths[0])
        spec, _ = spec_of(facts.get("voice"))
        out = (vdir if a.into else BUILD / vdir.name) / "master.flac"
        if a.into and out.exists():
            raise SystemExit(f"{out} is already made - a master is not written over")
        master(src, out, {**DIALS, **spec["dials"]})
    elif len(a.paths) == 2:                                           # any file
        d = {**DIALS, "lowpassHz": a.lowpass, "compressor": dict(COMP) if a.comp else None}
        if a.ceiling is not None:
            d["ceilingDb"] = a.ceiling
        master(a.paths[0], a.paths[1], d)
    else:
        ap.print_help()
