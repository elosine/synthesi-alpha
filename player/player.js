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
// The drawing is the workshop's, copied — engine/perform.html (paintV1,
// makeLens) and engine/scenario.js (paintPic). There it is drawn from the live
// engine; here the same lines are drawn from the record (record.js). The
// animation core is the one file both pages load: engine/score-anim.js.

import { mainAt, soundAt, fracAt, checkPicture, SETTLE, SETTLE_BACK } from './record.js';

const SD = window.SCORE_DATA;
const SHELF = '../versions/';                       // shelf.json, and a folder a version
const STRIP = '../picture/score-strip.svg';
const CONST = { MID: SD.MID, TON0: SD.TON0, TON1: SD.TON1, PXS: SD.PXS, X0: SD.X0 };
const CY0 = 26, CH = 600;                           // the strip's content band (the workshop's)
// the stage — the whole window today. The fixed 1920 × 1080 shape (S4, B4)
// changes these two lines and nothing else: every place below is cut from them.
const W = () => innerWidth, H = () => innerHeight;
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

// ---------- a version, loaded: its picture, and its sound — whole ----------
let picking = 0;
async function pick(v, tr) {
  if (begun) return;
  const mine = ++picking, stale = () => mine !== picking;
  $('go').disabled = true;
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
    const bytes = await getBytes(v.dir + (v.plays || v.facts.sound.file),
      f => { if (!stale()) say(`${v.folder} — the sound… ${(f * 100) | 0}%`); });
    if (stale()) return;
    say(`${v.folder} — unpacking the sound…`);
    // the context runs at the sound's own rate: every sample of the file in
    // its place, none made up in between (log §5: checked against the file)
    if (ctx) await ctx.close();
    ctx = new AudioContext({ sampleRate: v.facts.sound.sampleRate });
    const buffer = await ctx.decodeAudioData(bytes);
    if (stale()) return;
    ver = { ...v, pic, buffer };
    say(`${v.folder} — ready · ${fmtT(buffer.duration)}`);
    $('go').disabled = false;
  } catch (e) {
    if (!stale()) say('FAILED: ' + e.message);
    throw e;
  }
}

// ---------- the sound, and THE ONE CLOCK ----------
let src = null, startAt = 0, playing = false, restAt = 0;
const latency = () => ctx.outputLatency || ctx.baseLatency || 0;
// seconds of the sound file being HEARD now; at rest, where it rests
const heard = () => playing ? Math.max(0, ctx.currentTime - startAt - latency()) : restAt;
function play() {
  if (playing || !ver) return;                      // a second ENTER does not begin the piece again
  if (ctx.state !== 'running') ctx.resume();
  const s = ctx.createBufferSource(), g = ctx.createGain();
  s.buffer = ver.buffer;
  s.connect(g).connect(ctx.destination);
  startAt = ctx.currentTime + 0.1;
  s.start(startAt);
  s.onended = () => { if (src && src.s === s) { src = null; playing = false; restAt = ver.buffer.duration; } };
  src = { s, g };
  playing = true;
}
function stop() {
  if (!playing) return;
  restAt = heard();                                 // the picture stops with the sound
  const { s, g } = src, t = ctx.currentTime;
  g.gain.setTargetAtTime(0, t, 0.012);              // out in a breath — no click
  s.stop(t + 0.08);
  src = null; playing = false;
}

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
function frame() {
  paint(heard());
  requestAnimationFrame(frame);
}

// ---------- begin ----------
$('go').addEventListener('click', async () => {
  if (!ver || begun) return;
  begun = true;
  $('go').blur();
  await ctx.resume();
  initV1();
  $('start').style.display = 'none';
  v1.style.display = 'block';
  frame();
});
addEventListener('keydown', e => {
  if (!begun || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;   // chords are the browser's
  if (e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); play(); }
  else if (e.code === 'Escape') { e.preventDefault(); stop(); }
});

// what a check, and the stage set-ups (B4), read
const player = window.player = {
  shelf: [], ver: () => ver, ctx: () => ctx, heard, play, stop, paint, live, holders,
  playing: () => playing, begun: () => begun, startAt: () => startAt,
  record: { mainAt, soundAt, fracAt, checkPicture, SETTLE, SETTLE_BACK },
};
if (!SD || !SD.G) say('FAILED: the score (picture/score-data.js) did not load');
else openShelf().catch(e => { say('FAILED: ' + e.message); throw e; });
