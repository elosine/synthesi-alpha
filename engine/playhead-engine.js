// Playhead engine — reusable main-thread module (playhead-rig-spec).
// A piece = (audio file(s), section-index.json, mappings). This module
// owns the context graph: N playheads -> master gain -> safety limiter
// -> mono-capable output. section-index.json is the engine's contract.

export class PlayheadEngine {
  constructor(ctx) {
    this.ctx = ctx;
    this.buffer = null;
    this.index = null;
    this.sections = [];
    this.playheads = [];
    this.master = ctx.createGain();
    // The ensemble bus (2026-08-30, journal §113-114): voices sum at
    // master; the DRY path runs master -> dry -> HPF -> glue comp ->
    // limiter -> out. Send/return FX tap master PRE-dry, so an ending
    // can kill the dry while a tail keeps receiving, and join again
    // before the limiter. Sends are silent by default and general —
    // endings are just their first customer.
    this.dry = ctx.createGain();
    this.hpf = ctx.createBiquadFilter();
    this.hpf.type = 'highpass';
    this.hpf.frequency.value = 30;
    this.hpf.Q.value = 0.71;
    this.comp = ctx.createDynamicsCompressor();   // glue
    this.comp.threshold.value = -18;
    this.comp.knee.value = 6;
    this.comp.ratio.value = 2;
    this.comp.attack.value = 0.03;
    this.comp.release.value = 0.25;
    this.limiter = ctx.createDynamicsCompressor(); // safety on the sum
    this.limiter.threshold.value = -1;
    this.limiter.knee.value = 0;
    this.limiter.ratio.value = 20;
    this.limiter.attack.value = 0.002;
    this.limiter.release.value = 0.1;
    this.out = ctx.createGain(); // mono toggle lives here
    this.out.channelCountMode = 'explicit';
    this.out.channelCount = 2;
    this.master.connect(this.dry);
    this.dry.connect(this.hpf);
    this.hpf.connect(this.comp);
    this.comp.connect(this.limiter);
    this.limiter.connect(this.out);
    this.out.connect(ctx.destination);
    // -- reverb send (generated hall IR, swappable later) --
    const rvSend = ctx.createGain(); rvSend.gain.value = 0;
    const conv = ctx.createConvolver();
    conv.buffer = this._makeIR(4.0);
    const rvRet = ctx.createGain(); rvRet.gain.value = 1;
    this.master.connect(rvSend); rvSend.connect(conv);
    conv.connect(rvRet); rvRet.connect(this.limiter);
    // -- tape delay send (feedback loop, darkening repeats) --
    const tpSend = ctx.createGain(); tpSend.gain.value = 0;
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.35;
    const fb = ctx.createGain(); fb.gain.value = 0.65;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3500;
    this.master.connect(tpSend); tpSend.connect(delay);
    delay.connect(lp); lp.connect(fb); fb.connect(delay);
    const tpRet = ctx.createGain(); tpRet.gain.value = 1;
    lp.connect(tpRet); tpRet.connect(this.limiter);
    this.fx = {
      reverb: { send: rvSend, ret: rvRet, conv },
      tape:   { send: tpSend, ret: tpRet, delay, feedback: fb, filter: lp },
    };
  }

  // exponentially decaying stereo noise — a serviceable hall until a
  // real impulse response replaces it (exp decay ≈ RT60 feel; the
  // first polynomial version died too fast to ring, journal §114)
  _makeIR(seconds = 4, k = 4) {
    const sr = this.ctx.sampleRate, n = Math.floor(sr * seconds);
    const buf = this.ctx.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < n; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-k * i / n);
      }
    }
    return buf;
  }

  static async create(ctx, workletUrl) {
    await ctx.audioWorklet.addModule(workletUrl);
    return new PlayheadEngine(ctx);
  }

  setMono(on) { this.out.channelCount = on ? 1 : 2; }

  async loadBuffer(url, onprogress) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
    const total = +res.headers.get('content-length') || 0;
    const reader = res.body.getReader();
    const parts = []; let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      parts.push(value); got += value.length;
      if (onprogress && total) onprogress(got / total);
    }
    const raw = new Uint8Array(got);
    let o = 0; for (const p of parts) { raw.set(p, o); o += p.length; }
    this.buffer = await this.ctx.decodeAudioData(raw.buffer);
    return this.buffer;
  }

  async loadIndex(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
    this.index = await res.json();
    // Contract read: machine_index rows enriched with their onset entry
    // (matched on section == t0). status prefix "consensus" outranks all.
    const onsets = this.index.onsets || [];
    this.sections = (this.index.machine_index || []).map((s, i) => {
      const on = onsets.find(o => Math.abs(o.section - s.t0) < 1e-6);
      const status = on ? (/^consensus/.test(on.status) ? 'consensus' : 'proposed') : 'none';
      return { i, ...s, onset: on ? on.onset : s.t0, onsetStatus: status };
    });
    return this.index;
  }

  createPlayhead() {
    const ph = new Playhead(this);
    this.playheads.push(ph);
    return ph;
  }
}

