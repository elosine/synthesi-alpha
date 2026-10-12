"""The piece's own server, with caching disabled.

python tools/serve.py  ->  http://localhost:8733/ at the repo root.

Carried from live-electronics-engine (tools/serve.py), cut down to what
Synthesi Alpha needs: the pages and the sound, the list of played sequences,
and the keeping of a VERSION. Every response says no-store, so a plain reload
always shows what is on disk.
"""
import datetime
import http.server
import json
import math
import os
import pathlib
import re
import shutil
import subprocess

os.chdir(pathlib.Path(__file__).resolve().parent.parent)

PORT = 8733

# ---- A VERSION (docs/PLAN.md S2) ---------------------------------------------
# The workshop page plays the piece from START and sends its own output here, a
# second at a time, 32-bit float; at the end it sends the record of what the
# picture did. A version is then a folder:
#
#   build/versions/<name>/   sound.flac     the piece, lossless (16-bit, packed)
#                            picture.json   where electronics main was, and every sound called
#                            version.json   the seed, the length, the levels, the check, what made it
#                            scenario.json  the scenario file as it stood
#
# build/ is not in git: these are CANDIDATES. One that is kept is copied to
# versions/ (the shelf), which is. A folder that already holds a version is
# not written over unless the page says so (&over=1).
VERSIONS = pathlib.Path("build/versions")
SCENARIO = pathlib.Path("voices/v-alpha/scenario/scenario-1.json")
PATTERNS = pathlib.Path("voices/v-alpha/library/patterns")
version_chunks = {}


def db(v):
    return round(20 * math.log10(v), 2) if v > 0 else None


def finish_version(d, body):
    import numpy as np
    raw, flac = d / "sound.f32", d / "sound.flac"
    sr, n = int(body["sampleRate"]), raw.stat().st_size // 8
    if n != int(body["frames"]):
        raise ValueError(f"the page sent {body['frames']} frames, {n} arrived")
    peak, over, sumsq = 0.0, 0, 0.0
    with open(raw, "rb") as f:
        while True:
            c = np.abs(np.fromfile(f, dtype="<f4", count=1 << 22).astype(np.float64))
            if not len(c):
                break
            peak = max(peak, float(c.max()))
            over += int((c > 1.0).sum())
            sumsq += float((c * c).sum())
    # float to 16-bit with triangular dither, then packed lossless
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(sr), "-ac", "2", "-i", str(raw),
                    "-af", "aresample=osf=s16:dither_method=triangular", "-c:a", "flac", "-compression_level", "8",
                    str(flac)], check=True)
    raw.unlink()
    shutil.copy(SCENARIO, d / "scenario.json")
    git = lambda *a: subprocess.run(["git", *a], capture_output=True, text=True).stdout.strip()
    picture = body.pop("picture")
    last = max([s["end"] for s in picture["sounds"]] + [m["c1"] for m in picture["main"]] + [0])
    version = {
        "schema": 1, "kind": "version", "piece": body.get("piece"), "voice": body.get("voice"),
        "name": d.name, "seed": body.get("seed"), "made": datetime.date.today().isoformat(),
        "partial": body.get("partial"),
        "sound": {"file": "sound.flac", "sampleRate": sr, "channels": 2, "bits": 16, "frames": n,
                  "seconds": round(n / sr, 3), "bytes": flac.stat().st_size, "wavBytes": n * 4 + 44,
                  "peakDb": db(peak), "rmsDb": db(math.sqrt(sumsq / max(1, 2 * n))),
                  "samplesOverFull": over},
        "length": {"mainEnds": picture["main"][-1]["c1"] if picture["main"] else None,
                   "lastSoundEnds": round(last, 3), "all": round(n / sr, 3)},
        "picture": {"file": "picture.json", "runs": len(picture["main"]), "sounds": len(picture["sounds"])},
        "recorder": {"gaps": body.get("gaps"), "chunks": body.get("chunks")},
        "check": body.get("check"),
        "workshop": {"repo": "synthesi-alpha", "commit": git("rev-parse", "HEAD"),
                     "clean": git("status", "--porcelain") == ""},
    }
    (d / "picture.json").write_text(json.dumps(picture, ensure_ascii=False, separators=(",", ":")) + "\n",
                                    encoding="utf-8", newline="\n")
    (d / "version.json").write_text(json.dumps(version, indent=1, ensure_ascii=False) + "\n",
                                    encoding="utf-8", newline="\n")
    return version


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        if self.path.startswith("/version-"):
            m = re.fullmatch(r"/version-(begin|chunk|end|abort)\?name=([a-z0-9-]{1,40})(?:&i=(\d+))?(&over=1)?",
                             self.path)
            if not m:
                self.send_error(400, "bad version request")
                return
            op, name, i, over = m.groups()
            d = VERSIONS / name
            raw = d / "sound.f32"
            try:
                if op == "begin":
                    if (d / "sound.flac").exists() and not over:
                        self.send_error(409, "this version is already made")
                        return
                    d.mkdir(parents=True, exist_ok=True)
                    for f in ("sound.f32", "sound.flac", "picture.json", "version.json", "scenario.json"):
                        (d / f).unlink(missing_ok=True)
                    raw.write_bytes(b"")
                    version_chunks[name] = 0
                elif op == "chunk":
                    if not 0 < n <= (8 << 20) or name not in version_chunks:
                        self.send_error(400, "no such version open, or a bad block")
                        return
                    if int(i if i is not None else -1) != version_chunks[name]:
                        self.send_error(409, f"block {i} out of order: {version_chunks[name]} expected")
                        return
                    with open(raw, "ab") as f:
                        f.write(self.rfile.read(n))
                    version_chunks[name] += 1
                elif op == "abort":
                    version_chunks.pop(name, None)
                    raw.unlink(missing_ok=True)
                else:
                    if name not in version_chunks or not 0 < n <= (64 << 20):
                        self.send_error(400, "no such version open")
                        return
                    out = json.dumps(finish_version(d, json.loads(self.rfile.read(n)))).encode()
                    version_chunks.pop(name, None)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(out)))
                    self.end_headers()
                    self.wfile.write(out)
                    return
            except Exception as e:
                self.send_error(500, str(e)[:200])
                return
            self.send_response(204)
            self.end_headers()
            return
        # A take: the workshop page records its own output (compressed, the
        # browser's own recorder) and posts it here — for a clip, not a version.
        if self.path.startswith("/store-take"):
            m = re.fullmatch(r"/store-take\?name=([a-z0-9-]{1,60})", self.path)
            if not m or not 0 < n <= (16 << 20):
                self.send_error(400, "bad take name or size")
                return
            out = pathlib.Path("build/takes") / (m.group(1) + ".webm")
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_bytes(self.rfile.read(n))
            self.send_response(204)
            self.end_headers()
            return
        self.send_error(404)

    def do_GET(self):
        # the played sequences, as a list
        if self.path == "/list-patterns":
            entries = []
            for f in sorted(PATTERNS.glob("*.json"), key=lambda p: int(re.sub(r"\D", "", p.stem) or 0)):
                try:
                    entries.append(json.loads(f.read_text(encoding="utf-8")))
                except Exception:
                    pass
            out = json.dumps(entries).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(out)))
            self.end_headers()
            self.wfile.write(out)
            return
        super().do_GET()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("", PORT), Handler).serve_forever()
