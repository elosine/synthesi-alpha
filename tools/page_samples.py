"""A page's containers, PRE-PROCESSED into the samples its cursors read (first-scenario plan P2g,
pages 9 … 12; journal §243). The general form of tools/icy_render.py (page 8, left as it was).

    python tools/page_samples.py 9      ->  voices/v-alpha/renders/page-9/…  + manifest.json

J, §242: "the IC processed containers become the new samples essentially ... the cursors and
the accents are reading the IC processed version, wherever they're reading from." And §243, a
recipe for each page — read here from the page's design in the scenario file, `"samples"`:

  "mix": [kind, kind …]   the containers that show are dealt these kinds turn about, in an order
                          from the seed — two kinds are "half and half" (the first-named has the
                          odd one). Kinds:
                            "icy"          any of his icys, from a shuffled deck
                            "icy moving"   only the ones whose read changes speed (accel / decel)
                            "icy steady"   only the straightforward ones
                            "override"     the buffer override, ONE TURN of its wave across the
                                           container: "low to high, then back down to low for the
                                           duration of that container"
                            "original"     the container as it is — no file is made
  "over half": "override" half of what was made (the odd one too) is processed AGAIN, the override
                          over the render — "it's like in layers"

The icy read and the override are the page's own, ported sample for sample: engine/
playhead-processor.js as engine/voices.js `readOf` sets it, and engine/override-processor.js with
his settings (the scenario file's "override wave") and the turn fitted as page 6's is — 40 % up,
20 % at the top, 40 % down. Every render is brought to the level (RMS) of what it was made from.
"""
import json
import math
import pathlib
import subprocess
import sys

import numpy as np
import soundfile as sf

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
scn = json.loads((ROOT / "voices/v-alpha/scenario/scenario-1.json").read_text(encoding="utf-8"))
replay = json.loads((ROOT / "voices/v-alpha/score/replay-index.json").read_text(encoding="utf-8"))
windows = json.loads((ROOT / "engine/grain-windows.json").read_text(encoding="utf-8"))["windows"]

page = int(sys.argv[1])
sec = scn["sections"][page - 1]
recipe = sec["design"]["samples"]
out_dir = ROOT / f"voices/v-alpha/renders/page-{page}"
out_dir.mkdir(parents=True, exist_ok=True)
for old in out_dir.glob("*.ogg"):
    old.unlink()
x, sr = sf.read(ROOT / "voices/v-alpha/layers" / (replay["audio"] + ".flac"), always_2d=True)
rng = np.random.default_rng(scn["seed"] * 7919 + page * 104729 + 1)

presets = scn["overlays"]["presets"]
icys = [o for o in presets if o["kind"] == "icy"]
OVR = next(o for o in presets if o["name"] == "override wave")
decks = {}


def deal(kind):
    pool = [o for o in icys if kind == "icy" or isinstance(o["speed"], list) == (kind == "icy moving")]
    d = decks.setdefault(kind, [])
    if not d:
        d.extend(rng.permutation(len(pool)).tolist())
    return pool[d.pop()]


def rms(y):
    return float(np.sqrt(np.mean(y ** 2))) or 1e-12


def icy_read(src, o):
    """`src` read through icy `o`: the worklet's read, grain by grain"""
    s = o["speed"]
    s0, s1 = (s, s) if not isinstance(s, list) else s
    length = len(src) / sr
    lasts = length / s0 if s0 == s1 else length * math.log(s1 / s0) / (s1 - s0)
    n = int(lasts * sr)
    G = int(round(o["win"] * sr))
    hop = max(1, int(round(G / o["overlaps"])))
    W = np.array(windows[o.get("window") or "hanning"])
    r = s1 / s0
    frac = (lambda u: u) if r == 1 else (lambda u: (r ** u - 1) / (r - 1))
    pad = np.concatenate([src, np.zeros((2 * G, src.shape[1]))])
    out = np.zeros((n + 2 * G, src.shape[1]))
    for at in range(0, n, hop):
        g = max(8, int(G * (1 + o.get("rand", 0) * (2 * rng.random() - 1))))
        a0 = int(len(src) * frac(at / n))
        seg = pad[a0:a0 + g]
        w = np.interp(np.linspace(0, len(W) - 1, len(seg)), np.arange(len(W)), W)
        out[at:at + len(seg)] += seg * w[:, None]
    return out[:n] * (rms(src) / rms(out[:n]))