export class Playhead {
  constructor(engine) {
    this.engine = engine;
    const ctx = engine.ctx;
    this.node = new AudioWorkletNode(ctx, 'playhead-processor', {
      numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2],
    });
    this.node.connect(engine.master);
    this.t = 0; this.grains = 0; this.rms = 0;
    this.onupdate = null;
    this.onstopped = null;
    this.onstarted = null;
    this.node.port.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'pos') {
        this.t = m.t; this.grains = m.grains; this.rms = m.rms;
        if (this.onupdate) this.onupdate(m);
      } else if (m.type === 'stopped') {
        this.t = m.t;
        if (this.onstopped) this.onstopped(m);
      } else if (m.type === 'started') {
        // a start that waited its moment (start(…, at)): the page's own
        // tempo is the run's only once the run has begun
        if (m.gate && this._tempoAt != null) { this._tempo = this._tempoAt; this._tempoAt = null; }
        if (this.onstarted) this.onstarted(m);
      }
    };
    const b = engine.buffer;
    if (!b) throw new Error('loadBuffer before createPlayhead');
    const channels = [];
    for (let c = 0; c < Math.min(2, b.numberOfChannels); c++) {
      channels.push(new Float32Array(b.getChannelData(c)));
    }
    this.node.port.postMessage(
      { type: 'buffer', channels, sampleRate: b.sampleRate },
      channels.map(c => c.buffer));
  }

  _p(name, v) {
    const p = this.node.parameters.get(name);
    p.setTargetAtTime(v, this.engine.ctx.currentTime, 0.02);
  }
  set tempo(v) { this._p('tempo', v); this._tempo = v; }
  get tempo() { return this._tempo ?? 1; }
  set pitch(v) { this._p('pitch', v); this._pitch = v; }
  get pitch() { return this._pitch ?? 1; }
  set gain(v) { this._p('gain', v); }
  // granular makeup in dB (0 = none); fades in only off tempo==pitch
  set makeupDb(db) { this._p('makeup', Math.max(1, 10 ** (db / 20))); this._makeupDb = db; }
  get makeupDb() { return this._makeupDb ?? 12; }

  seek(t) { this.node.port.postMessage({ type: 'seek', t }); }
  setLoop(on, t0, t1) { this.node.port.postMessage({ type: 'loop', on, t0, t1 }); }
  setGrain(o) { this.node.port.postMessage({ type: 'grain', ...o }); }
  // his grain windows, by name ({ expodec: Float32Array, … }) — a read may then ask for one
  setWindows(tables) { this.node.port.postMessage({ type: 'windows', tables }); }
  gate(on) { this.node.port.postMessage({ type: 'gate', on }); }
  // START a run from rest: the tempo is set AT ONCE (the setter smooths
  // over ~20 ms, and a ramp up from 0 reads as misalignment — the makeup
  // then bursts into every start) and is told to the worklet with the
  // gate, which seats its taps on the phasor so the run begins as the
  // source itself (journal §197)
  // fadeIn = seconds of fade-in at the start (0 = the gate's own ~10 ms)
  // at = a context time: the run begins THEN, in the worklet, to the block
  // (under 3 ms), and the worklet reports 'started' (journal §260 — a wait
  // timed by the audio clock, not by a timer a hidden page holds back)
  start(tempo = 1, fadeIn = 0, at = null) {
    const p = this.node.parameters.get('tempo'), t = at ?? this.engine.ctx.currentTime;
    p.cancelScheduledValues(t);
    p.setValueAtTime(tempo, t);
    if (at == null) this._tempo = tempo; else this._tempoAt = tempo;
    this.node.port.postMessage({ type: 'gate', on: true, tempo, fadeIn, at });
  }
  // take back a start that was asked for and has not begun
  unschedule() {
    this._tempoAt = null;
    const p = this.node.parameters.get('tempo'), t = this.engine.ctx.currentTime;
    p.cancelScheduledValues(t);
    this.node.port.postMessage({ type: 'unqueue' });
  }
  // stop exactly ON t when the phasor next crosses it (the worklet lands
  // there, closes the gate, holds, and reports 'stopped'); null clears.
  // fade = seconds of fade-out ending ON t (0 = the gate's own release)
  stopAt(t, fade = 0) { this.node.port.postMessage({ type: 'stopAt', t, fade }); }
  // read a → b (b < a = backward) and stop ON b: the seek, the stop mark
  // and the start as ONE act in the worklet — now, or at context time
  // `at` (to the block, under 3 ms). o: { speed, fade, fadeIn, at, id, grain }
  // — grain: { winsz, overlaps, rand, window } for this read, set as it begins.
  // The worklet reports 'started' and 'stopped' with the id.
  play(a, b, o = {}) {
    const tempo = (b >= a ? 1 : -1) * (o.speed ?? 1);
    const p = this.node.parameters.get('tempo'), t = o.at ?? this.engine.ctx.currentTime;
    p.cancelScheduledValues(t);
    p.setValueAtTime(tempo, t);
    this._tempo = tempo;
    this.node.port.postMessage({ type: 'play', a, b, tempo, fade: o.fade || 0, grain: o.grain || null,
                                 fadeIn: o.fadeIn || 0, at: o.at ?? null, id: o.id ?? null });
  }

  // Section-targeted playback straight off the contract.
  jumpSection(i, { loop = false, useOnset = true } = {}) {
    const s = this.engine.sections[i];
    if (!s) return;
    this.seek(useOnset ? s.onset : s.t0);
    this.setLoop(loop, useOnset ? s.onset : s.t0, s.t1);
  }
}
