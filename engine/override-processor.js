// Override — the buffer override, as a small unit of its own on the cursors'
// bus (first-scenario plan P2f, workshop 5; journal §222).
//
// After Destroy FX's Buffer Override (Sophia Poirier), by way of J's own clone
// of it in *Approaching* (live-electronics-system sc/process.scd, DEC-17) —
// written from how it works: the sound is cut into FORCED buffers; of each,
// only the FIRST mini-buffer is kept and repeated until the next forced buffer
// begins. A stutter — and a PITCH, a fuzz, when the mini-buffer is short: a
// repeat every 1/f s sounds at f.
//
// What the clone did not have, and what he wanted from it ("if I was using
// the plugin, I would have used some kind of automation"): the repeat's RATE
// MOVING ON A CURVE. Here the rate is the thing that is set — repeats a
// second, steady or moving:
//   rate: f                                  steady
//   rate: [f0, f1], over: T                  f0 → f1 over T seconds, and begin again ("accel")
//   …, pattern: "shift", hold: H, stay: S    f0 for H s, over T s to f1, f1 for S s, and begin again
//   …, pattern: "wave", stay: S, hold: H     UP over T s, eased like a sine · S s at the top · DOWN over T s ·
//                                            H s at the bottom · and again (J, §228: "a wave that goes up and
//                                            holds at top for a little while, then down and holds at bottom")
// A rate that rises is taken up at once, pass by pass; one that falls back
// waits for the next forced buffer (the longer mini-buffer is not yet written).
//
// The forced buffer may MOVE too (J, §227: "automation of both parameters"):
//   buf: [b0, b1]    its size from b0 to b1 along the same shape, in step with
//                    the rate — each forced buffer takes the size of its moment
// On the plugin's pad that is a line from (divisor, size) to (divisor, size);
// rate = divisor ÷ size at both ends, and both move by equal ratios in equal
// times, so the rate between them is the same curve it always was.
//
// Messages: { type: 'on', at, buf, rate, over, pattern, hold, stay, smooth, mix, gain } · { type: 'off', at }
// — `at` a context time. Off, the sound passes as it is. { type: 'set', … } changes the numbers of the
// shape that is running WITHOUT beginning it again (a dial turned in the override lab). While a shape
// runs the unit reports { type: 'now', rate, buf, t } about twenty times a second.

class OverrideProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.N = Math.ceil(sampleRate * 5);       // the input, written round and round
    this.ring = [new Float32Array(this.N), new Float32Array(this.N)];
    this.w = 0;
    this.cur = null;                           // the shape that is running
    this.queue = [];                           // switches waiting for their time
    this.wet = 0;                              // 0 = the sound as it is · 1 = the override (moves in 20 ms)
    this.gain = 1;
    this.left = 0;                             // frames left of the forced buffer
    this.start = 0; this.ph = 0; this.period = 8; this.fade = 1; this.first = true;
    this.port.onmessage = e => { this.queue.push(e.data); this.queue.sort((a, b) => a.at - b.at); };
  }

  // how far along its shape the unit is, 0 … 1, t seconds after it began
  along(t) {
    const c = this.cur, T = c.over || 8;
    if (c.pattern === 'shift') {
      const H = c.hold ?? 5, u = t % (H + T + (c.stay ?? 4));
      return u < H ? 0 : u < H + T ? (u - H) / T : 1;
    }
    if (c.pattern === 'wave') {
      const S = c.stay ?? 2, H = c.hold ?? 2, u = t % (2 * T + S + H), ease = x => (1 - Math.cos(Math.PI * x)) / 2;
      return u < T ? ease(u / T) : u < T + S ? 1 : u < 2 * T + S ? ease(1 - (u - T - S) / T) : 0;
    }
    return (t % T) / T;
  }
  // repeats a second, and the forced buffer's size (s), at that moment
  rate(t) {
    const r = this.cur.rate;
    return Array.isArray(r) ? r[0] * (r[1] / r[0]) ** this.along(t) : r;
  }
  buf(t) {
    const b = this.cur.buf ?? 0.25;
    return Array.isArray(b) ? b[0] * (b[1] / b[0]) ** this.along(t) : b;
  }

  // the pass that is beginning: a repeat every 1/rate s EXACTLY (the clone
  // took the join's fade off the repeat, so its "120" sounded at 133 —
  // measured on the first takes, journal §222); the mini-buffer is that
  // period plus the fade that joins it to the next
  setPeriod(atStart, bufFrames) {
    const t = (currentFrame - this.cur.t0) / sampleRate;
    const sm = Math.min(0.5, Math.max(0, this.cur.smooth ?? 0.1));
    const period = Math.max(8, Math.min(bufFrames, Math.round(sampleRate / Math.max(0.5, this.rate(t)))));
    const fade = Math.max(1, Math.min(period, Math.round(period * sm / (1 - sm))));
    if (atStart || period < this.period) { this.period = period; this.fade = fade; }
  }

  process(inputs, outputs) {
    const inp = inputs[0], out = outputs[0], n = out[0].length;
    const iL = inp[0], iR = inp[1] || inp[0], oL = out[0], oR = out[1] || out[0];
    while (this.queue.length && this.queue[0].at <= currentTime + n / sampleRate) {
      const m = this.queue.shift();
      if (m.type === 'set') { if (this.cur) { this.cur = { ...this.cur, ...m, type: 'on', t0: this.cur.t0 }; this.gain = m.gain ?? this.gain; } continue; }
      this.cur = m.type === 'on' ? { ...m, t0: currentFrame } : null;
      if (this.cur) { this.left = 0; this.gain = m.gain ?? 1; }
    }
    if (this.cur && (this.told = (this.told || 0) + n) >= sampleRate / 20) {
      this.told = 0;
      const t = (currentFrame - this.cur.t0) / sampleRate;
      this.port.postMessage({ type: 'now', rate: this.rate(t), buf: this.buf(t), t });
    }
    const target = this.cur ? (this.cur.mix ?? 1) : 0, k = 1 - Math.exp(-1 / (0.02 * sampleRate));
    const L = this.ring[0], R = this.ring[1], N = this.N;
    for (let i = 0; i < n; i++) {
      const xl = iL ? iL[i] : 0, xr = iR ? iR[i] : 0;
      L[this.w] = xl; R[this.w] = xr;
      let yl = 0, yr = 0;
      if (this.cur) {
        if (this.left <= 0) {                    // a forced buffer begins: the mini-buffer is cut from HERE
          const bufFrames = Math.max(64, Math.min(this.N - 4096,
            Math.round(this.buf((currentFrame - this.cur.t0) / sampleRate) * sampleRate)));
          this.left = bufFrames; this.start = this.w; this.ph = 0; this.first = true;
          this.setPeriod(true, bufFrames);
        }
        // the mini-buffer's head — on the first pass it is the sound itself,
        // as it is being written; after that its tail fades out under it
        const a = (this.start + this.ph) % N;
        if (this.first || this.ph >= this.fade) { yl = L[a]; yr = R[a]; }
        else {
          const g = this.ph / this.fade, gA = Math.sqrt(g), gB = Math.sqrt(1 - g), b = (a + this.period) % N;
          yl = L[a] * gA + L[b] * gB; yr = R[a] * gA + R[b] * gB;
        }
        if (++this.ph >= this.period) { this.ph = 0; this.first = false; this.setPeriod(false, this.left); }
        this.left--;
      }
      this.wet += (target - this.wet) * k;
      oL[i] = xl + (yl * this.gain - xl) * this.wet;
      oR[i] = xr + (yr * this.gain - xr) * this.wet;
      this.w = (this.w + 1) % N;
    }
    return true;
  }
}
registerProcessor('override-processor', OverrideProcessor);
