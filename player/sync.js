// THE STAGE — several machines kept together (docs/PLAN.md S4; build chunk B4; log §15).
//
// J, engine journal §254: "the thing to accomplish is really just to get everyone's video to sync with
// the audio" · "if the video falls out of sync with the audio a little bit, it's not ideal, but it's not
// the end of the concert. However, if video playback stops altogether when the network drops, then
// that's a problem" · "I don't think it needs to be overwrought".
//
// ONE machine has the sound. Every other machine draws the picture on ITS OWN CLOCK and keeps that clock
// to where the sound is. The design is for_seven_tubas' (docs/ENGINE_BRIEF.md §3) cut to the smallest
// thing that obeys it — no rooms, no parts, no portal — with one departure: there every stand keeps to
// the server's clock; here every screen keeps to the SOUND, which cannot be nudged and is what the hall
// hears the picture against.
//
//   · the small server (tools/serve.py, /sync/…) holds a few words of state and its own clock;
//   · every machine learns how its clock stands to the server's, the way NTP does — a question, the
//     server's time, the answer back: the offset is known to half the round trip. The best of the last
//     few is kept;
//   · the sound machine says, every two seconds, "at this server time the sound heard was HERE";
//   · a screen sets that against its own clock (makeFollower, below).
//
// THE FLOOR RULE (his, ruled in the tubas' piece): the machine's own clock is the floor; the network is
// an adviser that must clearly do better, or be ignored. So: no word from the network changes nothing —
// the screen runs on. A correction is EARLY AND TINY, never late and big: nothing is done inside what
// the clock estimate can itself be wrong by; past that the picture runs at most 1.5 % fast or slow until
// it is back, which nobody sees. It JUMPS only where a jump cannot be seen as one: the first word after
// a start (the score stands still for the piece's first three seconds), or when it is more than a
// quarter of a second out (a start it missed).
//
// Nothing here needs a frame or a timer of the page's to keep time: it runs off the answers as they
// come, so a page the browser is holding back still keeps its place.

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- a screen's clock: seconds of the sound file, from the machine's own milliseconds ----
export function makeFollower(o = {}) {
  const DEAD = o.dead ?? 0.008;          // s: inside this nothing is done
  const MOST = o.most ?? 0.015;          // the most the picture runs fast or slow: 1.5 %
  const OVER = o.over ?? 4;              // s: a nudge aims to be back in this long
  const JUMP = o.jump ?? 0.25;           // s: further out than this is not nudged — it is set
  let p0 = 0, t0 = 0, rate = 1, until = Infinity, locked = false, going = false, rest = 0, settling = 0;
  const log = [];                        // every word from the sound: { p, e, unc, did }
  const at = p => p <= until ? t0 + (p - p0) * rate / 1000
                             : t0 + (until - p0) * rate / 1000 + (p - until) / 1000;   // a nudge done: its own speed again
  const set = (tau, p) => { t0 = tau; p0 = p; rate = 1; until = Infinity; };
  return {
    log,
    going: () => going,
    locked: () => locked,
    rate: p => (going && p <= until ? rate : 1),
    now: p => (going ? at(p) : rest),
    // by hand, or ahead of the sound's first word: from `tau`, now
    start(p, tau = 0) { set(tau, p); going = true; locked = false; settling = 2; },
    stop(p) { if (going) { rest = at(p); going = false; locked = false; } },
    // the sound's word, brought to this machine's clock: at p the sound is at `tau`, known to ± unc (s).
    // `still`: the picture is not yet moving (the caller knows) — a place may be set without it showing
    hear(tau, p, unc, still = false) {
      if (!going) { set(tau, p); going = true; locked = true; settling = 1; log.push({ p, e: 0, unc, did: 'began' }); return 'began'; }
      const e = tau - at(p);
      let did = 'in step';
      // the first word after a start SETS the place; so does the one after it (the sound's second is
      // its first good look at its own clock) — if it comes while the picture is still at rest
      if (!locked || Math.abs(e) > JUMP || (settling > 0 && still)) { set(tau, p); locked = true; settling = Math.max(0, settling - 1); did = 'set'; }
      else if (Math.abs(e) > Math.max(DEAD, unc + 0.002)) {
        const r = 1 + Math.max(-MOST, Math.min(MOST, e / OVER));
        t0 = at(p); p0 = p; rate = r; until = p + e / (r - 1) * 1000;
        did = 'nudged';
      }
      log.push({ p, e, unc, did });
      if (log.length > 4000) log.splice(0, 1000);
      return did;
    },
  };
}

