// Playhead processor — one instance = one playhead.
// J's semantics (next-session §5b, docs/reference/bufrd-legacy/):
// a phasor advances through the buffer at TEMPO rate; overlapped
// windowed read-taps play at PITCH rate. Warp1 decomposed:
// tempo = phasor advance, pitch = each tap's own read rate.
// tempo 0 with taps running = the freeze.

class PlayheadProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'tempo', defaultValue: 1, minValue: -16, maxValue: 16, automationRate: 'k-rate' },
      { name: 'pitch', defaultValue: 1, minValue: 0, maxValue: 16, automationRate: 'k-rate' },
      { name: 'gain',  defaultValue: 1, minValue: 0, maxValue: 8,  automationRate: 'k-rate' },
      // granular makeup (linear): at tempo == pitch the taps align and
      // reconstruct at full level; off alignment they decorrelate and
      // partially cancel (measured -16..-41 dB, journal §107). The
      // makeup fades in with misalignment so coherent playback is
      // untouched. Default +12 dB; dialed by ear.
      { name: 'makeup', defaultValue: 4, minValue: 1, maxValue: 16, automationRate: 'k-rate' },
    ];
  }

  constructor() {
    super();
    this.chans = null;        // [Float32Array, Float32Array]
    this.bufSr = 48000;
    this.srRatio = 1;         // buffer frames per context frame at rate 1
    this.len = 0;
    this.pos = 0;             // phasor, buffer frames (float)
    this.grains = [];         // {start, age, dur} — age/dur in context frames
    this.sinceSpawn = 1e9;    // force immediate first spawn
    this.winsz = 0.2;         // s  (Warp1 defaults: 0.2 / 8)
    this.overlaps = 8;
    this.jitter = 0;          // s, random offset on each tap's start
    this.rand = 0;            // 0 … 1, how far a grain's length may stray (Warp1's windowRandRatio)
    this.win = null;          // the grain window: one of his ten by name, or null = the Hann
    this.winMean = 0.5;
    this.windows = null;
    this.hop = 1;             // context frames between spawns
    this.grainDur = 1;        // context frames
    this.recalcGrain();
    this.gateTarget = 0;      // 0 silent, 1 sounding
    this.gateEnv = 0;
    this.loopOn = false;
    this.loopA = 0;           // buffer frames
    this.loopB = 0;
    // a stop ON a position (first-scenario plan P1, journal §196): when
    // the phasor crosses stopAt it lands exactly there, the gate closes
    // and the phasor is HELD until the next gate-on — the main thread's
    // tempo ramp cannot creep it past the seam
    this.stopAt = null;       // buffer frames, or null
    this.held = false;
    // an optional fade INTO the stop mark (a raised cosine over the last
    // fadeFrames context frames), so the sound is already gone on the seam
    this.fadeFrames = 0;
    this.fadeGain = 1;
    // the makeup actually applied — latched while the gate is closed (see
    // process) — and the run tempo a start was told, used until the tempo
    // parameter arrives (journal §197)
    this.mk = 1;
    this.startTempo = null;
    this.lastPitch = 1;
    this.inFrames = 0;        // a fade-in at a start, in context frames (0 = none)
    this.inAge = 0;
    this.queue = [];          // 'play's waiting for their context frame (a pattern's replay is scheduled ahead)
    this.sumsq = 0;           // block-accumulated for the rms report
    this.nsq = 0;
    this.reportEvery = 4;     // process() calls between position posts (~10.7 ms)
    this.sinceReport = 0;
    this.port.onmessage = (e) => this.onmsg(e.data);
  }

  recalcGrain() {
    this.grainDur = Math.max(8, Math.round(this.winsz * sampleRate));
    this.hop = Math.max(1, Math.round(this.grainDur / this.overlaps));
    // K overlapping windows sum to K × the window's mean (the Hann: K/2)
    this.scale = 1 / (this.overlaps * (this.win ? this.winMean : 0.5));
  }
  // the grain a read is made of (journal §220, icy): its length, how many at
  // once, how far each one's length may stray (rand, 0 … 1), and its WINDOW —
  // the name of one of his ten (the 'windows' message), or none for the Hann
  setGrain(m) {
    if (m.winsz != null) this.winsz = m.winsz;
    if (m.overlaps != null) this.overlaps = Math.max(2, Math.round(m.overlaps));
    if (m.jitter != null) this.jitter = m.jitter;
    if (m.rand != null) this.rand = Math.max(0, Math.min(1, m.rand));
    if (m.window !== undefined) {
      this.win = (m.window && this.windows && this.windows[m.window]) || null;
      if (this.win) { let s = 0; for (let i = 0; i < this.win.length; i++) s += this.win[i]; this.winMean = s / this.win.length; }
    }
    this.recalcGrain();
  }

  onmsg(m) {
    if (m.type === 'buffer') {
      this.chans = m.channels;
      this.bufSr = m.sampleRate;
      this.srRatio = this.bufSr / sampleRate;
      this.len = m.channels[0].length;
      this.loopB = this.len - 1;
      this.port.postMessage({ type: 'ready', frames: this.len });
    } else if (m.type === 'seek') {
      this.pos = Math.min(Math.max(m.t * this.bufSr, 0), this.len - 1);
      this.sinceSpawn = 1e9;
      // a seek in SILENCE takes the live taps along: left behind, they
      // read the old place for up to a window's length into the next
      // gate-on — a blip of the wrong material (journal §197)
      if (this.gateEnv < 1e-3) for (const g of this.grains) g.start = this.pos;
    } else if (m.type === 'loop') {
      this.loopOn = m.on;
      if (m.t0 != null) this.loopA = Math.max(0, m.t0 * this.bufSr);
      if (m.t1 != null) this.loopB = Math.min(this.len - 1, m.t1 * this.bufSr);
      if (this.loopB <= this.loopA) this.loopB = this.loopA + 1;
    } else if (m.type === 'grain') {
      this.setGrain(m);
    } else if (m.type === 'windows') {
      this.windows = m.tables;
    } else if (m.type === 'gate') {
      // a START asked for AT a context time (journal §260): it waits its
      // frame in the queue, as a 'play' does, and is then the same act
      if (m.on && m.at != null) {
        this.queue.push({ ...m, frame: Math.round(m.at * sampleRate) });
        this.queue.sort((x, y) => x.frame - y.frame);
      } else this.doGate(m);
    } else if (m.type === 'unqueue') {
      this.queue = this.queue.filter(q => q.type !== 'gate');   // a start that was asked for, taken back
    } else if (m.type === 'play') {
      // seek + stop mark + start as ONE act — now, or at a context time
      // (journal §204: a voice of the play-in; a replayed pattern)
      if (m.at == null) this.doPlay(m);
      else {
        this.queue.push({ ...m, frame: Math.round(m.at * sampleRate) });
        this.queue.sort((x, y) => x.frame - y.frame);
      }
    } else if (m.type === 'stopAt') {
      this.stopAt = m.t == null ? null
        : Math.min(Math.max(m.t * this.bufSr, 0), this.len - 1);
      this.fadeFrames = m.t == null ? 0
        : Math.max(0, Math.round((m.fade || 0) * sampleRate));
    }
  }

  doGate(m) {
    this.gateTarget = m.on ? 1 : 0;
    if (!m.on) this.queue.length = 0;
    if (m.on) {
      this.held = false;
      this.fadeGain = 1;
      // a START (Playhead.start): the run tempo comes WITH the gate, so
      // the first block does not wait on the parameter. From silence,
      // at tempo == pitch, every live tap is seated ON the phasor — the
      // run begins as the source itself, not as a smear of the resting
      // taps (they sit staggered ahead of a held phasor).
      // an optional fade-in over the first fadeIn seconds of the run (a
      // raised cosine), for a start that cuts into sound still ringing
      this.inFrames = Math.max(0, Math.round((m.fadeIn || 0) * sampleRate));
      this.inAge = 0;
      if (m.tempo != null) {
        this.startTempo = m.tempo;
        if (this.gateEnv < 1e-3 && Math.abs(m.tempo - this.lastPitch) < 0.03) {
          const ts = this.lastPitch * this.srRatio;
          for (const g of this.grains) g.start = this.pos - g.age * ts;
        }
      }
      // a start that waited its frame says when it began (to the block)
      if (m.at != null) this.port.postMessage({ type: 'started', id: null, gate: true, t: this.pos / this.bufSr,
                                                ctxTime: currentFrame / sampleRate });
    }
  }

  doPlay(m) {
    if (m.grain) this.setGrain(m.grain);            // the read's own grain, set as it begins
    this.pos = Math.min(Math.max(m.a * this.bufSr, 0), this.len - 1);
    this.sinceSpawn = 1e9;
    this.loopOn = false;
    this.stopAt = Math.min(Math.max(m.b * this.bufSr, 0), this.len - 1);
    this.fadeFrames = Math.max(0, Math.round((m.fade || 0) * sampleRate));
    this.fadeGain = 1;
    this.inFrames = Math.max(0, Math.round((m.fadeIn || 0) * sampleRate));
    this.inAge = 0;
    this.held = false;
    this.startTempo = m.tempo;
    this.playId = m.id;
    // from silence the taps come along (aligned on the phasor at tempo ==
    // pitch, as at any start). A voice taken while it still sounds keeps
    // its old taps: they die inside a window's length — a short crossfade,
    // not a cut.
    if (this.gateEnv < 1e-3) {
      const ts = Math.abs(m.tempo - this.lastPitch) < 0.03 ? this.lastPitch * this.srRatio : 0;
      for (const g of this.grains) g.start = this.pos - g.age * ts;
    }
    this.gateTarget = 1;
    this.port.postMessage({ type: 'started', id: m.id, ctxTime: currentFrame / sampleRate });
  }

  process(inputs, outputs, parameters) {
    const outL = outputs[0][0], outR = outputs[0][1] || outputs[0][0];
    const n = outL.length;
    if (!this.chans) return true;
    while (this.queue.length && currentFrame + n > this.queue[0].frame) { // to the block: under 3 ms
      const q = this.queue.shift();
      if (q.type === 'gate') this.doGate(q); else this.doPlay(q);
    }
    let tempo = parameters.tempo[0];
    if (this.startTempo !== null) {
      if (Math.abs(tempo - this.startTempo) < 1e-3) this.startTempo = null;  // the parameter has arrived
      else tempo = this.startTempo;
    }
    const pitch = parameters.pitch[0];
    this.lastPitch = pitch;
    const gain = parameters.gain[0];
    const makeup = parameters.makeup[0];
    const misalign = Math.min(1, Math.abs(tempo - pitch) / 0.03);
    // the makeup follows misalignment only while the gate is OPEN. At a
    // stop the tempo falls to 0 as the gate closes; unlatched, the makeup
    // stepped up +12 dB into the release — a spike at every stop from
    // tempo == pitch (measured +5.8 dB, the take's largest sample jumps;
    // journal §197)
    if (this.gateTarget === 1) this.mk = 1 + (makeup - 1) * misalign;
    const mk = this.mk;
    const chL = this.chans[0], chR = this.chans[1] || this.chans[0];
    const step = tempo * this.srRatio;        // phasor, buffer frames / ctx frame
    const tapStep = pitch * this.srRatio;     // tap read, buffer frames / ctx frame
    const gateK = 0.0021;                     // ~10 ms one-pole at 48 k
    const lenM1 = this.len - 1;

    for (let i = 0; i < n; i++) {
      // spawn
      if (++this.sinceSpawn >= this.hop) {
        this.sinceSpawn = 0;
        let start = this.pos;
        if (this.jitter > 0) start += (Math.random() * 2 - 1) * this.jitter * this.bufSr;
        const dur = this.rand > 0
          ? Math.max(8, Math.round(this.grainDur * (1 + (Math.random() * 2 - 1) * this.rand))) : this.grainDur;
        this.grains.push({ start, age: 0, dur, win: this.win });
      }
      // sum taps
      let l = 0, r = 0;
      for (let g = this.grains.length - 1; g >= 0; g--) {
        const gr = this.grains[g];
        if (gr.age >= gr.dur) {
          this.grains[g] = this.grains[this.grains.length - 1];
          this.grains.pop();
          continue;
        }
        const rp = gr.start + gr.age * tapStep;
        gr.age++;
        if (rp < 0 || rp >= lenM1) continue;
        const i0 = rp | 0, fr = rp - i0;
        const w = gr.win ? gr.win[(gr.age / gr.dur * (gr.win.length - 1)) | 0]
                         : 0.5 * (1 - Math.cos(6.283185307179586 * gr.age / gr.dur));
        l += (chL[i0] + fr * (chL[i0 + 1] - chL[i0])) * w;
        r += (chR[i0] + fr * (chR[i0 + 1] - chR[i0])) * w;
      }
      this.gateEnv += (this.gateTarget - this.gateEnv) * gateK;
      if (this.fadeFrames > 0 && this.stopAt !== null && !this.held && step !== 0) {
        const rem = (this.stopAt - this.pos) / step;     // context frames to the mark
        this.fadeGain = (rem >= 0 && rem < this.fadeFrames)
          ? 0.5 * (1 - Math.cos(Math.PI * rem / this.fadeFrames)) : 1;
      }
      let fin = 1;
      if (this.inAge < this.inFrames)
        fin = 0.5 * (1 - Math.cos(Math.PI * this.inAge++ / this.inFrames));
      const a = this.scale * gain * this.gateEnv * mk * this.fadeGain * fin;
      outL[i] = l * a;
      outR[i] = r * a;
      this.sumsq += outL[i] * outL[i] + outR[i] * outR[i];
      // advance phasor
      if (!this.held) {
        const prev = this.pos;
        this.pos += step;
        // a CROSSING, not a comparison: a seek past the mark never fires
        if (this.stopAt !== null &&
            ((step > 0 && prev < this.stopAt && this.pos >= this.stopAt) ||
             (step < 0 && prev > this.stopAt && this.pos <= this.stopAt))) {
          this.pos = this.stopAt;
          this.stopAt = null;
          this.held = true;
          this.gateTarget = 0;
          if (this.fadeFrames > 0) this.fadeGain = 0;   // faded out: stay out
          this.port.postMessage({ type: 'stopped', t: this.pos / this.bufSr,
                                  ctxTime: (currentFrame + i) / sampleRate, id: this.playId });
        }
      }
      if (this.loopOn) {
        const L = this.loopB - this.loopA;
        if (this.pos >= this.loopB) this.pos = this.loopA + ((this.pos - this.loopA) % L);
        else if (this.pos < this.loopA) this.pos = this.loopB - ((this.loopA - this.pos) % L);
      } else {
        if (this.pos > lenM1) this.pos = lenM1;
        else if (this.pos < 0) this.pos = 0;
      }
    }
    this.nsq += n * 2;

    if (++this.sinceReport >= this.reportEvery) {
      this.sinceReport = 0;
      this.port.postMessage({
        type: 'pos',
        t: this.pos / this.bufSr,
        grains: this.grains.length,
        rms: Math.sqrt(this.sumsq / Math.max(1, this.nsq)),
      });
      this.sumsq = 0; this.nsq = 0;
    }
    return true;
  }
}

registerProcessor('playhead-processor', PlayheadProcessor);
