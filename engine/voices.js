// Voices — how a picked ATTACK and a picked PHRASE are sounded, anywhere:
// the sampler's impacts, the keys of the play-in, a replayed pattern
// (first-scenario plan P2a · P2b; journal §200–§204). One source, so what
// is auditioned is what is played in and what is replayed.
//
//   strike(a, o)        an attack: an enveloped one-shot. Any number at once.
//   sing(ph, variant, o) a phrase: read by a playhead of its own from a small
//                       pool — plain, or the engine's granular backward —
//                       ending in its fade and its own reverb send.
//
// Both take `when` (a context time) so a pattern can be scheduled ahead and
// replay on the audio clock, not on a timer.
//
// THE CURSORS' BUS (plan P2f, journal §217): every attack and every phrase
// goes through one point before the master, so an overlay can sit over all
// that the cursors play and leave electronics main alone.
//
// OVERLAYS — the scenario file's "overlays", by name. Two kinds, by what they
// are laid over (J's own distinction, journal §218):
//   on each hit      a "swell" (crescendo) is a way of READING A PHRASE: a line
//                    through it in dB, on the phrase's own voice. Attacks stay
//                    strikes. "icy" — his slow read, his freeze of 2015 — is
//                    another: the read point crawls at `speed` of real time
//                    while long grains, many at once, each read forward at
//                    pitch through one of his own windows.
//   over everything  a "tremolo" sits on the bus: one LFO over all that the
//                    cursors play, whatever is playing, its speed steady or
//                    moving in a pattern. An "override" — the buffer override
//                    (engine/override-processor.js) — sits there too: the
//                    sound cut into forced buffers, the first sliver of each
//                    repeated, the repeats quickening into a blur.

// A BUS BY NAME: input → the override (once its worklet is in) → trem (the
// tremolo's gain) → master. "main" is the one the sampler, the play-in and
// the scenario's played-in patterns share. A set of voices may have a bus of
// its OWN (journal §241): two sequences sounding together, one under a
// tremolo and one not, need the tremolo over one of them only — and an
// overlay "over everything" is then over everything THAT SET plays.
export function cursorBus(engine, ctx, key = 'main') {
  const all = engine.cursorBusses || (engine.cursorBusses = {});
  if (!all[key]) {
    const input = ctx.createGain(), trem = ctx.createGain();
    input.connect(trem); trem.connect(engine.master);
    const B = all[key] = { key, input, trem, cur: null, name: 'off', over: null };
    if (key === 'main') engine.cursors = B;
    engine.overrideModule = engine.overrideModule ||
      ctx.audioWorklet.addModule(new URL('./override-processor.js', import.meta.url));
    B.ready = engine.overrideModule.then(() => {
      B.over = new AudioWorkletNode(ctx, 'override-processor',
        { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] });
      input.disconnect(trem); input.connect(B.over); B.over.connect(trem);   // off, it passes the sound as it is
    }).catch(e => console.error('override:', e));
  }
  return all[key];
}
// a tremolo's numbers: d = how far the gain dips (1 = to silence); m = the
// makeup that keeps the POWER of the sound what it was (the mean of gain²
// over a cycle brought back to 1) — one loudness, on or off
export function tremoloLevels(o) {
  const d = 1 - 10 ** (-(o.depthDb ?? 24) / 20), h = d / 2;
  const wobble = o.shape === 'chop' ? 1 : o.shape === 'triangle' ? 1 / 3 : 1 / 2;
  return { d, m: 1 / Math.sqrt((1 - h) ** 2 + h * h * wobble) };
}