// ---- the wire: the small server's few words ----
export async function makeSync(h) {
  // this machine's name on the wire: kept through a reload of the page (so that the sound machine,
  // reloaded, is still the one that has the sound), new in a new tab
  let id = Math.random().toString(36).slice(2, 10);
  try { id = sessionStorage.getItem('synthesi-alpha.id') || id; sessionStorage.setItem('synthesi-alpha.id', id); } catch (e) {}
  const post = async (op, body = {}) => {
    if (offline) return { ok: false, status: 0 };
    try {
      const r = await fetch('/sync/' + op, { method: 'POST', body: JSON.stringify({ id, ...body }), cache: 'no-store' });
      return { ok: r.ok, status: r.status, ...(await r.json().catch(() => ({}))) };
    } catch (e) { return { ok: false, status: 0 }; }
  };
  // how this machine's clock stands to the server's. An answer is as good as it was quick (half the
  // round trip) and as it is fresh (two clocks drift apart: 30 parts in a million is allowed for);
  // the best of the last ten minutes is kept — so a bad minute on the network does not spoil it
  const pings = [];
  let lastPing = 0;
  const DRIFT = 30e-6;
  async function ping() {
    const a = performance.now();
    const r = await fetch('/sync/ping', { cache: 'no-store' });
    const b = performance.now(), t = (await r.json()).t;          // the answer's arrival, not the reading of it
    pings.push({ o: t - (a + b) / 2, rtt: b - a, at: b });
    while (pings.length > 120 || pings[0].at < b - 600000) pings.shift();
    lastPing = b;
  }
  const clock = () => {
    if (!pings.length) return null;
    const p = performance.now(), wrong = x => x.rtt / 2000 + (p - x.at) / 1000 * DRIFT;
    const best = pings.reduce((x, y) => (wrong(y) < wrong(x) ? y : x));
    return { o: best.o, unc: wrong(best) };                     // ms to add to performance.now(); s it may be wrong by
  };
  try { for (let i = 0; i < 6; i++) await ping(); } catch (e) { return null; }   // no small server here: this machine is by itself
  let n = -1, alive = true, role = null, version = null, state = null, heardAt = 0, down = false, offline = false;
  const seen = { go: 0, play: 0, stop: 0, report: 0 };
  function take(s) {
    state = s;
    const first = n < 0;
    n = s.n;
    const k = x => (x && x.k) || 0;
    if (first) { seen.go = k(s.go); seen.stop = k(s.stop); }       // what happened before this page came is not news …
    else {
      if (k(s.go) > seen.go) { seen.go = k(s.go); if (s.go.by !== id) h.onGo && h.onGo(s.go); }
      if (k(s.stop) > seen.stop) { seen.stop = k(s.stop); if (s.stop.by !== id) h.onStop && h.onStop(s.stop); }
    }
    // … but where the sound IS, is — a screen opened in the middle of the piece finds its place
    const w = s.playing ? (k(s.report) > k(s.play) ? s.report : s.play) : null;
    if (w && k(w) > seen.report) { seen.report = k(w); heardAt = performance.now(); if (w.by !== id) h.onSound && h.onSound(w); }
    h.onState && h.onState(s);
  }
  (async () => {
    while (alive) {
      if (offline) { await sleep(250); continue; }
      try {
        const r = await fetch(`/sync/wait?since=${n}&id=${id}&role=${role || ''}`, { cache: 'no-store' });
        if (!r.ok) throw new Error(r.status);
        const s = await r.json();
        down = false;
        if (!offline) take(s);
        if (performance.now() - lastPing > 5000) await ping().catch(() => {});
      } catch (e) { down = true; await sleep(1000); }               // the network is gone: nothing here stops for it
    }
  })();
  return {
    id, post, clock,
    hello: (r, v, force) => { role = r; version = v; return post('hello', { role: r, version: v, force: !!force }); },
    // this machine's milliseconds, as the server's — and back
    toServer: p => p + clock().o,
    fromServer: t => t - clock().o,
    state: () => state,
    down: () => down || offline,
    sinceSound: () => (heardAt ? (performance.now() - heardAt) / 1000 : null),
    // a check's switch: this machine as if its network were pulled (it stops asking, and says nothing)
    offline: on => { offline = !!on; },
    isOffline: () => offline,
    close: () => { alive = false; },
  };
}
