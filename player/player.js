// Sýnthesi Alpha — THE PLAYER (docs/PLAN.md S3 · S5; build chunk B3; log §5).
//
// Plays a VERSION from the shelf: its sound file, and the picture drawn from
// the record of what the picture did (versions/README.md — picture.json).
// NO ENGINE INSIDE: no granular reader, no scenario, no seed. Nothing is
// computed in time but where things are drawn. One clock — the sound's.
//
// The page opens on the shelf (versions/shelf.json) and loads ONLY the version
// picked. The sound is loaded WHOLE before [begin]: after ENTER nothing is
// fetched from anywhere.
//
// Keys: ENTER = play from the top · ESCAPE = stop. A second ENTER while it
// plays does nothing.
//
// THE STAGE (the plan's S4; B4; log §15). A machine begins as one of two things:
//   sound and picture   it plays the sound, and draws the picture off the sound's clock;
//   picture only        it loads no sound, draws on its own clock, and keeps that clock to
//                       where the sound is (sync.js).
// Exactly one machine has the sound. ENTER and ESCAPE on ANY machine begin and stop them
// all (his "a": ESCAPE on any machine stops everything). The network gone, every machine
// goes on by itself, and each can be begun and stopped by hand.
//   LEFT and RIGHT   the picture a little later / earlier on THIS machine (10 ms; SHIFT: 1 ms) —
//             a projector delays its picture, and software cannot know by how much. (The arrows:
//             they sit where they sit on every keyboard; [ and ] do not)
//   H         what this machine knows of the others, in a corner
// The picture keeps the shape the form was cut to (1920 × 1080), bars filling the rest.
//
// WITHOUT A KEYBOARD (his, log §19: "tablets won't have access to enter") — on a screen that is
// touched, the resting picture carries one button, [GO]: it does what ENTER does, on every machine,
// and is gone the moment the piece begins. To stop: press and HOLD anywhere for two seconds — a
// brush of the hand does nothing. (His "a": a button, not "tap anywhere" — a stray touch while the
// tablet is set on its stand must not begin the sound in the hall.)
//
// ?alone in the address: this machine by itself — it asks the small server nothing and tells it
// nothing, whatever else is on the stage.
//
// The drawing is the workshop's, copied — engine/perform.html (paintV1,
// makeLens) and engine/scenario.js (paintPic). There it is drawn from the live
// engine; here the same lines are drawn from the record (record.js). The
// animation core is the one file both pages load: engine/score-anim.js.

import { mainAt, soundAt, fracAt, checkPicture, SETTLE, SETTLE_BACK } from './record.js';
import { makeSync, makeFollower } from './sync.js';

const SD = window.SCORE_DATA;
const SHELF = '../versions/';                       // shelf.json, and a folder a version
const STRIP = '../picture/score-strip.svg';
const CONST = { MID: SD.MID, TON0: SD.TON0, TON1: SD.TON1, PXS: SD.PXS, X0: SD.X0 };
const CY0 = 26, CH = 600;                           // the strip's content band (the workshop's)
// the stage — a box of the shape the form was cut to (1920 × 1080: the picture's record says
// it), as large as the window lets it be, bars filling the rest (S4: "a page must be the same
// page on any projector"). Every place below is cut from these two.
const W = () => v1.clientWidth, H = () => v1.clientHeight;
function fit() {
  const [sw, sh] = (ver && ver.pic.screen) || [1920, 1080], k = Math.min(innerWidth / sw, innerHeight / sh);
  const w = Math.round(sw * k), h = Math.round(sh * k);
  Object.assign(v1.style, { width: w + 'px', height: h + 'px', left: ((innerWidth - w) >> 1) + 'px', top: ((innerHeight - h) >> 1) + 'px' });
}
addEventListener('resize', () => { if (begun) fit(); });
const $ = id => document.getElementById(id);
const say = m => { $('lst').textContent = m; };
const fmtT = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;

