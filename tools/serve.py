"""The piece's own server, with caching disabled.

python tools/serve.py  ->  http://localhost:8733/ at the repo root.

Carried from live-electronics-engine (tools/serve.py), cut down to what
Synthesi Alpha needs: the pages and the sound, the list of played sequences,
and the keeping of a VERSION. Every response says no-store, so a plain reload
always shows what is on disk.

And THE STAGE (docs/PLAN.md S4; log 15): the few words that keep several
machines together - /sync/... below. It listens on every address of this
machine, so another machine on the same network opens
http://<this machine's address>:8733/player/ and needs nothing but a browser.
"""
import datetime
import http.server
import json
import math
import os
import pathlib
import re
import shutil
import socket
import subprocess
import sys
import threading
import time

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
#                            scenario.json  the scenario file as it stood, with the version's seed
#                            master.flac    the master (tools/master.py), and master.json, its report
#
# build/ is not in git: these are CANDIDATES. One that is kept is copied to
# versions/ (the shelf), which is. A folder that already holds a version is
# not written over unless the page says so (&over=1).
VERSIONS = pathlib.Path("build/versions")
SHELF = pathlib.Path("versions")
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
    # the scenario file as it stood - with the seed the version was made from, where that is not the
    # file's own (the seed in the address: docs/PLAN.md B5)
    scn = json.loads(SCENARIO.read_text(encoding="utf-8"))
    if body.get("seed") is not None and body["seed"] != scn.get("seed"):
        scn["seed"] = body["seed"]
        (d / "scenario.json").write_text(json.dumps(scn, indent=1, ensure_ascii=False) + "\n", encoding="utf-8",
                                         newline="\n")
    else:
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
    # THE STEP ENDS WITH THE MASTER (docs/PLAN.md S7.5, B5): made beside the sound, at the voice's dials
    # (tools/master.py --into). A take that could not be mastered is still a take: it says so.
    m = subprocess.run([sys.executable, "tools/master.py", "--into", str(d)], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    rep = d / "master.json"
    if m.returncode == 0 and rep.exists():
        a = json.loads(rep.read_text(encoding="utf-8"))
        version["master"] = {"file": a["file"], "dials": a["dials"], "lufs": a["after"]["lufs"],
                             "rangeLu": a["after"]["rangeLu"], "truePeakDb": a["after"]["truePeakDb"],
                             "limiter": {k: a["limiter"][k] for k in ("secondsTurnedDown", "moments", "deepestDb")}}
    else:
        version["master"] = None
        version["masterFailed"] = (m.stderr or m.stdout or "")[-300:]
    (d / "version.json").write_text(json.dumps(version, indent=1, ensure_ascii=False) + "\n",
                                    encoding="utf-8", newline="\n")
    return version


# ---- A SEED'S SAMPLES (docs/PLAN.md B5) ----------------------------------------
# The pre-processed samples of pages 8 ... 12 are made FROM THE SEED. The scenario file's own seed has
# its samples in the piece (voices/v-alpha/renders/, in git). Another seed's are made here, the first
# time a page asks (/samples?seed=N), into build/seeds/seed-N/renders/ - a few minutes - and are found
# there after. One making at a time.
SAMPLES_LOCK = threading.Lock()


def make_samples(seed):
    scn = json.loads(SCENARIO.read_text(encoding="utf-8"))
    if seed == scn.get("seed"):
        return {"seed": seed, "own": True, "made": [], "had": []}
    made, had = [], []
    with SAMPLES_LOCK:
        for sec in scn["sections"]:
            D = sec.get("design") or {}
            if not D.get("source"):
                continue
            page = sec["page"]
            man = pathlib.Path(f"build/seeds/seed-{seed}") / D["source"] / "manifest.json"
            if man.exists() and json.loads(man.read_text(encoding="utf-8")).get("seed") == seed:
                had.append(page)
                continue
            tool = "tools/page_samples.py" if D.get("samples") else "tools/icy_render.py"
            r = subprocess.run([sys.executable, tool, str(page), str(seed)], capture_output=True, text=True,
                               encoding="utf-8", errors="replace")
            if r.returncode != 0 or not man.exists():
                raise RuntimeError(f"page {page}: {(r.stderr or r.stdout)[-300:]}")
            made.append(page)
    return {"seed": seed, "own": False, "made": made, "had": had}


# ---- THE STAGE (docs/PLAN.md S4) ---------------------------------------------
# One machine has the sound; the others draw the picture on their own clocks and
# keep them to where the sound is (player/sync.js says how). What this server
# holds is small: its own clock, who has the sound, and the last few words said -
#
#   go      a machine asked for the piece to begin (any machine may)
#   play    the sound machine: "at this server time the sound heard was HERE" - it has begun
#   report  the same, every two seconds while it plays
#   stop    a machine asked for it to stop (any machine may)
#
# Every word carries k, the count it was said at; a machine asks /sync/wait with
# the count it has and is answered when there is something newer (or after 15 s).
# Nothing here plays, draws or decides. If this server is gone the machines run on.
# n begins at the clock's seconds, so that a server started again never counts from behind what the
# machines already hold
SYNC = {"n": int(time.time()), "version": None, "sound": None, "playing": False, "go": None, "play": None, "stop": None,
        "report": None}
SYNC_CV = threading.Condition()
SYNC_SEEN = {}                    # machine -> (role, when last heard from)
SYNC_FROM = {}                    # machine -> (its address, its browser) - for /sync/who
SYNC_T0 = time.monotonic()


def sync_now():
    """the server's clock, ms - a clock that never steps back or jumps"""
    return round((time.monotonic() - SYNC_T0) * 1000, 3)


def sync_say(op, b):
    """-> (status, answer). Called with SYNC_CV held."""
    who = str(b.get("id", ""))[:16]
    if op == "hello":
        role = b.get("role")
        if role == "sound":
            # the sound is another machine's only while that machine is THERE AS the sound machine: one
            # that has gone, or been reloaded and sits on its shelf again, no longer holds it (his first
            # try, log 16: a page left on the shelf was still "the machine with the sound")
            has = SYNC["sound"]
            was, at = SYNC_SEEN.get(has, (None, 0))
            alive = has and has != who and was == "sound" and time.monotonic() - at < 20
            if alive and not b.get("force"):
                return 409, {"sound": has}
            SYNC["sound"], SYNC["version"] = who, b.get("version")
        SYNC_SEEN[who] = (role, time.monotonic())
    elif op == "go":
        SYNC["go"] = {"k": SYNC["n"] + 1, "by": who}
    elif op in ("play", "report"):
        if op == "play":
            SYNC["playing"], SYNC["report"] = True, None
        if op == "report" and not SYNC["playing"]:
            return 200, {}
        SYNC[op] = {"k": SYNC["n"] + 1, "by": who, "serverTime": float(b["serverTime"]),
                    "fileTime": float(b["fileTime"]), "version": b.get("version")}
    elif op == "stop":
        SYNC["playing"], SYNC["go"] = False, None
        SYNC["stop"] = {"k": SYNC["n"] + 1, "by": who}
    else:
        return 404, {}
    SYNC["n"] += 1
    SYNC_CV.notify_all()
    return 200, {}


class Handler(http.server.SimpleHTTPRequestHandler):
    # one connection is kept and used again: a machine's question about the clock is then answered
    # in a millisecond, and the clock is known that well (a new connection for every question cost
    # 300 ms on this machine, under the name localhost - log 15)
    protocol_version = "HTTP/1.1"

    def sync_answer(self, status, body):
        out = json.dumps({**body, "t": sync_now()}).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(out)))
        self.end_headers()
        self.wfile.write(out)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        if self.path.startswith("/sync/"):
            try:
                b = json.loads(self.rfile.read(n) or b"{}") if 0 <= n <= 4096 else None
                with SYNC_CV:
                    status, body = sync_say(self.path[6:], b) if isinstance(b, dict) else (400, {})
                    body = {**body, "n": SYNC["n"]}
            except Exception:
                status, body = 400, {}
            self.sync_answer(status, body)
            return
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
                    if (SHELF / name).exists():
                        self.send_error(409, "a version of this name is on the shelf")
                        return
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
        if self.path.startswith("/samples"):
            m = re.fullmatch(r"/samples\?seed=(\d{1,6})", self.path)
            if not m:
                self.send_error(400, "bad samples request")
                return
            try:
                out = json.dumps(make_samples(int(m.group(1)))).encode()
            except Exception as e:
                self.send_error(500, str(e)[:300])
                return
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(out)))
            self.end_headers()
            self.wfile.write(out)
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
        if self.path == "/sync/ping":
            self.sync_answer(200, {})
            return
        if self.path == "/sync/who":          # the machines on the wire, for a person to read
            with SYNC_CV:
                now = time.monotonic()
                rows = [{"machine": k, "part": r or "on its shelf", "heardFrom": round(now - at, 1),
                         "address": SYNC_FROM.get(k, ("?", "?"))[0], "browser": SYNC_FROM.get(k, ("?", "?"))[1],
                         "hasTheSound": k == SYNC["sound"]}
                        for k, (r, at) in sorted(SYNC_SEEN.items(), key=lambda kv: kv[1][1], reverse=True)]
            self.sync_answer(200, {"machines": rows, "playing": SYNC["playing"]})
            return
        if self.path.startswith("/sync/wait"):
            m = re.fullmatch(r"/sync/wait\?since=(-?\d+)&id=([a-z0-9]{1,16})&role=([a-z]{0,8})", self.path)
            if not m:
                self.send_error(400, "bad sync request")
                return
            since, who, role = int(m.group(1)), m.group(2), m.group(3)
            with SYNC_CV:
                SYNC_SEEN[who] = (role, time.monotonic())
                SYNC_FROM[who] = (self.client_address[0], (self.headers.get("User-Agent") or "")[-60:])
                SYNC_CV.wait_for(lambda: SYNC["n"] > since, timeout=15)
                SYNC_SEEN[who] = (role, time.monotonic())
                live = [r for r, at in SYNC_SEEN.values() if time.monotonic() - at < 20]
                body = {**SYNC, "machines": {"sound": live.count("sound"), "screen": live.count("screen"),
                                             "waiting": live.count("")}}
            self.sync_answer(200, body)
            return
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


class Server(http.server.ThreadingHTTPServer):
    """listens on every address of this machine, the old kind and the new (IPv4 and IPv6): `localhost`
    is tried on the new kind first, and a server deaf to it answers only after a wait"""
    address_family = socket.AF_INET6

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except Exception:
            pass
        return super().server_bind()


if __name__ == "__main__":
    try:
        srv = Server(("::", PORT), Handler)
    except OSError:                       # a machine without the new kind of address
        srv = http.server.ThreadingHTTPServer(("", PORT), Handler)
    srv.serve_forever()
