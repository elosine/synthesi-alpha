// Scenario — layer one of the first scenario (docs/plan/first-scenario-plan.md,
// P1; journal §196). Electronics main — v-alpha and its scrolling score —
// starts and stops on section ends, by a SEEDED RULE read from a scenario
// file. Also here: the page's navigation asked for alongside (go to a set,
// go to a time, mouse-wheel scroll) and the loud-seam test rig (?seamtest).
//
// The rule rolls every start and stop of the piece from one seed. Since P2e
// (journal §214) the form is BY PAGE: a run is one 1920 × 1080 screen of the
// score, its stop the section end nearest that screen's middle — twelve
// pages, written into the scenario file by tools/page_form.py — and the
// wait on a stop is drawn from the seed.
//
// Keys: ENTER = START · ESC = stop everything (while a run is in flight) ·
// G = go to. SPACE during a run hands the transport back to the page.
// &page=N in the URL: START begins with the run into page N.

import { makeVoices } from './voices.js';
import { makePatternPlayer } from './patterns.js';
import { makeRecorder } from './version.js';

const SCENARIO = '../voices/v-alpha/scenario/scenario-1.json';
const REPLAY = '../voices/v-alpha/score/replay-index.json';
const SEAMS = '../voices/v-alpha/score/seam-levels.json';

// one seed, one piece (mulberry32 — the generator of the other pieces' pages)
const mulberry32 = a => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// the policy grammar (docs/plan/behavior-spec.md): fixed | pick | range
function draw(p, rnd) {
  if (p == null) return null;
  if (typeof p === 'number') return p;
  if ('fixed' in p) return p.fixed;
  if ('pick' in p) return p.pick[Math.floor(rnd() * p.pick.length)];
  if ('range' in p) return p.range[0] + rnd() * (p.range[1] - p.range[0]);
  throw new Error('policy: ' + JSON.stringify(p));
}

// THE ROLL — every start and stop of layer one, from the seed. A run is:
// a wait, then whole sections played from where the last run stopped,
// then a stop on that section's end. Always onward: nothing skipped,
// nothing repeated (J's goal for P1).
// "run": "page" (P2e) — a run ends on the next page's stop, and after the
// last page's stop one more run plays the score out, to `end` (the end of
// the sound; without it, the last section's end).
export function rollLayer1(sc, sections, end) {
  const L = sc.layer1, rnd = mulberry32(sc.seed);
  const max = L.runs === 'all' ? Infinity : (L.runs ?? 1);
  const pages = L.run === 'page' ? (sc.sections || []).map(s => s.stopSet) : null;
  const runs = [];
  let set = 0;
  while (set < sections.length && runs.length < max) {
    const wait = draw(runs.length ? L.betweenWait : L.startWait, rnd) ?? 0;
    const k = runs.length, out = pages && k >= pages.length;
    const last = out ? sections.length - 1
      : pages ? pages[k]
      : Math.min(sections.length - 1, set + Math.max(1, Math.round(draw(L.runSections, rnd))) - 1);
    runs.push({ wait, fromSet: set, toSet: last, page: pages && !out ? k + 1 : null,
                t0: sections[set].t0, t1: out ? (end ?? sections[last].t1) : sections[last].t1,
                stop: L.stop || 'plain' });
    set = last + 1;
  }
  return runs;
}