const v1 = $('v1'), strip1 = $('strip1'), over = $('over');
let ctx = null, ver = null, stripDoc = null, anim1 = null, begun = false;

// ---------- the shelf ----------
const getJson = async url => {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
};
// a file, whole, with how far it has come
async function getBytes(url, onPart) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  const total = +r.headers.get('Content-Length') || 0;
  if (!r.body || !total) return r.arrayBuffer();
  const out = new Uint8Array(total), rd = r.body.getReader();
  for (let got = 0; ;) {
    const { done, value } = await rd.read();
    if (done) break;
    out.set(value, got); got += value.length;
    onPart(got / total);
  }
  return out.buffer;
}
async function openShelf() {
  const list = await getJson(SHELF + 'shelf.json');
  const rows = await Promise.all(list.versions.map(async v =>
    ({ ...v, dir: `${SHELF}${v.folder}/`, facts: await getJson(`${SHELF}${v.folder}/version.json`) })));
  // A CANDIDATE — a version made and not yet kept (build/versions/, not in git; the plan's S5: "he
  // listens; the kept ones go on the shelf"). ?candidate=<its folder> puts it first in the list, so
  // that it can be heard with its picture before it is kept. Its master, if one is made, is played.
  const cand = new URLSearchParams(location.search).get('candidate');
  if (cand && /^[a-z0-9-]{1,40}$/.test(cand)) {
    const dir = `../build/versions/${cand}/`, m = `../build/masters/${cand}/master.flac`;
    const mastered = (await fetch(m, { method: 'HEAD', cache: 'no-store' })).ok;
    rows.unshift({ folder: cand, what: 'a CANDIDATE — made, not on the shelf', verdict: null, dir,
                   facts: await getJson(dir + 'version.json'), plays: mastered ? `../../masters/${cand}/master.flac` : undefined });
  }
  const body = $('rows');
  body.innerHTML = '';
  for (const v of rows) {
    const f = v.facts, tr = document.createElement('tr');
    // the file a version plays: its master when one is kept (the shelf's "plays" — PLAN S7.5), else as it was made
    const cells = [v.folder, v.what || '', f.seed, fmtT(f.sound.seconds), f.made, v.plays ? 'mastered' : 'as made',
                   v.verdict || 'not heard yet', `${f.workshop.repo} · ${String(f.workshop.commit).slice(0, 7)}`];
    for (const c of cells) tr.appendChild(document.createElement('td')).textContent = c;
    tr.addEventListener('click', () => pick(v, tr).catch(e => console.error(e)));
    body.appendChild(tr);
  }
  say(rows.length ? 'click a version' : 'the shelf is empty');
  player.shelf = rows;
}

// ---------- a version, picked: its picture — and, on the machine that has the sound, its sound, whole ----------
let picking = 0;
const buttons = on => { $('go').disabled = $('goScreen').disabled = !on; };
async function pick(v, tr) {
  if (begun) return;
  const mine = ++picking, stale = () => mine !== picking;
  buttons(false);
  ver = null;
  for (const r of $('rows').children) r.classList.toggle('on', r === tr);
  try {
    say(`${v.folder} — the picture…`);
    const pic = await getJson(v.dir + v.facts.picture.file);
    const bad = checkPicture(pic, SD);
    if (bad) throw new Error(bad);
    if (!stripDoc) {
      say(`${v.folder} — the score…`);
      stripDoc = new DOMParser().parseFromString(await (await fetch(STRIP, { cache: 'no-store' })).text(), 'image/svg+xml');
    }
    if (stale()) return;
    ver = { ...v, pic, buffer: null, seconds: v.facts.sound.seconds };
    say(`${v.folder} — picked · ${fmtT(ver.seconds)} · now: does this machine have the sound?`);
    buttons(true);
  } catch (e) {
    if (!stale()) say('FAILED: ' + e.message);
    throw e;
  }
}
// the sound is loaded only where it is played — a machine that shows the picture alone never fetches it
async function loadSound() {
  const v = ver;
  const bytes = await getBytes(v.dir + (v.plays || v.facts.sound.file), f => say(`${v.folder} — the sound… ${(f * 100) | 0}%`));
  say(`${v.folder} — unpacking the sound…`);
  // the context runs at the sound's own rate: every sample of the file in
  // its place, none made up in between (log §5: checked against the file)
  if (ctx) await ctx.close();
  ctx = new AudioContext({ sampleRate: v.facts.sound.sampleRate });
  v.buffer = await ctx.decodeAudioData(bytes);
  v.seconds = v.buffer.duration;
}