def override(src, fit=(0.4, 0.2)):
    """`src` through the buffer override, one turn of its wave across the whole of it: the unit's own
    loop (engine/override-processor.js) — forced buffers, the first sliver of each repeated, the joins
    crossfaded with equal power — its rate and its size moving together.

    THREE JOINS MENDED, here and in the unit alike (the piece's log §11, §12 · engine journal 264). Each
    had been a cut, and on a long loud wave a click:
      1. a forced buffer begins — it CROSSES IN over one join's length, the sliver that was repeating
         running on under it (it used to cut in, mid-wave);
      2. a pass begins shorter than the one before — the pass that fades out is read on from where IT
         ended (it used to be read from where a pass of the new length would have);
      3. a pass is never cut short to fit what is left of the forced buffer — it begins whole, and the
         next forced buffer crosses in over it (a pass used to be shortened to fit, its join with it:
         down to eight samples, with a join of one)."""
    n = len(src)
    D = n / sr
    T, S = fit[0] * D, fit[1] * D
    (r0, r1), (b0, b1), sm = OVR["rate"], OVR["buf"], OVR.get("smooth", 0.1)
    ease = lambda v: (1 - math.cos(math.pi * v)) / 2

    def along(t):
        return ease(t / T) if t < T else 1 if t < T + S else ease(1 - (t - T - S) / T) if t < 2 * T + S else 0

    ia, ib = np.zeros(n, dtype=np.int64), np.zeros(n, dtype=np.int64)
    ga, gb = np.ones(n), np.zeros(n)
    # the sliver that is ending, under a forced buffer's first join — and the forced buffer coming in
    ic, id_ = np.zeros(n, dtype=np.int64), np.zeros(n, dtype=np.int64)
    gc, gd, hn = np.zeros(n), np.zeros(n), np.ones(n)
    left = start = ph = 0
    period = fade = tail = 8
    first = True
    for i in range(n):
        if left <= 0:
            was = (start, ph, fade, first, tail, i - start) if i else None
            u = along(i / sr)
            left = max(64, int(round(b0 * (b1 / b0) ** u * sr)))
            start, ph, first = i, 0, True
            period = max(8, min(left, int(round(sr / (r0 * (r1 / r0) ** u)))))
            fade = max(1, min(period, int(round(period * sm / (1 - sm)))))
            tail = period
            # MEND 1. (A sliver still in its first pass IS the sound as it comes: there is nothing to cross.)
            if was and not was[3]:
                os_, oph, ofade, _, otail, olen = was
                xn = max(64, min(left // 2, fade))
                for k in range(min(xn, n - i)):
                    h = k / xn
                    hn[i + k], ho = math.sin(math.pi / 2 * h), math.cos(math.pi / 2 * h)
                    a = os_ + oph + k
                    if oph + k < ofade and oph + otail <= olen:      # it was itself in a join: both of its halves run on
                        g = (oph + k) / ofade
                        ic[i + k], gc[i + k] = a, math.sqrt(g) * ho
                        id_[i + k], gd[i + k] = a + otail, math.sqrt(1 - g) * ho
                    else:
                        ic[i + k], gc[i + k] = a, ho
        a = start + ph
        ia[i] = a
        if not first and ph < fade:
            g = ph / fade
            ga[i], gb[i], ib[i] = math.sqrt(g), math.sqrt(1 - g), a + tail          # MEND 2: `tail`, not `period`
        ph += 1
        if ph >= period:
            ph, first = 0, False
            tail = period
            p2 = max(8, int(round(sr / (r0 * (r1 / r0) ** along(i / sr)))))          # MEND 3: not min(left, …)
            if p2 < period:
                period = p2
                fade = max(1, min(period, int(round(period * sm / (1 - sm)))))
        left -= 1
    lim = lambda v: np.minimum(v, n - 1)
    out = ((src[ia] * ga[:, None] + src[lim(ib)] * gb[:, None]) * hn[:, None]
           + src[lim(ic)] * gc[:, None] + src[lim(id_)] * gd[:, None])
    # brought to the level of what it was made from - and then the effect's own makeup (J, journal 245: +3 dB)
    return out * (rms(src) / rms(out)) * 10 ** (OVR.get("makeupDb", 0) / 20)


def write(y, name):
    y = y.copy()
    f = int(0.02 * sr)
    y[:f] *= np.linspace(0, 1, f)[:, None]
    y[-f:] *= np.linspace(1, 0, f)[:, None]
    peak = float(np.max(np.abs(y)))
    if peak > 0.98:
        print(f"      (peak {20 * math.log10(peak):+.1f} dBFS: turned down {20 * math.log10(peak / 0.98):.1f} dB to fit)")
        y *= 0.98 / peak
    tmp = ROOT / "build" / "renders-tmp.wav"
    tmp.parent.mkdir(exist_ok=True)
    sf.write(tmp, y, sr, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-c:a", "libvorbis", "-q:a", "6",
                    str(out_dir / name)], check=True)
    tmp.unlink()
    return (out_dir / name).stat().st_size / 1e6


shows = sec["showing"]
n = len(shows)
# "half and half" is dealt where the page's SOUNDS are: the containers are taken in the order of how
# many of the page's phrases and accents sit in them (ties by the seed) and given the kinds turn
# about - so each kind is HEARD. (Dealt by a plain shuffle, page 11's seven sounds all fell in its
# two override containers and its two icy ones held none: journal 243.)
places = [p["t0"] for s in replay["sections"] for p in s["phrases"] if p["id"] in sec["phrases"]] +          [a["at"] for s in replay["sections"] for a in s["impacts"] if a["id"] in sec["accents"]]
holds = [sum(c["t0"] <= t < c["t1"] for t in places) for c in shows]
tie = rng.permutation(n).tolist()
order = sorted(range(n), key=lambda i: (-holds[i], tie[i]))
first = int(rng.integers(len(recipe["mix"])))
kinds = [None] * n
for j, i in enumerate(order):
    kinds[i] = recipe["mix"][(j + first) % len(recipe["mix"])]
made = [i for i in order if kinds[i] != "original"]
again = set(made[::2]) if recipe.get("over half") else set()

rows = []
for i, c in enumerate(shows):
    src = x[int(c["t0"] * sr):int(c["t1"] * sr)]
    row = {"set": c["set"], "t0": c["t0"], "t1": c["t1"], "kind": kinds[i], "lasts": round(c["t1"] - c["t0"], 3)}
    if kinds[i] == "original":
        rows.append(row)
        print(f"set {c['set']:>2}  {row['lasts']:5.2f} s  ->  as it is{'':<34} holds {holds[i]} of the page's sounds")
        continue
    if kinds[i].startswith("icy"):
        o = deal(kinds[i])
        y = icy_read(src, o)
        row.update(kind="icy", icy=o["name"], speed=o["speed"], lasts=round(len(y) / sr, 3))
    else:
        y = override(src)
        row.update(kind="override")
    if i in again:
        y = override(y)
        row["kind"] += " + override"
    row["file"] = f"set{c['set']}.ogg"
    mb = write(y, row["file"])
    rows.append(row)
    print(f"set {c['set']:>2}  {c['t1'] - c['t0']:5.2f} s  ->  {row['kind']:<16} {row.get('icy', ''):<15} {row['lasts']:6.1f} s   {mb:.2f} MB   holds {holds[i]}")

(out_dir / "manifest.json").write_text(json.dumps({
    "_about": "A page's containers pre-processed into the samples its cursors read (tools/page_samples.py; journal 243). "
              "kind original = no file: the sound as it is. A place p (s) in a container is, in its render: p - t0 for an "
              "override (it keeps the container's length); (p - t0) / speed for an icy; with a speed [from, to], "
              "lasts * ln(1 + f (r - 1)) / ln r, f = (p - t0) / (t1 - t0), r = to / from.",
    "page": page, "seed": scn["seed"], "tool": "tools/page_samples.py", "journal": "243", "recipe": recipe,
    "sampleRate": sr, "containers": rows}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
print("->", (out_dir / "manifest.json").relative_to(ROOT))