export function makeVoices({ engine, ctx, cfg, bus: busKey = 'main' }) {
  // cfg() → the scenario file's "sampler" block, merged with defaults, read live
  const conv = engine.fx.reverb.conv;
  const B = cursorBus(engine, ctx, busKey), bus = B.input;
  // his ten grain windows (engine/grain-windows.json, from his own files), fetched once an engine
  if (!engine.grainWindows) engine.grainWindows = fetch(new URL('./grain-windows.json', import.meta.url))
    .then(r => r.json()).then(j => Object.fromEntries(Object.entries(j.windows).map(([k, v]) => [k, new Float32Array(v)])))
    .catch(e => { console.error('grain windows:', e); return {}; });
  const GAIN = 0.9;                                 // a phrase voice's level, as it was
  // by name — or an overlay handed over whole (a designed page fits one to its own length: journal §240)
  const overlayOf = name => !name || name === 'off' ? null : typeof name === 'object' ? name
    : ((cfg().overlays || {}).presets || []).find(o => o.name === name) || null;
  // a swell's line, in dB: u = how far through the phrase (0 … 1)
  const swellDb = (o, u) => o.fromDb + (o.toDb - o.fromDb) * u ** (o.bend ?? 1);
  // ONE LOUDNESS, phrase by phrase: the makeup (dB) that brings this phrase's
  // loudest 50 ms, swelled, back to what it is untouched — measured on the
  // phrase AS THE PAGE SOUNDS IT, once a phrase, overlay and direction. (A
  // makeup for the overlay as a whole left single phrases up to 18 dB under;
  // and a reversed read is not the sound turned round — journal §217.)
  const GRAIN = { winsz: 0.2, overlaps: 8, rand: 0, window: null };      // a phrase voice's own grain
  // A read that changes speed DWELLS where it is slow: one that speeds up
  // spends its time on the phrase's start (the attack — loud), one that slows
  // down on its tail. By how much (dB) that lifts or drops the stretch's level
  // against the phrase read evenly — the time spent at a place is 1 / the
  // speed there, and the speed moves in a straight line across the phrase.
  // Measured +3 and −3 dB on a take before this was taken out (journal §221).
  const dwells = new Map();
  function dwellDb(ph, name, s0, s1, back) {
    const key = `${ph.id}|${name}|${back ? 'r' : 'p'}`;
    if (dwells.has(key)) return dwells.get(key);
    const bf = engine.buffer, sr = bf.sampleRate, i0 = Math.floor(ph.t0 * sr), n = Math.max(2, Math.floor(ph.t1 * sr) - i0);
    const L = bf.getChannelData(0), R = bf.numberOfChannels > 1 ? bf.getChannelData(1) : L;
    let even = 0, held = 0, time = 0;
    for (let i = 0; i < n; i++) {
      const j = i0 + (back ? n - 1 - i : i), e = ((L[j] + R[j]) / 2) ** 2, w = 1 / (s0 + (s1 - s0) * i / (n - 1));
      even += e; held += e * w; time += w;
    }
    const d = even > 0 && held > 0 ? Math.max(-9, Math.min(9, 10 * Math.log10((held / time) / (even / n)))) : 0;
    dwells.set(key, d);
    return d;
  }
  // HOW A PHRASE IS READ, under an overlay or none: from a to b at `speed`
  // of real time, lasting `dur`, in which grain, with which makeup
  function readOf(ph, variant = 'plain', overlay) {
    const C = cfg(), v = variant === 'plain' ? { speed: 1 } : C.variants[variant];
    const o = overlayOf(overlay), icy = o && o.kind === 'icy' ? o : null;
    const back = !!v.backward, k = v.speed ?? 1;
    const a = back ? ph.t1 : ph.t0, b = back ? ph.t0 : ph.t1, len = Math.abs(b - a);
    // icy's speed: one number — or [from, to], the read SPEEDING UP or SLOWING
    // DOWN through the phrase, pitch held (workshop 4). The speed moves by
    // equal ratios in equal times, so the phrase lasts len · ln(to/from) / (to − from),
    // and at u of its time the read is frac(u) of the way through it.
    const sp = icy ? icy.speed : 1, [s0, s1] = Array.isArray(sp) ? sp : [sp, sp], r = s1 / s0;
    const dur = r === 1 ? len / (k * s0) : len * Math.log(r) / (k * (s1 - s0));
    const frac = r === 1 ? (u => u) : (u => (r ** u - 1) / (r - 1));
    return { a, b, back, speed: k * s0, speedTo: k * s1, dur, frac, o,
             makeupDb: icy ? (icy.makeupDb ?? 9) - (r === 1 ? 0 : dwellDb(ph, icy.name, s0, s1, back)) : (v.makeupDb ?? 12),
             grain: icy ? { winsz: icy.win, overlaps: icy.overlaps, rand: icy.rand ?? 0, window: icy.window ?? null } : GRAIN };
  }
  // the phrase's energy, frame by frame, in the order it is heard. Plain =
  // the source itself (at tempo == pitch the taps align). Reversed = the
  // engine's granular backward, summed tap by tap as the worklet sums it:
  // the phasor walks back from the end, each tap reads FORWARD from where it
  // was born — and the taps resting at the start read on past the end.
  function heard(ph, back) {
    const b = engine.buffer, C = cfg(), cs = ctx.sampleRate, q = b.sampleRate / cs;
    const L = b.getChannelData(0), R = b.numberOfChannels > 1 ? b.getChannelData(1) : L, last = L.length - 1;
    const n = Math.max(2, Math.round((ph.t1 - ph.t0) * cs)), y = new Float32Array(n);
    const src = j => { const k = Math.round(j); return k < 0 || k > last ? 0 : (L[k] + R[k]) / 2; };
    if (!back) for (let i = 0; i < n; i++) y[i] = src(ph.t0 * b.sampleRate + i * q);
    else {
      const G = Math.round(GRAIN.winsz * cs), hop = Math.round(G / GRAIN.overlaps), p1 = ph.t1 * b.sampleRate;
      const tap = (start, age, at) => {
        for (; age < G && at < n; age++, at++) y[at] += src(start + age * q) * 0.5 * (1 - Math.cos(2 * Math.PI * age / G));
      };
      for (let j = 1; j < GRAIN.overlaps; j++) tap(p1, j * hop, 0);            // the resting taps
      for (let at = 0; at < n; at += hop) tap(p1 - at * q, 0, at);             // one born every hop
    }
    const fi = Math.round((back ? 0.02 : ph.fadeIn || 0) * cs), fo = Math.round((C.phraseFade || 0) * cs);
    const e = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let g = 1;
      if (i < fi) g *= 0.5 * (1 - Math.cos(Math.PI * i / fi));
      if (n - i < fo) g *= 0.5 * (1 - Math.cos(Math.PI * (n - i) / fo));
      e[i] = (y[i] * g) ** 2;
    }
    return e;
  }
  const makeups = new Map();
  function swellMakeup(ph, o, back) {
    const key = `${ph.id}|${o.name}|${back ? 'r' : 'p'}`;
    if (makeups.has(key)) return makeups.get(key);
    const e = heard(ph, back), n = e.length, w = Math.min(n, Math.round(0.05 * ctx.sampleRate));
    let s0 = 0, s1 = 0, m0 = 0, m1 = 0;
    const e1 = i => e[i] * 10 ** (swellDb(o, i / (n - 1)) / 10);
    for (let i = 0; i < n; i++) {
      s0 += e[i]; s1 += e1(i);
      if (i >= w) { s0 -= e[i - w]; s1 -= e1(i - w); }
      if (i >= w - 1) { m0 = Math.max(m0, s0); m1 = Math.max(m1, s1); }
    }
    const mk = m0 > 0 && m1 > 0 ? Math.max(-6, Math.min(18, 10 * Math.log10(m0 / m1))) : 0;
    makeups.set(key, mk);
    return mk;
  }

  // ---- the bus overlay: on from `when` (a context time), from the top of
  // its pattern; any other name — "off", a swell, none — clears the bus ----
  const onBus = name => ['tremolo', 'override'].includes((overlayOf(name) || {}).kind);
  function busOverlay(name, when) {
    const t = Math.max(when ?? 0, ctx.currentTime), any = onBus(name) ? overlayOf(name) : null;
    // the override: its shape begins at t, or it lets the sound through again
    const ov = any && any.kind === 'override' ? any : null;
    B.ready.then(() => B.over && B.over.port.postMessage(!ov ? { type: 'off', at: t } : {
      type: 'on', at: t, buf: ov.buf ?? 0.25, rate: ov.rate, over: ov.over, pattern: ov.pattern, hold: ov.hold,
      stay: ov.stay, smooth: ov.smooth ?? 0.1, mix: ov.mix ?? 1, gain: 10 ** ((ov.makeupDb ?? 0) / 20) }));
    const o = any && any.kind === 'tremolo' ? any : null;
    if (B.cur) {                                    // the one that was running lets go
      B.cur.amp.gain.cancelScheduledValues(t); B.cur.amp.gain.setTargetAtTime(0, t, 0.01);
      B.cur.osc.stop(t + 0.3);
    }
    B.trem.gain.cancelScheduledValues(t);
    B.cur = null; B.name = any ? any.name : 'off';
    if (!o) { B.trem.gain.setTargetAtTime(1, t, 0.01); return B.name; }
    const { d, m } = tremoloLevels(o);
    const osc = ctx.createOscillator(), amp = ctx.createGain(), f = osc.frequency;
    osc.type = o.shape === 'chop' ? 'square' : (o.shape || 'sine');
    // the speed: steady, or moving between two speeds over `over` seconds —
    // "accel": up and begin again · "waves": up and back down — on and on
    const [r0, r1] = Array.isArray(o.rate) ? o.rate : [o.rate, o.rate], T = o.over || 8;
    f.setValueAtTime(r0, t);
    if (r1 !== r0) for (let k = 0, at = t; at < t + 1500; k++, at += T) {
      const up = o.pattern !== 'waves' || k % 2 === 0;
      f.setValueAtTime(up ? r0 : r1, at);
      f.exponentialRampToValueAtTime(up ? r1 : r0, at + T - 0.002);
    }
    amp.gain.value = 0;
    amp.gain.setTargetAtTime(m * d / 2, t, 0.01);
    if (o.shape === 'chop') {                       // a square with its corners off: no click on a held sound
      const soft = ctx.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 90;
      osc.connect(soft); soft.connect(amp);
    } else osc.connect(amp);
    amp.connect(B.trem.gain);                       // gain = m·(1 − d/2) + m·d/2 · lfo: from m down to m·(1 − d)
    B.trem.gain.setTargetAtTime(m * (1 - d / 2), t, 0.01);
    osc.start(t);
    B.cur = { osc, amp, t0: t };
    return B.name;
  }

  // ---- attacks ----
  function impactCurve(a, normalize) {
    const imp = cfg().impacts || {};
    const c = window.EnvCurves.envCurve(a.env, a.amp ?? 0.9, a.dur);
    const acc = a.accent !== undefined ? a.accent : imp.accent;   // a trial version may carry its own
    if (acc) {                 // a lift over the first ms, eased back over as many again
      const k = 10 ** (acc.db / 20);
      for (let i = 0; i < c.length; i++) {
        const ms = i / (c.length - 1) * a.dur * 1000;
        const w = ms <= acc.ms ? 1 : Math.max(0, 1 - (ms - acc.ms) / acc.ms);
        c[i] *= 1 + (k - 1) * w;
      }
    }
    if ((normalize ?? imp.normalize) && a.gainDb) {
      const g = 10 ** (a.gainDb / 20);
      for (let i = 0; i < c.length; i++) c[i] *= g;
    }
    return c;
  }
  // a.render = { buffer, at }: the attack read not from the sound itself but
  // from a PRE-PROCESSED version of its container, at the place that
  // corresponds (journal §242) — the same envelope, another source
  function strike(a, o = {}) {
    const src = ctx.createBufferSource(), r = a.render;
    src.buffer = r ? r.buffer : engine.buffer;
    const g = ctx.createGain(); g.gain.value = 0;
    const when = Math.max(o.when ?? 0, ctx.currentTime + 0.005);
    g.gain.setValueCurveAtTime(impactCurve(a, r ? false : o.normalize), when, a.dur);
    src.connect(g); g.connect(bus);
    src.start(when, r ? r.at : a.at, a.dur + 0.05);
    src.stop(when + a.dur + 0.06);
    src.onended = () => { src.disconnect(); g.disconnect(); };
    return when;
  }

  // ---- phrases: a pool of playheads, each with a reverb send of its own ----
  const pool = [];
  let serial = 0;
  function ensurePool(n) {
    while (pool.length < n) {
      const p = engine.createPlayhead();          // not in the page's transport list: SPACE never touches it
      p.node.disconnect(engine.master); p.node.connect(bus);
      p.gain = GAIN;
      p.setGrain({ ...GRAIN, jitter: 0 });
      engine.grainWindows.then(w => p.setWindows(w));
      const send = ctx.createGain(); send.gain.value = 0;
      p.node.connect(send); send.connect(conv);
      // several plays may wait on one voice (a pattern is scheduled ahead):
      // each start is reported to its own caller, by id
      const v = { p, send, busyUntil: 0, waiting: new Map() };
      p.onstarted = m => { const f = v.waiting.get(m.id); v.waiting.delete(m.id); if (f) f(m); };
      pool.push(v);
    }
    engine.fx.reverb.ret.gain.setTargetAtTime(1, ctx.currentTime, 0.02);
    return pool.length;
  }
  // A PHRASE READ FROM A RENDER (journal §242): ph.render = { buffer, at } —
  // the phrase's own length of a pre-processed version of its container,
  // from the place that corresponds. Plain playback of a file: no playhead,
  // no grains. Reversed, the piece itself is turned round. A crescendo, if
  // the hit carries one, is the same line in dB over the piece.
  const playing = new Set();                        // the files that are sounding (hush stops them)
  function singRender(ph, variant, o) {
    const C = cfg(), r = ph.render, back = variant === 'reverse', sr = r.buffer.sampleRate;
    const when = Math.max(o.when ?? 0, ctx.currentTime + 0.005);
    // its own length of the render — or, r.whole, the render from start to end (a pre-processed
    // container played as a container: journal §243)
    const dur = r.whole ? r.buffer.duration - r.at
      : Math.max(0.05, Math.min(ph.t1 - ph.t0, r.buffer.duration - r.at)), end = when + dur;
    const src = ctx.createBufferSource(), g = ctx.createGain();
    if (!back) src.buffer = r.buffer;
    else {
      const i0 = Math.floor(r.at * sr), n = Math.max(1, Math.floor(dur * sr));
      const b = ctx.createBuffer(r.buffer.numberOfChannels, n, sr);
      for (let c = 0; c < b.numberOfChannels; c++) {
        const s = r.buffer.getChannelData(c), d = b.getChannelData(c);
        for (let i = 0; i < n; i++) d[i] = s[i0 + n - 1 - i] || 0;
      }
      src.buffer = b;
    }
    const ov = overlayOf(o.overlay), sw = ov && ov.kind === 'swell' ? ov : null;
    const fin = 0.02, fout = Math.min(dur / 2, C.phraseFade || 0.08), N = 24;
    // ONE LOUDNESS for a swelled piece too: its loudest 50 ms brought back to what the piece is
    // untouched, measured on the piece (as `swellMakeup` does for a phrase of the sound itself)
    let mk = 0;
    if (sw) {
      const s = r.buffer.getChannelData(0), i0 = Math.floor(r.at * sr), n = Math.max(2, Math.floor(dur * sr));
      const w = Math.min(n, Math.round(0.05 * sr)), e0 = j => s[i0 + (back ? n - 1 - j : j)] ** 2 || 0;
      let s0 = 0, s1 = 0, m0 = 0, m1 = 0;
      const e1 = j => e0(j) * 10 ** (swellDb(sw, j / (n - 1)) / 10);
      for (let j = 0; j < n; j++) {
        s0 += e0(j); s1 += e1(j);
        if (j >= w) { s0 -= e0(j - w); s1 -= e1(j - w); }
        if (j >= w - 1) { m0 = Math.max(m0, s0); m1 = Math.max(m1, s1); }
      }
      mk = m0 > 0 && m1 > 0 ? Math.max(-6, Math.min(18, 10 * Math.log10(m0 / m1))) : 0;
    }
    const level = u => GAIN * (sw ? 10 ** ((swellDb(sw, u) + mk) / 20) : 1) *
      Math.min(1, (u * dur) / fin, ((1 - u) * dur) / fout);
    g.gain.setValueAtTime(0, when);
    for (let i = 1; i <= N; i++) g.gain.linearRampToValueAtTime(Math.max(0, level(i / N)), when + dur * i / N);
    src.connect(g); g.connect(bus);
    if (back) src.start(when); else src.start(when, r.at, dur + 0.02);
    src.stop(end + 0.05);
    playing.add(src);
    src.onended = () => { playing.delete(src); src.disconnect(); g.disconnect(); };
    if (o.onstart) o.onstart({ ctxTime: when });
    // where the read the render was made with IS, at u of the time — turned round for a reversed play
    const f = r.frac || (u => u);
    return { when, end, voice: -1, stolen: false, frac: back && r.frac ? (u => 1 - f(1 - u)) : f };
  }
  // o: { when, onstart, overlay } → { when, end, voice, stolen }
  function sing(ph, variant = 'plain', o = {}) {
    if (ph.render) return singRender(ph, variant, o);
    const C = cfg();
    const { a, b, back, speed, speedTo, dur, frac, makeupDb, grain } = readOf(ph, variant, o.overlay);
    const when = Math.max(o.when ?? 0, ctx.currentTime), end = when + dur;
    if (!pool.length) ensurePool(C.voices || 4);
    // a free voice; else the one that will be free soonest (it crossfades out)
    let voice = pool.filter(x => x.busyUntil <= when).sort((x, y) => x.busyUntil - y.busyUntil)[0];
    const stolen = !voice;
    if (!voice) voice = pool.slice().sort((x, y) => x.busyUntil - y.busyUntil)[0];
    const id = ++serial;
    if (o.onstart) voice.waiting.set(id, o.onstart);
    voice.busyUntil = end + 0.1;
    // the makeup that matches this read to the plain one — only heard off tempo == pitch
    voice.p.node.parameters.get('makeup').setValueAtTime(Math.max(1, 10 ** (makeupDb / 20)), when);
    voice.p.play(a, b, { speed, fade: C.phraseFade, fadeIn: back ? 0.02 : ph.fadeIn, grain,
                         at: o.when != null ? when : null, id });
    if (speedTo !== speed)                          // the read's own speed, moving to the phrase's end
      voice.p.node.parameters.get('tempo').exponentialRampToValueAtTime((back ? -1 : 1) * speedTo, when + dur);
    // the overlay, where it is a way of reading the phrase: a swell is a
    // line on this voice's gain, from the phrase's start to its end
    const ov = overlayOf(o.overlay), gp = voice.p.node.parameters.get('gain');
    gp.cancelScheduledValues(when);
    if (ov && ov.kind === 'swell') {
      const N = 24, mk = swellMakeup(ph, ov, back), g = u => GAIN * 10 ** ((swellDb(ov, u) + mk) / 20);
      gp.setValueAtTime(g(0), when);
      for (let i = 1; i <= N; i++) gp.linearRampToValueAtTime(g(i / N), when + dur * i / N);
    } else gp.setValueAtTime(GAIN, when);
    // its own reverb send, on the audio clock: open for the last `capture`
    // seconds of sound (all of it, if shorter), closed just after the end
    const g = voice.send.gain;
    g.cancelScheduledValues(when);
    if (/reverb/.test(C.phraseEnd)) {
      const V = C.reverb || { send: 0.5, capture: 0.6 };
      g.setTargetAtTime(C.phraseReverbSend ?? V.send, Math.max(when, end - V.capture), 0.05);
      g.setTargetAtTime(0, end + 0.3, 0.05);
    } else g.setTargetAtTime(0, when, 0.02);
    return { when, end, voice: pool.indexOf(voice), stolen, frac };
  }
  function hush() {                                 // every phrase voice stops now, and every file
    for (const src of playing) { try { src.stop(); } catch (e) {} }
    playing.clear();
    for (const v of pool) {
      v.p.stopAt(null); v.p.gate(false); v.busyUntil = 0; v.waiting.clear();
      v.send.gain.cancelScheduledValues(ctx.currentTime);
      v.send.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    }
  }
  return { strike, sing, hush, ensurePool, impactCurve, pool, bus, overlayOf, swellMakeup, readOf,
           onBus, busOverlay, busName: () => B.name };
}
