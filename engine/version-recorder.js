// A version's sound, taken in the audio thread (docs/plan/v-alpha-standalone-
// plan.md S2; journal §260). Whatever reaches this node's input — the engine's
// output, after the limiter — is kept sample for sample, 32-bit float, the two
// channels interleaved, and handed to the page a second at a time.
//
// Every block says which context frame it begins on, so the page can count
// that nothing was lost between two of them.

class VersionRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.on = false;
    this.first = false;
    this.size = sampleRate;            // frames a block: one second
    this.buf = null;
    this.n = 0;                        // frames in the block so far
    this.at = 0;                       // the context frame the block begins on
    this.port.onmessage = e => {
      const m = e.data;
      if (m.type === 'start') {
        this.buf = new Float32Array(this.size * 2);
        this.n = 0; this.first = true; this.on = true;
      } else if (m.type === 'stop' && this.on) {
        this.on = false;
        if (this.n) {
          const data = this.buf.slice(0, this.n * 2);
          this.port.postMessage({ type: 'block', frame: this.at, frames: this.n, data: data.buffer }, [data.buffer]);
        }
        this.buf = null; this.n = 0;
        this.port.postMessage({ type: 'stopped', frame: currentFrame });
      }
    };
  }

  process(inputs) {
    if (!this.on) return true;
    // an input nothing is sounding into comes with no channels: that is silence, and it is time all the same
    const inp = inputs[0], L = inp && inp[0], R = inp && (inp[1] || inp[0]);
    const n = L ? L.length : 128;
    if (this.first) {
      this.first = false;
      this.port.postMessage({ type: 'started', frame: currentFrame, time: currentFrame / sampleRate, sampleRate });
    }
    for (let i = 0; i < n; i++) {
      if (this.n === 0) this.at = currentFrame + i;
      this.buf[2 * this.n] = L ? L[i] : 0;
      this.buf[2 * this.n + 1] = R ? R[i] : 0;
      if (++this.n === this.size) {
        this.port.postMessage({ type: 'block', frame: this.at, frames: this.n, data: this.buf.buffer }, [this.buf.buffer]);
        this.buf = new Float32Array(this.size * 2);
        this.n = 0;
      }
    }
    return true;
  }
}

registerProcessor('version-recorder', VersionRecorder);