// ---------- the sound, and THE ONE CLOCK ----------
// role: 'sound' — this machine plays the sound, and its clock IS the sound's ·
//       'screen' — the picture only: its own clock, kept to the sound's (sync.js)
let role = null, sync = null;
const follow = makeFollower();
let src = null, startAt = 0, playing = false, restAt = 0;
const latency = () => ctx.outputLatency || ctx.baseLatency || 0;
// seconds of the sound file being HEARD now; at rest, where it rests
const heard = () => !playing ? restAt
  : role === 'sound' ? Math.max(0, ctx.currentTime - startAt - latency())
  : Math.max(0, follow.now(performance.now()));
// THE TRIM: this machine's picture a little earlier (+) or later (−) than its clock says — ms, kept on
// the machine. A projector, a television, delay their picture; nothing in software can know by how much.
let trim = 0;
try { trim = +localStorage.getItem('synthesi-alpha.trim') || 0; } catch (e) {}
const shown = () => (playing ? heard() + trim / 1000 : heard());

// where the sound IS, for the others: "at this moment of the server's clock, file time tau was heard".
// The context's clock is read through a main thread that sees it a few ms stale and never early, so of
// the last readings the FRESHEST is kept: the largest (context time − machine time). Twenty seconds
// of them — a busy moment on the page must not leave only stale ones (one word in thirty came 9 ms
// stale from a window of two seconds: log §15); the two clocks drift apart by far less than that in 20 s.
const fresh = [];
function soundNow() {
  const p = performance.now(), d = ctx.currentTime - p / 1000;
  fresh.push([p, d]);
  while (fresh.length > 2400 || fresh[0][0] < p - 20000) fresh.shift();
  let best = -Infinity;
  for (const f of fresh) if (f[1] > best) best = f[1];
  return { p, tau: p / 1000 + best - startAt - latency() };
}
function tell(op) {
  if (!sync || role !== 'sound' || !playing) return;
  const w = soundNow();
  sync.post(op, { serverTime: sync.toServer(w.p), fileTime: w.tau, version: ver.folder });
}
let telling = 0;

