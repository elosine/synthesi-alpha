"""A page's containers, PRE-PROCESSED through icy (first-scenario plan P2g, page 8; journal §242).

    python tools/icy_render.py 8     ->  voices/v-alpha/renders/page-8/set31.ogg … + manifest.json

J, §242: "the containers are processed with the IC and then the IC processed
containers become the new samples essentially. So the main electronic reads
them as is, uh, not with IC, but then the cursors and the accents are reading
the IC processed version, wherever they're reading from."

For every container that shows on the page (the scenario file's "showing"),
one of his icys — "the normal ones and then the [accel] ones, just roll": a
shuffled deck of all the icy overlays, from the piece's seed and the page —
and the container read through it, start to end, into a sound file. The
read is the page's own (engine/playhead-processor.js, as engine/voices.js
`readOf` sets it): the read point crawls at `speed` of real time — or from
one speed to another, by equal ratios in equal times — while grains `win`
seconds long, `overlaps` at once, each read FORWARD at pitch through one of
his windows, its length straying by `rand`.

Each render is brought to the level (RMS) of the container it was made from —
the rule for a stretched sound (journal §220). The manifest says, for each
container, which icy, how long the render is, and how a place in the
container maps to a time in the render, so that a cursor reading at a place
reads the render THERE.

This is his "as little live processing as possible" (§221) done for one
page: the icy is made once, here, and the page only plays a file.
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
out_dir = ROOT / f"voices/v-alpha/renders/page-{page}"
out_dir.mkdir(parents=True, exist_ok=True)
x, sr = sf.read(ROOT / "voices/v-alpha/layers" / (replay["audio"] + ".flac"), always_2d=True)

icys = [o for o in scn["overlays"]["presets"] if o["kind"] == "icy"]
rng = np.random.default_rng(scn["seed"] * 7919 + page * 104729)
deck = []


def deal():
    global deck
    if not deck:
        deck = list(rng.permutation(len(icys)))
    return icys[deck.pop()]


def render(t0, t1, o):
    """the container t0 … t1 read through icy `o`: the worklet's read, grain by grain"""
    s = o["speed"]
    s0, s1 = (s, s) if not isinstance(s, list) else s
    length = t1 - t0
    lasts = length / s0 if s0 == s1 else length * math.log(s1 / s0) / (s1 - s0)
    n = int(lasts * sr)
    G = int(round(o["win"] * sr))
    hop = max(1, int(round(G / o["overlaps"])))
    W = np.array(windows[o.get("window") or "hanning"])
    r = s1 / s0
    frac = (lambda u: u) if r == 1 else (lambda u: (r ** u - 1) / (r - 1))
    out = np.zeros((n + 2 * G, x.shape[1]))
    for at in range(0, n, hop):
        g = max(8, int(G * (1 + o.get("rand", 0) * (2 * rng.random() - 1))))
        a0 = int(t0 * sr + length * sr * frac(at / n))
        seg = x[a0:a0 + g]
        if len(seg) < 8:
            continue
        w = np.interp(np.linspace(0, len(W) - 1, len(seg)), np.arange(len(W)), W)
        out[at:at + len(seg)] += seg * w[:, None]
    out = out[:n]
    src = x[int(t0 * sr):int(t1 * sr)]
    gain = np.sqrt(np.mean(src ** 2)) / max(np.sqrt(np.mean(out ** 2)), 1e-12)     # one loudness: the container's own level
    out *= gain
    f = int(0.02 * sr)
    out[:f] *= np.linspace(0, 1, f)[:, None]
    out[-f:] *= np.linspace(1, 0, f)[:, None]
    return out, lasts, 20 * math.log10(gain)


rows = []
for c in sec["showing"]:
    o = deal()
    y, lasts, gain_db = render(c["t0"], c["t1"], o)
    peak = float(np.max(np.abs(y)))
    if peak > 0.98:
        y *= 0.98 / peak
    name = f"set{c['set']}.ogg"
    # through a wav and ffmpeg: libsndfile's own Vorbis writer dies on a long file here (journal §242)
    tmp = ROOT / "build" / "renders-tmp.wav"
    tmp.parent.mkdir(exist_ok=True)
    sf.write(tmp, y, sr, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-c:a", "libvorbis", "-q:a", "6",
                    str(out_dir / name)], check=True)
    tmp.unlink()
    rows.append({"set": c["set"], "t0": c["t0"], "t1": c["t1"], "icy": o["name"], "speed": o["speed"],
                 "win": o["win"], "overlaps": o["overlaps"], "window": o.get("window"), "rand": o.get("rand", 0),
                 "lasts": round(lasts, 3), "gainDb": round(gain_db, 1), "file": name})
    print(f"set {c['set']:>2}  {c['t1'] - c['t0']:5.2f} s  ->  {o['name']:<15} {lasts:6.1f} s   level matched by {gain_db:+5.1f} dB"
          f"   peak {20 * math.log10(max(peak, 1e-9)):+5.1f} dBFS   {(out_dir / name).stat().st_size / 1e6:.2f} MB")

(out_dir / "manifest.json").write_text(json.dumps({
    "_about": "A page's containers pre-processed through icy (tools/icy_render.py; journal 242). For a container: the icy it "
              "was read through, how long the render lasts, and its speed - a place p (s) in the container is at "
              "(p - t0) / speed seconds of the render; with a speed [from, to] it is at lasts * ln(1 + f (r - 1)) / ln r, "
              "f = (p - t0) / (t1 - t0), r = to / from.",
    "page": page, "seed": scn["seed"], "tool": "tools/icy_render.py", "journal": "242",
    "sampleRate": sr, "containers": rows}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
print("->", (out_dir / "manifest.json").relative_to(ROOT))