export function initScenario(deps) {
  const { engine, phs, ctx, SD, CURLAG, CH, setRunning, tVis, rig, began, make } = deps;
  const main = () => phs[0];
  const clampT = t => Math.max(0, Math.min(SD.DUR - 0.01, t));
  const fmtT = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;
  const el = (tag, style, html) => {
    const d = document.createElement(tag);
    Object.assign(d.style, style);
    if (html != null) d.innerHTML = html;
    return d;
  };
  const FONT = '13px Consolas, ui-monospace, monospace';
  const log = [];             // every stop, measured: {what, mode, seam, at, errMs, ctxTime}
  let scn = null, state = null, flying = false;
  let ver = null;             // a version being made (makeVersion, below): what is heard and shown, kept

  // ---- a small status line, top right — what the rule is doing ----
  const pillEl = el('div', { position: 'fixed', top: '10px', right: '12px', zIndex: 20,
    font: FONT, color: '#fff', background: 'rgba(40,40,40,0.82)', padding: '3px 10px',
    borderRadius: '5px', display: 'none', pointerEvents: 'none' });
  document.body.appendChild(pillEl);
  let sayTimer = 0;
  function say(text, ms) {
    clearTimeout(sayTimer);
    pillEl.textContent = text;
    pillEl.style.display = text ? 'block' : 'none';
    if (text && ms) sayTimer = setTimeout(() => say(''), ms);
  }

  // ---- the stop: exact in the worklet, plain or under the light reverb ----
  let verbOff = 0;
  function closeVerb() {
    clearTimeout(verbOff);
    engine.fx.reverb.send.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
  }
  // mode: "plain" · "reverb" · "fade + reverb" (· "fade") — read by its words
  // o.at: the run begins AT that context time, in the worklet (journal §260) —
  // omitted, it begins now. o.started: told when it has begun.
  function playTo(tStop, mode, what, done, o = {}) {
    const p = main(), at = o.at ?? null;
    const V = (scn && scn.reverb) || { send: 0.5, capture: 0.6 };
    const F = (scn && scn.fade) || { seconds: 0.12 };
    const wantVerb = /reverb/.test(mode), wantFade = /fade/.test(mode);
    p.setLoop(false);
    p._runTempo = 1;
    p.stopAt(tStop, wantFade ? F.seconds : 0);
    // a run asked for ahead is asked for AT the stop before it — whose send
    // is still open, and closes by itself 0.3 s on (below): it is left alone
    if (at == null) closeVerb();
    // the reverb drinks the last `capture` seconds before the stop, then
    // rings by itself (the convolver's own tail). Armed only once a
    // position BELOW the window has been seen — a position report still
    // in flight from before a seek must not open the send early.
    let below = false;
    p.onupdate = !wantVerb ? null : m => {
      if (m.t < tStop - V.capture) { below = true; return; }
      if (!below) return;
      p.onupdate = null;
      const fx = engine.fx.reverb;
      fx.ret.gain.setTargetAtTime(1, ctx.currentTime, 0.02);
      fx.send.gain.setTargetAtTime(V.send, ctx.currentTime, 0.05);
    };
    const entry = { c: at ?? ctx.currentTime, pos: o.from ?? p.t, tempo: 1, stopAt: tStop, asked: at };
    p.onstopped = m => {
      p.onstopped = null; p.onupdate = null; p.onstarted = null; flying = false;
      setRunning(false);                      // the picture stops with the sound
      timeline.push({ c: m.ctxTime, pos: m.t, tempo: 0 });
      // the send closes 0.3 s after the stop — on the audio clock when the
      // run was (a hidden page's timers tick once a second, §260)
      if (wantVerb && at != null) engine.fx.reverb.send.gain.setTargetAtTime(0, m.ctxTime + 0.3, 0.05);
      else if (wantVerb) verbOff = setTimeout(closeVerb, 300);
      const row = { what, mode, seam: tStop, at: m.t,
                    errMs: +((m.t - tStop) * 1000).toFixed(3), ctxTime: m.ctxTime,
                    from: entry.pos, began: entry.c, asked: at };
      log.push(row);
      if (done) done(row);
    };
    flying = true;
    timeline.push(entry);
    // the worklet says when the run really began (to the block): the timeline
    // — where electronics main IS, for everything that asks — is put right
    p.onstarted = at == null ? null : m => {
      if (!m.gate) return;
      p.onstarted = null; entry.c = m.ctxTime;
      if (began) began();
      if (o.started) o.started(m);
    };
    setRunning(true, at);
  }
  // ---- a read of ANY stretch a → b on the main playhead (b < a = backward):
  // what the sampler is heard through, and later the cursors' material (P2a).
  // o: { speed, fade (s into the end), fadeIn (s), reverb, reverbSend, makeupDb, what, done }
  let rangeToken = 0;
  function playRange(a, b, o = {}) {
    const p = main();
    const V = (scn && scn.reverb) || { send: 0.5, capture: 0.6 };
    const speed = o.speed ?? 1, span = Math.abs(b - a) || 1e-6;
    p.setLoop(false);
    p.seek(a);
    p._runTempo = (b >= a ? 1 : -1) * speed;
    p._fadeIn = o.fadeIn || 0;
    p.makeupDb = o.makeupDb ?? 12;
    p.stopAt(b, o.fade || 0);
    closeVerb();
    // the reverb drinks the last `capture` seconds of SOUND — the whole
    // stretch if it is shorter. Armed only once a position in the first
    // half has been seen (a report in flight from before the seek must
    // not open the send).
    let seen = false;
    p.onupdate = !o.reverb ? null : m => {
      if (!seen) { if (Math.abs(m.t - a) < span * 0.5) seen = true; else return; }
      if (Math.abs(b - m.t) / speed > V.capture) return;
      p.onupdate = null;
      const fx = engine.fx.reverb;
      fx.ret.gain.setTargetAtTime(1, ctx.currentTime, 0.02);
      fx.send.gain.setTargetAtTime(o.reverbSend ?? V.send, ctx.currentTime, 0.05);
    };
    p.onstopped = m => {
      p.onstopped = null; p.onupdate = null; flying = false;
      setRunning(false);
      if (o.reverb) verbOff = setTimeout(closeVerb, 300);
      const row = { what: o.what, from: a, seam: b, at: m.t, speed: p._runTempo,
                    errMs: +((m.t - b) * 1000).toFixed(3), ctxTime: m.ctxTime };
      log.push(row);
      if (o.done) o.done(row);
    };
    flying = true;
    // the seek and the makeup land before the gate opens
    const me = ++rangeToken;
    setTimeout(() => { if (me === rangeToken && flying) setRunning(true); }, 80);
  }
  const busy = () => !!state || flying || players.some(pl => pl.run());
  function cancel(stopSound) {
    if (state && state.timer) clearTimeout(state.timer);
    if (state && state.lead) clearTimeout(state.lead);
    state = null; flying = false; rangeToken++;
    for (const pl of players) pl.stop();
    for (const sd of sounds) if (sd.lens) sd.lens.remove();
    players.length = 0; sounds.length = 0;
    if (V) { V.hush(); V.busOverlay('off'); }
    for (const v of VDs) { v.hush(); v.busOverlay('off'); }
    const p = main();
    if (p) { p.stopAt(null); p.unschedule(); p.onstopped = null; p.onupdate = null; p.onstarted = null; }
    closeVerb();
    if (stopSound) setRunning(false);
    if (ver && ver.live) ver.aborted = true;        // a version being made is not finished by a stop
    say('');
  }

  // ---- START: read the file, roll it, run it ----
  // read at every START and every test (the server is no-store): editing
  // the JSON changes what runs, no baked twin in the page
  async function loadScn() {
    const r = await fetch(SCENARIO, { cache: 'no-store' });
    if (!r.ok) throw new Error(`fetch ${SCENARIO}: ${r.status}`);
    scn = await r.json();
    return scn;
  }
  // which page the URL asks for (&page=N) — START begins there, and the
  // sampler and the play-in take that page's phrases and accents (P2e)
  const urlPage = () => {
    const n = +new URLSearchParams(location.search).get('page');
    return Number.isInteger(n) && n > 0 ? n : 0;
  };
  // what a page's screen shows, out of the scan's picks (replay-index.json):
  // the ids tools/page_form.py wrote into its section
  function pageMaterial(rp, sec) {
    const P = new Set(sec.phrases || []), A = new Set(sec.accents || []);
    return { phrases: rp.sections.flatMap(s => s.phrases).filter(x => P.has(x.id)),
             impacts: rp.sections.flatMap(s => s.impacts).filter(x => A.has(x.id)) };
  }
  // o.page: begin with the run INTO that page (1 = from the top), after the
  // start wait — for working on one page. o.wait: every wait between runs,
  // in seconds, in place of the rolled one — a check of the form, not the piece.
  async function start(o = {}) {
    cancel(true);
    await loadScn();
    await loadSections();
    const runs = rollLayer1(scn, engine.sections, SD.DUR);
    if (!runs.length) throw new Error('the roll is empty');
    const page = o.page ?? urlPage(), k0 = page ? page - 1 : 0;
    if (!runs[k0] || (page && runs[k0].page !== page)) throw new Error(`there is no page ${page}`);
    if (o.wait != null) runs.forEach((r, i) => { if (i) r.wait = o.wait; });
    if (k0) runs[k0].wait = runs[0].wait;
    main().seek(runs[k0].t0);
    timeline.length = 0;
    const now = ctx.currentTime;
    timeline.push({ c: now, pos: runs[k0].t0, tempo: 0 });
    state = { runs, k: k0, k0, phase: 'wait', timer: 0, lead: 0, from: now };
    step();
  }
  // THE WAITS ARE ON THE AUDIO CLOCK (journal §260). A run begins `wait`
  // seconds after the stop before it (after START, for the first) — and it
  // is the worklet that begins it, at that context time, to the block. It is
  // asked for at once, the moment the stop before it is known; no timer
  // stands between. (Until §260 a timer did: on a page that is not shown —
  // another tab in front, the window covered — timers are held to one a
  // second, and each page stood up to a second too long.)
  function step() {
    const me = state, r = me.runs[me.k];
    const where = r.page ? `page ${r.page} of ${scn.sections.length}`
      : scn.layer1.run === 'page' ? 'the play-out' : `run ${me.k + 1}`;
    const at = me.from + r.wait;
    me.phase = 'wait';
    say(`${scn.name} · seed ${scn.seed} · ${where} starts in ${r.wait.toFixed(1)} s`);
    // the section's patterns begin at the stop — or `lead` seconds before it
    const k = me.k, sec = (scn.sections || [])[k], lead = (sec && sec.lead) || 0;
    const from = me.k === me.k0 ? r.t0 : main().t;
    let begun = false;
    const begin = () => { if (!begun && state === me) { begun = true; startSection(k); } };
    if (lead > 0) me.lead = setTimeout(begin, Math.max(0, (at - ctx.currentTime + r.t1 - from - lead) * 1000));
    playTo(r.t1, r.stop, `${where} · sets ${r.fromSet}–${r.toSet}`, row => {
      if (state !== me) return;
      say(`${where} · stopped on the end of set ${r.toSet} · ${fmtT(row.at)}`, 5000);
      me.from = row.ctxTime;
      begin();
      me.k++;
      if (me.k < me.runs.length) step(); else state = null;
    }, { at, from, started: () => {
      if (state !== me) return;
      me.phase = 'play';
      say(`${where} · sets ${r.fromSet}–${r.toSet} · stops at ${fmtT(r.t1)}`);
    } });
  }

  // ---- THE SECTIONS (P2c, journal §207): at each stop a section's patterns
  // begin — J's played-in patterns, one after another — and they go on while
  // electronics main moves. The rule is his sentence: "if they go off the
  // screen, they go off the screen" — a sound is called only while its
  // PLACE is on screen. The scroll is the crossfade.
  const timeline = [];        // where electronics main is, on the audio clock: {c, pos, tempo, stopAt}
  const players = [], sounds = [];
  let V = null, VD = null, replay = null, picks = {}, pats = {}, lastDesign = null;
  const VDs = [];             // the designed pages' voices: two sets, taken turn about
  async function loadSections() {
    if (!scn.sections || !scn.sections.length) return;
    if (!replay) {
      const r = await fetch(REPLAY, { cache: 'no-store' });
      if (!r.ok) throw new Error(`fetch ${REPLAY}: ${r.status}`);
      replay = await r.json();
      picks = Object.fromEntries(replay.sections.flatMap(s => [...s.phrases, ...s.impacts]).map(x => [x.id, x]));
    }
    pats = Object.fromEntries((await (await fetch('/list-patterns', { cache: 'no-store' })).json()).map(p => [p.name, p]));
    if (!V) {
      V = makeVoices({ engine, ctx, cfg: () => ({ phraseFade: 0.08, phraseEnd: 'fade', impacts: {},
        variants: { reverse: { speed: 1, backward: true, makeupDb: 10 } },
        ...(scn.sampler || {}), reverb: scn.reverb, overlays: scn.overlays,
        voices: (scn.playin || {}).voices || 4 }) });
      V.ensurePool((scn.playin || {}).voices || 4);
    }
    // a DESIGNED page's reads have voices of their own — so that the next
    // page's phrases do not cut them while they play out (P2h, journal §234).
    // And when the page AFTER a designed page is designed too, it has a
    // second set: the first page's reads play out in theirs while the second
    // page's entries come exactly where its own rule says (§237 — sharing
    // one set made the second page wait on the first page's tails). Designed
    // pages take the two sets turn about; a page's reads are over before the
    // page after next begins.
    designs.clear();
    for (const s of scn.sections) if (s.design && s.design.source) await loadRenders(s);
    const designed = scn.sections.filter(s => s.design);
    const most = Math.max(0, ...designed.map(s => s.design.atOnce || 4));
    // a third set where a page wants a third stream, or streams AND an accretion (§243) — a bus of
    // its own and no voices: every hit on those pages is the playback of a file
    const sets = !designed.length ? 0
      : designed.some(s => (s.design.streams || []).length > 2 || (s.design.streams && s.design.kind === 'accrete')) ? 3
      : designed.some(s => s.design.streams || (scn.sections[s.page] || {}).design) ? 2 : 1;
    while (VDs.length < sets) {
      // each set on a bus of its own: an overlay "over everything" is over everything THAT SET plays
      const v = makeVoices({ engine, ctx, bus: 'd' + VDs.length, cfg: () => ({ phraseFade: 0.08, phraseEnd: 'fade', impacts: {},
        variants: { reverse: { speed: 1, backward: true, makeupDb: 10 } },
        ...(scn.sampler || {}), reverb: scn.reverb, overlays: scn.overlays, voices: most }) });
      if (VDs.length < 2) v.ensurePool(most);
      VDs.push(v);
    }
    VD = VDs[0] || null;
  }
  // which of the two sets a designed page plays in: its place among the designed pages, odd or even
  const voicesOf = sec => sec.design.streams ? VDs[2]           // beside streams: the third bus, clear of their tremolos
    : VDs[scn.sections.filter(s => s.design && s.page <= sec.page).length % 2 === 1 ? 0 : Math.min(1, VDs.length - 1)];
  // a whole container, as something a cursor can read: set N, start to end
  // "set17" = the whole of set 17 · "set20:p5" = set 20 AS PAGE 5 SHOWS IT — the part of it on that
  // page's screen (the scenario file's "showing"; journal §239)
  const containerOf = id => {
    const m = /^set(\d+)(?::p(\d+))?$/.exec(String(id));
    if (!m) return null;
    const i = +m[1], s = engine.sections[i];
    if (!s) return null;
    if (!m[2]) return { id: 'set' + i, name: 'set ' + i, t0: s.t0, t1: s.t1, len: s.t1 - s.t0, fadeIn: 0.02 };
    const part = ((scn.sections[+m[2] - 1] || {}).showing || []).find(x => x.set === i);
    if (!part) return null;
    const cut = part.t0 > s.t0 + 0.01 || part.t1 < s.t1 - 0.01;
    return { id: String(id), name: `set ${i}${cut ? ' (the part on screen)' : ''}`, t0: part.t0, t1: part.t1,
             len: part.t1 - part.t0, fadeIn: 0.02 };
  };
  const lookup = id => /^set\d+/.test(id) ? containerOf(id) : picks[id];
  // THE DESIGN OF A PAGE, rolled from the seed (his rule, §233): whole
  // containers read through an overlay, ACCRETING — the first by a draw, the
  // next entering when the one before is `enter[0]` of its way through, the
  // one after at `enter[1]` of that one's, each a little sooner, each with
  // jitter; the overlay of each dealt from a shuffled deck, shuffled again
  // when dealt out. Entries begin only while the page stands (`stand` s);
  // what has begun plays out to its own end.
  // o.carried = when (s after this page's stop) the reads of the designed page
  // BEFORE it end — they are still sounding, in the same four voices, and
  // count; o.deck0 / o.last0 = an overlay deck handed on from another page.
  function rollDesign(sec, stand, o = {}) {
    const D = sec.design, rnd = mulberry32((scn.seed * 7919 + sec.page * 104729) | 0);     // its own stream: the waits stay as rolled
    const carried = o.carried || [];
    let left = [], lastOverlay = null;
    const deal = (list, deck0, last0, keep) => {
      let deck = (deck0 || []).slice(), last = last0 ?? null;
      const told = () => { if (keep) { left = deck.slice(); lastOverlay = last; } };
      told();
      return () => {
        if (!deck.length) {
          deck = list.slice();
          for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
          if (deck.length > 1 && deck[deck.length - 1] === last) deck.unshift(deck.pop());
        }
        last = deck.pop(); told();
        return last;
      };
    };
    // what it reads: the page's WHOLE containers — or, "of": "showing", every container that shows, each as much as shows
    const things = D.of === 'renders' ? (renders.get(sec.page) || []).filter(c => c.file).map(c => `set${c.set}:p${sec.page}`)
                 : D.of === 'showing' ? (sec.showing || []).map(x => `set${x.set}:p${sec.page}`)
                                      : (sec.containers || []).map(i => 'set' + i);
    const nextSet = deal(things), nextOverlay = deal(D.overlays || [], o.deck0, o.last0, true);
    const events = [], atOnce = D.atOnce || 4;
    for (let k = 0, t = 0; k < (D.most ?? 12) && things.length; k++) {
      // never more than `atOnce` together: with that many sounding, the next
      // waits for one to END — nothing is cut short to make room (the first
      // roll dealt seven into four voices and cut three reads: journal §234)
      const ends = [...carried, ...events.map(e => e.t + e.lasts)].filter(e => e > t).sort((p, q) => p - q);
      if (ends.length >= atOnce) t = ends[ends.length - atOnce];
      if (t >= stand) break;
      // "every other one a reverse" (J, §235): the 2nd, 4th … entry is read backward;
      // "start with the reverse one and then alternate" (§236): the 1st, 3rd …
      const variant = (D.reverse === 'every other' && k % 2 === 1) ||
                      (D.reverse === 'every other, from the first' && k % 2 === 0) ? 'reverse' : 'plain';
      const x = (D.of === 'renders' ? renderedContainer(sec) : containerOf)(nextSet()), overlay = nextOverlay();
      const lasts = x.render ? x.render.lasts : VD.readOf(x, variant, overlay).dur;
      const at = D.enter[Math.min(k, D.enter.length - 1)] + (D.jitter || 0) * (2 * rnd() - 1);
      events.push({ t: +t.toFixed(3), kind: 'phrase', id: x.id, variant, overlay,
                    lasts: +lasts.toFixed(2), nextAt: +Math.max(0.02, at).toFixed(3) });
      t += Math.max(0.02, at) * lasts;
    }
    // an overlay over EVERYTHING the page reads, fitted to the page: "bus": { overlay, fit: [up, top, down] } —
    // one turn of its wave across the time the page stands (shares of it), then it rests at its start
    // settings (J, §240: "one full cycle ... over the course of the page duration")
    let bus = null;
    if (D.bus) {
      const base = ((scn.overlays || {}).presets || []).find(o => o.name === D.bus.overlay);
      const [up, top] = D.bus.fit || [0.4, 0.2];
      if (base) bus = { t: 0, kind: 'bus', name: { ...base, name: `${base.name} · one turn`, pattern: 'wave',
        over: +(up * stand).toFixed(2), stay: +(top * stand).toFixed(2), hold: 3600 } };
    }
    return { name: `${sec.name} · design`, algorithm: D.kind || 'accrete', events, bus, carried, left, lastOverlay,
             duration: Math.max(0, ...events.map(e => e.t + e.lasts)) };
  }
  // A PAGE'S DESIGN AS THE PIECE PLAYS IT — the same wherever START begins:
  // the page stands as long as the form rolls; the reads of the designed page
  // before it that are still sounding hold their voices (nothing is cut — a
  // new entry waits); and its overlay deck may go on from another page's
  // ("continues": that page — "when you do all of them, then just re-roll").
  // A PAGE OF SEQUENCES (his, §241): "we're going to reuse my played in
  // sequences ... assign the keys like you would have, but use my rhythms."
  // His stored patterns are the fund; the seed deals which ones, in what order,
  // "just enough to fill the whole page time period" — once for each stream,
  // and the streams sound TOGETHER, each under its own overlay. A pattern's
  // RHYTHM is kept; its KEYS are given this page's sounds as the play-in page
  // would give them: an attack key = the next attack of the page's deck; the
  // k-th phrase key = the page's k-th phrase, forward or reversed as played.
  // A key the page has no sound for is given one of the page's phrases or
  // accents, by a roll, once — the same key is the same sound through the page.
  const WHITE = [0, 2, 4, 5, 7, 9, 11];
  const whiteIndex = (n, base) => {
    const count = m => Math.floor(m / 12) * 7 + WHITE.filter(w => w < m % 12).length;
    return n < base || !WHITE.includes(n % 12) ? -1 : count(n) - count(base);
  };
  function rollSequences(sec, stand) {
    const D = sec.design, rnd = mulberry32((scn.seed * 7919 + sec.page * 104729) | 0);
    const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const dealer = list => { let deck = []; return () => { if (!deck.length) deck = shuffled(list); return deck.pop(); }; };
    const fund = Object.values(pats).sort((a, b) => parseInt(a.name.slice(2)) - parseInt(b.name.slice(2)));
    const mat = pageMaterial(replay, sec), nextPattern = dealer(fund), nextAttack = dealer(mat.impacts);
    const stand_in = new Map(), anything = [...mat.phrases, ...mat.impacts];
    // a PHRASE key with no sound here is given a PHRASE — "always give it a phrase, not an accent" (J, §242);
    // only where the page has none of the kind does the other kind stand in
    const standIn = k => {
      if (!stand_in.has(k)) {
        const pool = k === 'attack' ? (mat.impacts.length ? mat.impacts : anything) : (mat.phrases.length ? mat.phrases : anything);
        stand_in.set(k, pool[Math.floor(rnd() * pool.length)]);
      }
      return stand_in.get(k);
    };
    const streams = (D.streams || []).map(st => {
      const patterns = [];
      let total = 0;
      while (total < stand && patterns.length < 24 && fund.length && anything.length) {
        const pt = nextPattern(), K = (pt.params && pt.params.keys) || { phraseBase: 48, reverseBase: 60 }, events = [];
        let moved = 0;
        for (const e of pt.events) {
          if (e.kind === 'bus') continue;                       // the stream has its own overlay
          const back = e.variant === 'reverse';
          let x = e.kind === 'attack' ? nextAttack() : mat.phrases[whiteIndex(e.note, back ? K.reverseBase : K.phraseBase)];
          if (!x) { x = standIn(e.kind === 'attack' ? 'attack' : whiteIndex(e.note, back ? K.reverseBase : K.phraseBase)); moved++; }
          events.push(x.at != null ? { t: e.t, kind: 'attack', id: x.id, note: e.note, vel: e.vel }
                                   : { t: e.t, kind: 'phrase', id: x.id, variant: back ? 'reverse' : 'plain', note: e.note, vel: e.vel });
        }
        patterns.push({ name: pt.name, events, duration: pt.duration, moved });
        total += pt.duration;
      }
      return { overlay: st.overlay, patterns, total: +total.toFixed(1) };
    });
    return { name: `${sec.name} · sequences`, algorithm: 'sequences', streams, events: [],
             standIns: [...stand_in].map(([k, x]) => [k, x.id]) };
  }
  // A PAGE WHOSE SAMPLES ARE RENDERS (his, §242): "the IC processed containers
  // become the new samples essentially ... the cursors and the accents are
  // reading the IC processed version, wherever they're reading from." The
  // containers were read through icy beforehand (tools/icy_render.py → sound
  // files and a manifest); a phrase or an attack at a place in a container
  // is read from the render AT THAT PLACE — the manifest's mapping.
  const renders = new Map();        // page → [{ set, t0, t1, speed, lasts, buffer }]
  async function loadRenders(sec) {
    if (renders.has(sec.page)) return;
    const dir = `../voices/v-alpha/${sec.design.source}/`;
    const man = await (await fetch(dir + 'manifest.json', { cache: 'no-store' })).json();
    renders.set(sec.page, await Promise.all(man.containers.map(async c =>
      ({ ...c, buffer: c.file ? await ctx.decodeAudioData(await (await fetch(dir + c.file)).arrayBuffer()) : engine.buffer }))));
  }
  const renderAt = (c, p) => {                // seconds into the render for the place p (s) of its container
    if (!c.file) return p;                    // left as it is: the sound itself, at the place itself
    const f = Math.min(1, Math.max(0, (p - c.t0) / (c.t1 - c.t0)));
    if (!Array.isArray(c.speed)) return f * c.lasts;
    const r = c.speed[1] / c.speed[0];
    return c.lasts * Math.log(1 + f * (r - 1)) / Math.log(r);
  };
  const renderedLookup = sec => id => {
    const x = picks[id], p = x && (x.at ?? x.t0);
    const c = x && (renders.get(sec.page) || []).find(c => p >= c.t0 - 1e-6 && p < c.t1);
    if (!x) return x;
    // on such a page EVERY hit is the playback of a file: its container's render, or — a place no
    // render covers, a container left as it is — the sound itself
    return { ...x, render: c ? { buffer: c.buffer, at: renderAt(c, p), set: c.set, kind: c.kind, icy: c.icy }
                             : { buffer: engine.buffer, at: p, kind: 'original' } };
  };
  // a pre-processed container played AS A CONTAINER — the whole render, its cursor following the
  // read the render was made with (page 12's accretion, §243)
  const renderedContainer = sec => id => {
    const x = containerOf(id), c = x && (renders.get(sec.page) || []).find(c => `set${c.set}:p${sec.page}` === id);
    if (!c) return x;
    const r = Array.isArray(c.speed) ? c.speed[1] / c.speed[0] : 1;
    return { ...x, render: { buffer: c.buffer, at: 0, whole: true, lasts: c.buffer.duration, kind: c.kind, icy: c.icy,
                             frac: r === 1 ? null : u => (r ** u - 1) / (r - 1) } };
  };
  const designs = new Map();
  const standOf = page => { const runs = rollLayer1(scn, engine.sections, SD.DUR); return runs[page] ? runs[page].wait : 30; };
  function designOf(sec) {
    if (designs.has(sec.page)) return designs.get(sec.page);
    const D = sec.design, prev = scn.sections[sec.page - 2], o = {};
    if (prev && prev.design && prev.design.kind !== 'sequences') {     // what of the page before is still sounding when this one stops — told, not counted:
      const P = designOf(prev);                        // it plays out in its own voices
      const gap = standOf(prev.page) + (engine.sections[sec.stopSet].t1 - engine.sections[prev.stopSet].t1);
      o.still = P.events.map(e => +(e.t + e.lasts - gap).toFixed(3)).filter(e => e > 0);
    }
    const from = D.continues && scn.sections[D.continues - 1];
    if (from && from.design && from.page < sec.page) { const F = designOf(from); o.deck0 = F.left; o.last0 = F.lastOverlay; }
    const d = rollDesign(sec, standOf(sec.page), o);
    d.still = o.still || [];
    designs.set(sec.page, d);
    return d;
  }
  // the score time under the centre cursor at context time `when` — from the
  // timeline, so a stop that is coming is already known
  function centreAt(when) {
    let e = timeline[0];
    for (const x of timeline) if (x.c <= when) e = x;
    if (!e) return main().t - CURLAG;
    let pos = e.pos + e.tempo * Math.max(0, when - e.c);
    if (e.tempo > 0 && e.stopAt != null) pos = Math.min(pos, e.stopAt);
    return pos - CURLAG;
  }
  // seconds of score from the centre to the edge of the screen. The form's
  // screen has ONE shape (the scenario file's "form": 1920 × 1080 → 7.62 s),
  // so "on screen" is the same in any window (P2e); a file without a form
  // falls back to the window's own shape.
  const halfSpan = () => {
    const f = scn && scn.form && scn.form.screen;
    return (f ? f[0] / f[1] : innerWidth / innerHeight) * CH / (2 * SD.PXS);
  };
  function visible(x, when) {
    const c = centreAt(when), h = halfSpan();
    // an attack's place is a point; a phrase's is its WHOLE span — its
    // cursor is to be seen all the way (a phrase half off the edge was
    // being called with its cursor out of sight: §207)
    return x.at != null ? x.at >= c - h && x.at <= c + h : x.t0 >= c - h && x.t1 <= c + h;
  }
  // every sound that is called: the picture draws from `sounds`; a version being made keeps them all
  const heard = (row, x, k) => {
    const sd = { row, x, sec: k };
    sounds.push(sd);
    if (ver) ver.sounds.push(sd);
  };
  function startSection(k) {
    const sec = (scn.sections || [])[k];
    if (!sec || !V) return;
    // a page of SEQUENCES: his rhythms on this page's sounds, the streams together, each on its own set of
    // voices and bus and under its own overlay (journal §241)
    if (sec.design && sec.design.streams && VDs.length) {
      const key = 'streams' + sec.page;
      if (!designs.has(key)) designs.set(key, rollSequences(sec, standOf(sec.page)));
      lastDesign = designs.get(key);
      lastDesign.streams.forEach((st, i) => {
        const ps = makePatternPlayer({ ctx, V: VDs[i % VDs.length], visible, overlay: st.overlay,
          lookup: sec.design.source ? renderedLookup(sec) : lookup,
          onSound: (row, x) => heard(row, x, k) });
        ps.section = `${sec.name} · stream ${i + 1} · ${st.overlay}`;
        ps.play(st.patterns);
        players.push(ps);
      });
    }
    // a DESIGNED page: its accretion begins at the stop, in its own voices
    if (sec.design && sec.design.kind !== 'sequences' && VD) {
      lastDesign = designOf(sec);
      const pd = makePatternPlayer({ ctx, V: voicesOf(sec), visible,
        lookup: sec.design.of === 'renders' ? renderedContainer(sec) : lookup,
        onSound: (row, x) => heard(row, x, k) });
      pd.section = lastDesign.name;
      pd.play(lastDesign.bus ? { ...lastDesign, events: [lastDesign.bus, ...lastDesign.events] } : lastDesign);
      players.push(pd);
    }
    // the page's patterns: the ones its section lists — or, when it lists none, every stored
    // pattern that was PLAYED IN ON THIS PAGE (the play-in writes the page into it), in the order stored
    const named = sec.patterns && sec.patterns.length ? sec.patterns
      : Object.values(pats).filter(p => p.params && p.params.page === sec.page).map(p => p.name);
    const list = named.map(n => pats[n]).filter(Boolean);
    // the bus is the new page's from its stop — set by its patterns' player, or here when it has none
    if (!list.length) { V.busOverlay(sec.overlay ?? 'off'); return; }
    // what he played with is what plays; the page's own overlay is for what was played in without one
    const pl = makePatternPlayer({ ctx, V, lookup, visible, fallback: sec.overlay,
      onSound: (row, x) => heard(row, x, k) });
    pl.section = sec.name || `section ${k + 1}`;
    pl.play(list, { gap: sec.gap || 0 });
    players.push(pl);
  }

  // ---- the picture (an overlay; the notation itself does not move): a
  // coloured cursor travelling a sounding phrase, a burst at an attack ----
  const HUES = ['#1565C0', '#2E7D32', '#7B1FA2', '#C62828', '#E6A23C', '#00838F', '#6D4C41', '#283593', '#00695C', '#AD1457'];
  const hueOf = id => {
    const hues = (scn && scn.picture && scn.picture.hues) || HUES;
    let h = 0;
    for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return hues[h % hues.length];
  };
  const SETTLE = 2.0;        // s a lens outlives a forward read, for its marks to come to rest
  const pic = el('div', { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: 6 });
  document.body.appendChild(pic);
  const mark = style => {
    const d = document.createElement('div');
    Object.assign(d.style, { position: 'absolute' }, style);
    pic.appendChild(d);
  };
  (function paintPic() {
    pic.innerHTML = '';
    if (sounds.length && rig.getView() === 1 && phs.length) {
      const now = ctx.currentTime - (ctx.outputLatency || 0);          // what is being heard now
      const s = innerHeight / CH, tn0 = tVis(main()) - CURLAG;
      const xOf = T => innerWidth / 2 + s * SD.PXS * (T - tn0);
      for (let i = sounds.length - 1; i >= 0; i--) {
        const sd = sounds[i];
        if (now > sd.row.end + (sd.row.variant === 'reverse' ? 0.4 : SETTLE)) {
          if (sd.lens) sd.lens.remove();
          sounds.splice(i, 1);
        }
      }
      for (const sd of sounds) {
        const { row, x } = sd;
        if (now < row.when) continue;
        // THE NOTATION UNDER THE SOUND (P2d): a lens over its stretch of the
        // score, shown at the time the sound is reading. The animation's
        // clock is the audio's (as for electronics main); a forward read
        // runs on past its end so the marks settle before the lens goes; a
        // reversed one ends where every mark is at rest.
        if (!sd.lens && rig.makeLens) {
          sd.lens = row.kind === 'attack' ? rig.makeLens(x.at - 0.05, x.at + x.dur + 0.3)
                                          : rig.makeLens(x.t0, x.t1);
        }
        if (sd.lens) {
          // a slowed read (icy) moves the notation as slowly as it moves the
          // cursor; past its end the marks run on at their own speed, to rest
          const e = now - row.when, d = row.end - row.when;
          const at = row.kind === 'attack' ? 0 : (row.frac || (u => u))(Math.min(1, e / d)) * (x.t1 - x.t0);
          sd.lens.paint(tn0, row.kind === 'attack' ? x.at + e
            : row.variant === 'reverse' ? x.t1 - at
            : e <= d ? x.t0 + at : x.t1 + (e - d));
        }
        const c = hueOf(row.id);
        if (row.kind === 'attack') {                                     // a burst: a bar and a ring, gone with the sound
          const u = Math.min(1, (now - row.when) / (x.dur + 0.15)), X = xOf(x.at), R = 10 + 46 * u;
          mark({ left: (X - 2) + 'px', top: '0', bottom: '0', width: '4px', background: c, opacity: 0.85 * (1 - u) });
          mark({ left: (X - R) + 'px', top: (innerHeight / 2 - R) + 'px', width: 2 * R + 'px', height: 2 * R + 'px',
                 border: `3px solid ${c}`, borderRadius: '50%', boxSizing: 'border-box', opacity: 0.9 * (1 - u) });
        } else {                                                         // its phrase, and the cursor travelling it
          const back = row.variant === 'reverse';
          // the cursor FOLLOWS THE READ (J, §221): where the read is, not how much time has gone
          const u = (row.frac || (v => v))(Math.min(1, Math.max(0, (now - row.when) / (row.end - row.when))));
          const T = back ? x.t1 - u * (x.t1 - x.t0) : x.t0 + u * (x.t1 - x.t0);
          const tail = now > row.end ? Math.max(0, 1 - (now - row.end) / 0.4) : 1;
          mark({ left: xOf(x.t0) + 'px', top: '0', bottom: '0', width: Math.max(1, xOf(x.t1) - xOf(x.t0)) + 'px',
                 background: c, opacity: 0.10 * tail });
          mark({ left: (xOf(T) - 1.5) + 'px', top: '0', bottom: '0', width: '3px', background: c, opacity: 0.9 * tail });
        }
      }
    }
    requestAnimationFrame(paintPic);
  })();

  // ---- go to: a set, or a time (G) ----
  const box = el('div', { position: 'fixed', top: '12px', left: '50%',
    transform: 'translateX(-50%)', zIndex: 21, font: FONT, color: '#111',
    background: '#fff', border: '1px solid #999', borderRadius: '6px',
    padding: '8px 12px', display: 'none', whiteSpace: 'nowrap' },
    'go to &nbsp; set <input size="3" autocomplete="off"> &nbsp; time <input size="8" ' +
    'autocomplete="off" placeholder="1:36.2"> &nbsp; <span style="color:#888">ENTER go · ESC close</span>');
  document.body.appendChild(box);
  const [gSet, gTime] = box.querySelectorAll('input');
  for (const i of [gSet, gTime]) i.style.font = FONT;
  function openGoto() {
    gSet.value = ''; gTime.value = '';
    gSet.placeholder = `0–${engine.sections.length - 1}`;
    box.style.display = 'block';
    gSet.focus();
  }
  function closeGoto() { box.style.display = 'none'; gSet.blur(); gTime.blur(); }
  function parseTime(s) {
    const m = /^(?:(\d+):)?(\d+(?:\.\d*)?|\.\d+)$/.exec(s);
    return m ? (+(m[1] || 0)) * 60 + +m[2] : null;
  }
  // the asked-for point lands UNDER THE CURSOR — the page's own rule for a
  // click (perform.html: a seek is the score time + CURLAG)
  function goTo(T) { phs[rig.getSelected()].seek(clampT(T + CURLAG)); }
  function goFromBox() {
    const sv = gSet.value.trim(), tv = gTime.value.trim();
    let T = null;
    if (sv !== '') {
      const s = /^\d+$/.test(sv) ? engine.sections[+sv] : null;
      if (!s) { gSet.select(); return; }
      T = s.t0;
    } else if (tv !== '') {
      T = parseTime(tv);
      if (T == null) { gTime.select(); return; }
    }
    if (T != null) goTo(T);
    closeGoto();
  }

  // ---- keys. CAPTURE phase, and registered before the sandbox's key
  // layer, so typing in the box never reaches a page key ----
  addEventListener('keydown', e => {
    if (box.contains(e.target)) {
      e.stopImmediatePropagation();
      if (e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); goFromBox(); }
      else if (e.code === 'Escape') { e.preventDefault(); closeGoto(); }
      return;
    }
    if (!phs.length || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault(); e.stopImmediatePropagation();
      // on the page that makes a version (?make) START plays the piece AND records it
      if (!e.repeat) (make ? makeVersion() : start()).catch(err => say('scenario: ' + err.message, 8000));
    } else if (e.code === 'Escape') {
      if (busy()) cancel(true);            // the one key that stops everything
    } else if (e.code === 'Space') {
      if (busy()) cancel(false);           // the page's own SPACE takes it from here
    }
  }, true);
  // G in the BUBBLE phase: where the sandbox owns G (an envelope over a
  // selection) it has already stopped the event, and G stays its key
  addEventListener('keydown', e => {
    if (!phs.length || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (e.code === 'KeyG') { e.preventDefault(); openGoto(); }
  });

  // ---- the mouse wheel scrubs the score (ui-preferences: plain scroll
  // pans the view at a smooth proportional rate; ALT + scroll is kept for
  // zoom, CTRL for the browser). One wheel pixel = one score pixel.
  let wheelT = 0, wheelAt = 0, panel = null;
  addEventListener('wheel', e => {
    if (!phs.length || e.ctrlKey || e.metaKey || e.altKey) return;
    if (box.contains(e.target) || (panel && panel.contains(e.target))) return;
    e.preventDefault();
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 33; else if (e.deltaMode === 2) d *= innerWidth;
    const scale = rig.getView() === 2 ? (rig.laneScale || 1) : innerHeight / CH;
    const p = phs[rig.getSelected()];
    const now = performance.now();
    if (now - wheelAt > 200) wheelT = p.t;   // p.t trails the worklet; accumulate here
    wheelAt = now;
    wheelT = clampT(wheelT + d / (scale * SD.PXS));
    p.seek(wheelT);
  }, { passive: false });

  // ---- the loud-seam test (?seamtest) — P1's quick test: the loud
  // seams, each heard stopped plain, then under the light reverb ----
  const PRE = 4;              // seconds of approach before the seam
  let loud = [];
  async function testSeam(r, mode, out) {
    cancel(true);
    await loadScn();
    main().seek(Math.max(0, r.t1 - PRE));
    say(`seam test · set ${r.set} → ${fmtT(r.t1)} · ${mode}`);
    setTimeout(() => playTo(r.t1, mode, `seam test · set ${r.set}`, row => {
      say('');
      if (out) out.textContent = `set ${r.set} · ${mode} · stopped at ${fmtT(row.at)} ` +
        `(${row.errMs >= 0 ? '+' : ''}${row.errMs.toFixed(2)} ms from the seam)`;
    }), 60);
  }
  async function initSeamTest() {
    const res = await fetch(SEAMS, { cache: 'no-store' });
    if (!res.ok) throw new Error(`fetch ${SEAMS}: ${res.status}`);
    const rows = await res.json();
    // the rule: of the seams within 10 dB of their own set's loudest
    // moment, the six where the sound is loudest outright
    loud = rows.filter(r => r.gap_to_next != null && r.seam_under_peak != null && r.seam_under_peak > -10)
      .sort((a, b) => b.seam_db - a.seam_db).slice(0, 6).sort((a, b) => a.t1 - b.t1);
    panel = el('div', { position: 'fixed', top: '44px', left: '12px', zIndex: 20, font: FONT,
      color: '#111', background: 'rgba(255,255,255,0.95)', border: '1px solid #999',
      borderRadius: '6px', padding: '8px 12px', lineHeight: '1.9' });
    panel.appendChild(el('div', { fontWeight: 'bold' }, 'loud-seam test'));
    panel.appendChild(el('div', { color: '#777' }, `plays the ${PRE} s before a section end, then stops`));
    const out = el('div', { color: '#555', marginTop: '4px', minHeight: '1.9em' }, '');
    for (const r of loud) {
      const row = el('div', {}, `set ${String(r.set).padStart(2, ' ')} ends ${fmtT(r.t1)} &nbsp;`);
      row.style.whiteSpace = 'pre';
      for (const mode of ['plain', 'reverb', 'fade + reverb']) {
        const b = el('button', { font: FONT, marginLeft: '6px', padding: '1px 10px', cursor: 'pointer' }, mode);
        b.tabIndex = -1;
        b.addEventListener('mousedown', ev => ev.preventDefault());   // never takes the keyboard
        b.addEventListener('click', () => testSeam(r, mode, out).catch(e => say('seam test: ' + e.message, 8000)));
        row.appendChild(b);
      }
      panel.appendChild(row);
    }
    panel.appendChild(out);
    document.body.appendChild(panel);
  }
  if (new URLSearchParams(location.search).has('seamtest'))
    initSeamTest().catch(e => say('seam test: ' + e.message, 8000));

  // ---- A VERSION (docs/plan/v-alpha-standalone-plan.md S2; journal §260): the
  // piece played from START and KEPT — its sound, sample for sample, and the
  // record of what the picture did. J: "A version ... is a folder you can hold
  // — one finished sound file, the record of what the picture did, and the
  // seed that made it." The folder is build/versions/<name>/ (seed-N).
  //
  // The picture's record is not pixels. It is what the page draws FROM: where
  // electronics main is on the audio clock, and every sound that was called —
  // its place in the score, when it began and ended, how its read moved.
  // o: { page, wait } as START takes them (a short pass, for a check) ·
  //    name (the folder; default seed-<seed>) · over (write over one made before)
  const TAIL = 5;             // s kept after the last sound ends: the hall rings 4
  let recorder = null;
  async function makeVersion(o = {}) {
    if (ver) throw new Error('a version is being made');
    cancel(true);
    // everything is loaded BEFORE the recording begins — the samples, the
    // voices — so that a version opens on START and not on the loading
    await loadScn();
    await loadSections();
    if (!recorder) recorder = await makeRecorder(engine, ctx);
    const name = o.name || `seed-${scn.seed}`;
    const me = ver = { name, sounds: [], live: false, aborted: false, t0: null, out: null };
    let open = false;
    try {
      const st = await recorder.start(name, !!o.over);
      open = true;
      me.t0 = st.time;
      const log0 = log.length;
      await start(o);
      me.live = true;
      me.started = state.from;
      const runs = state.runs.slice(state.k0);
      // the end: the last run stopped, nothing more to be called, the last sound over and the hall with it
      await new Promise(res => {
        const iv = setInterval(() => {
          const last = Math.max(0, ...me.sounds.map(s => s.row.end || 0), ...log.slice(log0).map(r => r.ctxTime));
          if (me.aborted || (!state && !flying && !players.some(pl => pl.run()) && ctx.currentTime > last + TAIL)) {
            clearInterval(iv); res();
          }
        }, 500);
      });
      if (me.aborted) {
        open = false;
        await recorder.abort();
        say(`version ${name}: stopped — nothing kept`, 8000);
        return null;
      }
      say(`version ${name} · the sound is in · being packed…`);
      const took = await recorder.stop();
      const T = c => +(c - me.t0).toFixed(4), stops = log.slice(log0);
      const ms = v => +(v * 1000).toFixed(3), worst = a => Math.max(0, ...a.map(Math.abs));
      // electronics main, a line a run: at c0 it leaves p0; at c1 it is on p1, and stays
      const mainLine = stops.map(r => ({ c0: T(r.began), c1: T(r.ctxTime), p0: +r.from.toFixed(4), p1: +r.at.toFixed(4) }));
      // how a read moved through its stretch (icy; a render made with a changing speed): 33 points, or none = evenly
      const fracOf = f => {
        if (!f) return null;
        const a = [];
        let even = true;
        for (let i = 0; i <= 32; i++) { const v = f(i / 32); a.push(+v.toFixed(5)); if (Math.abs(v - i / 32) > 1e-6) even = false; }
        return even ? null : a;
      };
      const snds = me.sounds.map(({ row, x, sec }) => ({
        kind: row.kind, id: row.id, variant: row.variant || null, page: sec + 1, pattern: row.pattern || null,
        when: T(row.when), end: T(row.end), hue: hueOf(row.id),
        ...(row.kind === 'attack' ? { at: x.at, dur: x.dur } : { t0: x.t0, t1: x.t1, frac: fracOf(row.frac) }),
      })).sort((a, b) => a.when - b.when);
      // THE CHECK the plan asks for — "same length, same stops" — against the roll itself
      const check = {
        runs: runs.length, stops: stops.length,
        stopWorstMs: worst(stops.map(r => r.errMs)),                                   // a stop: off its section end, ms of score
        startWorstMs: ms(worst(stops.map(r => r.began - r.asked))),                    // a start: off the moment asked for (it begins on a block)
        waitWorstMs: ms(worst(stops.map((r, i) => (r.began - (i ? stops[i - 1].ctxTime : me.started)) - runs[i].wait))),
        runWorstMs: ms(worst(stops.map(r => (r.ctxTime - r.began) - (r.at - r.from)))),    // a run: its time against the score it crossed
        rolled: +runs.reduce((s, r) => s + r.wait + (r.t1 - r.t0), 0).toFixed(3),      // START → the end of electronics main, as rolled
        held: stops.length ? +(stops[stops.length - 1].ctxTime - me.started).toFixed(3) : 0,    // … and as it went
      };
      const body = {
        name, seed: scn.seed, piece: 'Sýnthesi Alpha', voice: scn.piece, scenario: scn.name,
        sampleRate: took.sampleRate, frames: took.frames, gaps: took.gaps, chunks: took.chunks,
        partial: o.page || o.wait != null ? { page: o.page || null, wait: o.wait ?? null } : null,
        check,
        picture: { schema: 1, kind: 'picture', curlag: CURLAG, pxPerSecond: SD.PXS, duration: SD.DUR,
                   screen: (scn.form || {}).screen || null, hall: TAIL, start: T(me.started),
                   main: mainLine, sounds: snds },
      };
      const r = await fetch(`/version-end?name=${name}`, { method: 'POST', body: JSON.stringify(body) });
      if (!r.ok) throw new Error(`version-end: ${r.status} ${await r.text()}`);
      open = false;
      me.out = await r.json();
      rig.lastVersion = me.out;
      say(`version ${name} made · ${fmtT(me.out.sound.seconds)} · ${(me.out.sound.bytes / 1e6).toFixed(1)} MB`, 30000);
      return me.out;
    } catch (e) {
      if (open) await recorder.abort().catch(() => {});
      throw e;
    } finally { ver = null; }
  }

  // ---- a take: the page's own output, as heard on the bus (after the
  // limiter), posted to the server — build/takes/<name>.webm. For journal
  // clips and preview mp3s; nothing in the piece depends on it.
  function record(name, seconds) {
    const dest = ctx.createMediaStreamDestination();
    engine.limiter.connect(dest);
    const rec = new MediaRecorder(dest.stream), parts = [];
    rec.ondataavailable = e => parts.push(e.data);
    return new Promise((res, rej) => {
      rec.onstop = () => {
        engine.limiter.disconnect(dest);
        fetch('/store-take?name=' + encodeURIComponent(name), { method: 'POST', body: new Blob(parts) })
          .then(r => res(r.status), rej);
      };
      rec.start();
      setTimeout(() => rec.stop(), seconds * 1000);
    });
  }

  rig.scenario = { start, cancel, log, goTo, testSeam, rollLayer1, record, timeline, centreAt, halfSpan, visible,
                   makeVersion, version: () => ver,
                   players, sounds, picks: () => picks, urlPage, pageMaterial,
                   rollDesign, designOf, rollSequences, standOf, renders, renderedLookup, renderedContainer,
                   streamsOf: n => designs.get('streams' + n), design: () => lastDesign, designVoices: () => VD, designSets: () => VDs,
                   playRange, say, loadScn, scn: () => scn, el, FONT, fmtT,
                   loud: () => loud, state: () => state && { k: state.k, phase: state.phase, runs: state.runs },
                   busy };
  console.log('[scenario] armed — ENTER start · ESC stop · G go to · wheel scrubs');
}