// BEGIN THE PIECE — on this machine; and, unless the word came from another, on all of them
function play(told) {
  if (playing || !ver) return;                      // a second ENTER does not begin the piece again
  if (role === 'screen') {
    // ahead of the sound's own word, by this machine's clock: with no network this IS the start
    // ("each machine can be started by hand. Close, not exact"); with one, the sound's first word
    // sets it right, in the three seconds the score stands still
    follow.start(performance.now(), 0);
    playing = true;
    if (sync && !told) sync.post('go');
    return;
  }
  if (ctx.state !== 'running') ctx.resume();
  const s = ctx.createBufferSource(), g = ctx.createGain();
  s.buffer = ver.buffer;
  s.connect(g).connect(ctx.destination);
  startAt = ctx.currentTime + 0.1;
  s.start(startAt);
  s.onended = () => {                               // the end of the file: it stops by itself, and says so
    if (src && src.s === s) { src = null; playing = false; restAt = ver.buffer.duration; clearInterval(telling); if (sync) sync.post('stop'); }
  };
  src = { s, g };
  playing = true;
  // the others are told where the sound is: at once ("it has begun"), again a second on — by when the
  // context's clock has been read often enough to be read WELL — and every two seconds after
  fresh.length = 0;
  let last = performance.now(), gap = 1000;
  clearInterval(telling);
  telling = setInterval(() => {
    const w = soundNow();
    if (w.p - last >= gap) { last = w.p; gap = 2000; tell('report'); }
  }, 25);
  tell('play');
}
// STOP — on this machine; and, unless the word came from another, on all of them
function stop(told) {
  if (!playing) return;
  restAt = heard();                                 // the picture stops with the sound
  playing = false;
  if (role === 'screen') follow.stop(performance.now());
  else {
    const { s, g } = src, t = ctx.currentTime;
    g.gain.setTargetAtTime(0, t, 0.012);            // out in a breath — no click
    s.stop(t + 0.08);
    src = null;
    clearInterval(telling);
  }
  if (sync && !told) sync.post('stop');
}
// the others' words
const heardFrom = {
  onGo() { if (begun && role === 'sound') { play(true); controls(); } },   // a screen asked: the sound begins, and says where it is
  onStop() { if (begun) { stop(true); controls(); } },
  onSound(w) {                                                      // where the sound is — a screen sets its clock by it
    if (!begun || role !== 'screen') return;
    const c = sync.clock(), p = performance.now();
    const tau = w.fileTime + (sync.toServer(p) - w.serverTime) / 1000;
    // the score stands still until electronics main's first run: three seconds in which a place can be set unseen
    const did = follow.hear(tau, p, c.unc, tau < ver.pic.main[0].c0 - 0.3);
    if (did === 'began') { playing = true; controls(); }
  },
};

// ---------- the picture: the score, scrolled under electronics main ----------
function initV1() {
  strip1.appendChild(document.importNode(stripDoc.documentElement, true));
  anim1 = ScoreAnim(strip1, SD.G, SD.ENV, CONST);
}
// sorted grain onsets, for a lens's marks
const ORDER = SD.G.map((g, i) => [g[0], i]).sort((a, b) => a[0] - b[0]);
function grainsIn(t0, t1) {
  let lo = 0, hi = ORDER.length;
  while (lo < hi) { const m = (lo + hi) >> 1; (ORDER[m][0] < t0) ? lo = m + 1 : hi = m; }
  const out = [];
  for (let k = lo; k < ORDER.length && ORDER[k][0] < t1; k++) out.push(ORDER[k][1]);
  return out;
}

