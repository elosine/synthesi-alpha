// Patterns — a played-in pattern sounded again (first-scenario plan P2b ·
// P2c; journal §204, §207). One player for the play-in's replay button and
// for the scenario, so a pattern heard where it was recorded is the pattern
// the piece plays.
//
// A pattern is scheduled ahead on the AUDIO clock — its rhythm is the thing
// it exists to keep — through engine/voices.js.
//
//   visible(x, when)  is this sound's place on screen at context time `when`?
//                     Omitted = always. This is P2c's rule, J's own sentence:
//                     "if they go off the screen, they go off the screen" —
//                     a sound is called only while its place is on screen.
//   onSound(row, x)   told of every sound as it is scheduled (the picture
//                     draws from it).
//   overlay           an overlay's name (the scenario file's "overlays") LAID
//                     OVER the whole of it, whatever it was played with, "off"
//                     for none — on each phrase, or on the bus, as its kind
//                     is. Omitted = as it was played in: each hit with its
//                     own, the bus as recorded. play(…, { overlay }) says it
//                     for one play (the play-in's audition).
//   fallback          the PAGE's overlay (journal §231): what a hit or a
//                     pattern gets when it was played in WITHOUT one. What he
//                     played with always wins over it.

export function makePatternPlayer({ ctx, V, lookup, visible, onSound, overlay, fallback }) {
  let run = null, last = null;
  // a hidden page's timers tick once a second: look further ahead there
  const horizon = () => document.hidden ? 1.5 : 0.35;

  // one pattern, or a list of them played one after another
  function play(patterns, o = {}) {
    stop();
    const list = Array.isArray(patterns) ? patterns : [patterns];
    const evs = [];
    let off = 0;
    for (const pt of list) {
      // a pattern that recorded no bus overlay of its own takes the page's, from its first moment
      if (!pt.events.some(e => e.kind === 'bus')) evs.push({ t: off, kind: 'bus', name: fallback ?? 'off' });
      for (const e of pt.events) evs.push({ ...e, t: off + e.t, pattern: pt.name || null });
      off += pt.duration + (o.gap || 0);
    }
    evs.sort((a, b) => a.t - b.t);
    const me = { base: (o.when ?? ctx.currentTime) + 0.25, i: 0, rows: [], timer: 0, endTimer: 0,
                 duration: off, done: false, over: o.overlay ?? overlay,
                 name: list.map(p => p.name || 'the last take').join(' · ') };
    // the bus from the first moment: the overlay laid over it, or clear —
    // and then, played "as it was", whatever the recording switched on
    V.busOverlay(me.over ?? 'off', me.base);
    const tick = () => {
      const until = ctx.currentTime + horizon();
      while (me.i < evs.length && me.base + evs[me.i].t < until) {
        const e = evs[me.i++], when = me.base + e.t;
        if (e.kind === 'bus') { if (me.over === undefined) V.busOverlay(e.name, when); continue; }
        const x = lookup(e.id, e);                  // the event too: a designed read may carry its span
        if (!x) continue;                           // a sound no longer among the picks
        const called = !visible || visible(x, when);
        const row = { ...e, when, called, actual: null, end: null };
        me.rows.push(row);
        if (!called) continue;
        if (e.kind === 'attack') { row.actual = V.strike(x, { when }); row.end = row.actual + x.dur; }
        else {
          const r = V.sing(x, e.variant, { when, overlay: me.over ?? e.overlay ?? fallback,
                                           onstart: m => { row.actual = m.ctxTime; } });
          row.end = r.end; row.frac = r.frac;         // frac: how far through the phrase the read is, at u of its time
        }
        if (onSound) onSound(row, x);
      }
      if (me.i >= evs.length) {
        clearInterval(me.timer); me.timer = 0;
        me.endTimer = setTimeout(() => {
          me.done = true;
          if (run === me) run = null;
          if (o.onDone) o.onDone(me);
        }, Math.max(0, (me.base + me.duration - ctx.currentTime) * 1000 + 300));
      }
    };
    run = last = me;
    tick();
    if (me.i < evs.length) me.timer = setInterval(tick, 100);
    return me;
  }
  // ends the calling; what is already sounding is the caller's (V.hush)
  function stop() {
    if (run) { clearInterval(run.timer); clearTimeout(run.endTimer); }
    run = null;
  }
  return { play, stop, run: () => run, last: () => last };
}