// ---------- a lens (the workshop's makeLens — journal §211; whole marks, §245) ----------
// The notation under a sound: for a stretch a … b of the score, the marks that
// BEGIN in it — lifted out of the still score and animated, at any time the
// caller gives. WHOLE MARKS, NO PAPER: a mark that belongs is hidden in the
// still score and its copy moves here, all of it, wherever it goes; every
// other mark stays where it is. Of two sounds on one place THE LATEST WINS,
// mark by mark: a mark a later lens takes is let go by the one that had it,
// and comes back to it when the later one is gone.
let stripById = null, baseById = null;
const holders = new Map();                          // grain → the lenses showing it, the latest last
function makeLens(a, b) {
  if (!stripById) {
    stripById = new Map();
    stripDoc.querySelectorAll('[id]').forEach(e => stripById.set(e.id, e));
  }
  if (!baseById) {
    baseById = new Map();
    strip1.querySelectorAll('[id]').forEach(e => baseById.set(e.id, e));
  }
  const still = (i, on) => {                         // the mark in the still score: shown, or lifted out
    for (let j = 0; j < 4; j++) { const e = baseById.get('g' + i + '_' + j); if (e) e.style.visibility = on ? '' : 'hidden'; }
  };
  const NS = 'http://www.w3.org/2000/svg', ser = n => new XMLSerializer().serializeToString(n);
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('lens');
  svg.style.zIndex = 2;
  svg.style.overflow = 'visible';                  // nothing is cut at its box
  const pad = 6;                                   // strip px beyond the stretch, each end
  const vx = SD.X0 + a * SD.PXS - pad, vw = (b - a) * SD.PXS + 2 * pad;
  const defs = stripDoc.querySelector('defs'), tb = stripDoc.querySelector('filter#toneblur');
  svg.innerHTML = (defs ? ser(defs) : '') + (tb ? ser(tb) : '')
    + `<ellipse id="pl0" cx="0" cy="${SD.MID}" rx="0" ry="0" fill="url(#dust)" opacity="0"/>`;
  svg.setAttribute('viewBox', `${vx} ${CY0} ${vw} ${CH}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  const mine = new Map();                          // grain → its copies here
  const me = {
    a, b, svg, marks: mine,
    show(i, on) { for (const e of mine.get(i) || []) e.style.display = on ? '' : 'none'; },
  };
  for (const i of grainsIn(a, b)) {                 // the marks that BEGIN in the stretch
    const copies = [];
    for (let j = 0; j < 4; j++) {
      const from = stripById.get('g' + i + '_' + j);
      if (from) copies.push(svg.appendChild(document.importNode(from, true)));
    }
    if (!copies.length) continue;
    mine.set(i, copies);
    const had = holders.get(i) || [];
    holders.set(i, had);
    if (had.length) had[had.length - 1].show(i, false); else still(i, false);
    had.push(me);
  }
  v1.appendChild(svg);
  const anim = ScoreAnim(svg, SD.G, SD.ENV, CONST);
  // tn = the score time under the centre cursor now (the lens rides the
  // scroll); t = the time this stretch's notation is to show
  me.paint = (tn, t) => {
    const s = H() / CH;
    svg.setAttribute('width', vw * s);
    svg.setAttribute('height', H());
    svg.style.left = (W() / 2 + s * (SD.PXS * (a - tn) - pad)) + 'px';
    me.tn = tn; me.t = t;
    anim.paintAt(t);
  };
  me.remove = () => {                               // each mark goes back: to the lens before, or to the still score
    for (const i of mine.keys()) {
      const had = holders.get(i) || [], at = had.indexOf(me);
      if (at < 0) continue;
      const top = at === had.length - 1;
      had.splice(at, 1);
      if (top) { if (had.length) had[had.length - 1].show(i, true); else still(i, true); }
      if (!had.length) holders.delete(i);
    }
    svg.remove();
  };
  return me;
}

// ---------- the picture at file time tau (the workshop's paintV1 and paintPic) ----------
const live = new Map();                             // a sound of the record (its index) → its lens, while it is in the picture
let lastTau = 0;
function clearLive() { for (const L of live.values()) L.remove(); live.clear(); }
const mark = style => {
  const d = document.createElement('div');
  Object.assign(d.style, { position: 'absolute' }, style);
  over.appendChild(d);
};
function paint(tau) {
  const pic = ver.pic, S = pic.sounds;
  // electronics main: the score rides under the centre, its own marks moving
  const tv = mainAt(pic, tau), tn = tv - pic.curlag;
  const s = H() / CH;                               // the content band fills the height
  strip1.style.transform = `scale(${s}) translate(${W() / (2 * s) - SD.X0 - tn * SD.PXS}px,${-CY0}px)`;
  anim1.paintAt(tv);
  // the sounds: a lens over each one's stretch, a coloured cursor travelling
  // a phrase, a burst at an attack
  if (tau < lastTau) clearLive();                   // time went back: the lenses are laid again, in their order
  lastTau = tau;
  for (const [i, L] of live) if (!soundAt(S[i], tau)) { L.remove(); live.delete(i); }
  over.innerHTML = '';
  const xOf = T => W() / 2 + s * SD.PXS * (T - tn);
  for (let i = 0; i < S.length; i++) {
    const sd = S[i];
    if (sd.when > tau) break;                       // in order of `when`: nothing further has begun
    const st = soundAt(sd, tau);
    if (!st) continue;
    let L = live.get(i);
    if (!L) live.set(i, L = makeLens(st.a, st.b));
    L.paint(tn, st.t);
    const c = sd.hue;
    if (st.kind === 'attack') {                     // a burst: a bar and a ring, gone with the sound
      const u = st.u, X = xOf(st.at), R = 10 + 46 * u;
      mark({ left: (X - 2) + 'px', top: '0', bottom: '0', width: '4px', background: c, opacity: 0.85 * (1 - u) });
      mark({ left: (X - R) + 'px', top: (H() / 2 - R) + 'px', width: 2 * R + 'px', height: 2 * R + 'px',
             border: `3px solid ${c}`, borderRadius: '50%', boxSizing: 'border-box', opacity: 0.9 * (1 - u) });
    } else {                                        // its phrase, and the cursor travelling it — where the read is
      mark({ left: xOf(st.a) + 'px', top: '0', bottom: '0', width: Math.max(1, xOf(st.b) - xOf(st.a)) + 'px',
             background: c, opacity: 0.10 * st.tail });
      mark({ left: (xOf(st.T) - 1.5) + 'px', top: '0', bottom: '0', width: '3px', background: c, opacity: 0.9 * st.tail });
    }
  }
}
// ---------- what this machine knows of the others (H) ----------
let hudOn = false, noteUntil = 0, noteText = '';
const note = (text, ms = 2500) => { noteText = text; noteUntil = performance.now() + ms; };
const trimSays = () => trim === 0 ? 'the picture as its clock says' : `the picture ${Math.abs(trim)} ms ${trim > 0 ? 'earlier' : 'later'}`;
function paintHud() {
  const hud = $('hud'), now = performance.now(), lines = [];
  if (now < noteUntil) lines.push(noteText);
  if (hudOn) {
    lines.push(`${role === 'sound' ? 'SOUND and picture' : 'picture only'} · ${ver.folder} · ${trimSays()}`);
    if (!sync) lines.push('no small server here: this machine is by itself');
    else {
      const s = sync.state(), c = sync.clock(), m = s && s.machines;
      lines.push(`${sync.down() ? 'THE NETWORK IS GONE — going on alone' : 'the network: ' + (m ? `${m.sound} with the sound, ${m.screen} picture only` : '…')}`
        + (c ? ` · its clock known to ±${(c.unc * 1000).toFixed(1)} ms` : ''));
      if (s && s.version && s.version !== ver.folder) lines.push(`THE SOUND MACHINE HAS ${s.version} — this one has ${ver.folder}`);
      if (role === 'screen') {
        const l = follow.log[follow.log.length - 1], since = sync.sinceSound();
        if (!playing) lines.push('at rest');
        else if (!l) lines.push('begun by hand — no word from the sound yet');
        else lines.push(`from the sound: ${l.e >= 0 ? '+' : '−'}${Math.abs(l.e * 1000).toFixed(1)} ms at its last word (${l.did}) · ${since == null ? '' : since.toFixed(0) + ' s ago'}`
          + (follow.rate(now) !== 1 ? ` · running ${((follow.rate(now) - 1) * 100).toFixed(1)} % ${follow.rate(now) > 1 ? 'fast' : 'slow'}` : ''));
      }
    }
    lines.push('ENTER begin · ESCAPE stop — on every machine · LEFT / RIGHT the picture later / earlier · H hide');
  }
  hud.style.display = lines.length ? 'block' : 'none';
  if (lines.length) hud.textContent = lines.join('\n');
}
// ---------- a start, and a stop, without a keyboard ----------
// A screen that is touched: a tablet, a phone — or any screen, once a finger has been on it.
let touchy = matchMedia('(pointer: coarse)').matches;
const HOLD = 2000;                                   // ms a press must last to stop the piece
let hold = null;
function controls() {
  $('touchGo').style.display = touchy && begun && !playing ? 'block' : 'none';
  if (hold && !playing) endHold();
}
function endHold() {
  if (!hold) return;
  clearTimeout(hold.t);
  hold = null;
  $('hold').classList.remove('on');
}
addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') return;             // a mouse has a keyboard beside it
  touchy = true;
  controls();
  if (!begun || !playing) return;
  endHold();
  hold = { id: e.pointerId, x: e.clientX, y: e.clientY,
           t: setTimeout(() => { endHold(); stop(); note('stopped — on every machine'); controls(); }, HOLD) };
  void $('hold').offsetWidth;                        // the bar begins from nothing each time
  $('hold').classList.add('on');
}, true);
for (const ev of ['pointerup', 'pointercancel'])
  addEventListener(ev, e => { if (hold && e.pointerId === hold.id) endHold(); }, true);
addEventListener('pointermove', e => {               // a finger that travels is not a hold
  if (hold && e.pointerId === hold.id && Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > 30) endHold();
}, true);
addEventListener('contextmenu', e => { if (begun) e.preventDefault(); });   // a long press is ours, not the browser's menu
$('touchGo').addEventListener('click', () => { play(); controls(); });

function frame() {
  if (playing && role === 'sound') soundNow();       // one more look at the context's clock, at a moment of the frame's own
  paint(shown());
  paintHud();
  controls();
  requestAnimationFrame(frame);
}

// ---------- begin ----------
async function begin(as, force) {
  if (!ver || begun) return;
  buttons(false);
  try {
    if (sync) {
      const r = await sync.hello(as, ver.folder, force);
      if (as === 'sound' && r.status === 409) {       // exactly one machine has the sound
        say('ANOTHER MACHINE HAS THE SOUND. Begin this one with the picture only — or click "sound and picture" again to take the sound here.');
        taking = true;
        buttons(true);
        return;
      }
      const s = sync.state();
      if (as === 'screen' && s && s.version && s.version !== ver.folder) note(`the sound machine has ${s.version} — this one has ${ver.folder}`, 8000);
    }
    if (as === 'sound') { await loadSound(); await ctx.resume(); }
  } catch (e) { say('FAILED: ' + e.message); buttons(true); throw e; }
  role = as;
  begun = true;
  $('go').blur(); $('goScreen').blur();
  initV1();
  $('start').style.display = 'none';
  document.body.classList.add('stage');
  controls();
  v1.style.display = 'block';
  fit();
  frame();
}
let taking = false;
$('go').addEventListener('click', () => begin('sound', taking));
$('goScreen').addEventListener('click', () => begin('screen'));
addEventListener('keydown', e => {
  if (!begun || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;   // chords are the browser's
  if (e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); play(); controls(); }
  else if (e.code === 'Escape') { e.preventDefault(); stop(); controls(); }
  else if (e.code === 'KeyH' || e.key === 'h' || e.key === 'H') { hudOn = !hudOn; }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    trim += (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 1 : 10);
    try { localStorage.setItem('synthesi-alpha.trim', String(trim)); } catch (err) {}
    note(trimSays() + ' on this machine');
  }
});

// what a check reads
const player = window.player = {
  shelf: [], ver: () => ver, ctx: () => ctx, heard, shown, play, stop, paint, fit, live, holders, follow,
  playing: () => playing, begun: () => begun, startAt: () => startAt, role: () => role, sync: () => sync,
  trim: v => { if (v != null) trim = v; return trim; }, stage: () => [W(), H()], source: () => src,
  touchy: () => touchy, holding: () => !!hold,
  record: { mainAt, soundAt, fracAt, checkPicture, SETTLE, SETTLE_BACK },
};
if (!SD || !SD.G) say('FAILED: the score (picture/score-data.js) did not load');
else {
  openShelf().catch(e => { say('FAILED: ' + e.message); throw e; });
  if (new URLSearchParams(location.search).has('alone')) $('net').textContent = 'by itself — asked for in the address (?alone): nothing is said to the other machines';
  else makeSync(heardFrom).then(s => { sync = s; $('net').textContent = s ? 'the small server is here: other machines can be kept with this one' : 'no small server here: this machine plays by itself'; });
}
