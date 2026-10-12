// A VERSION's sound, from the page to the repo server (docs/plan/v-alpha-
// standalone-plan.md S2; journal §260).
//
// "A version of v-alpha is a folder you can hold — one finished sound file,
// the record of what the picture did, and the seed that made it." This is the
// sound file's half: the engine's output AS HEARD (after the limiter, before
// the page's own mute and mono switch) is taken in the audio thread
// (version-recorder.js), a second at a time, and posted to the server in
// order. The server keeps it and, at the end, packs it lossless
// (tools/serve.py, /version-…).
//
// Nothing here compresses or resamples. The context frame each block begins
// on is checked against the one before: `gaps` counts what was lost (it must
// be 0).

export async function makeRecorder(engine, ctx) {
  await ctx.audioWorklet.addModule('./version-recorder.js');
  const node = new AudioWorkletNode(ctx, 'version-recorder', {
    numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2],
    channelCount: 2, channelCountMode: 'explicit', channelInterpretation: 'speakers',
  });
  // the node gives no sound; it is tied to the output, silent, so that it is always run
  const sink = ctx.createGain();
  sink.gain.value = 0;
  engine.limiter.connect(node);
  node.connect(sink);
  sink.connect(ctx.destination);

  let name = null, i = 0, frames = 0, gaps = 0, next = null, failed = null;
  let chain = Promise.resolve(), onStarted = null, onStopped = null;
  node.port.onmessage = e => {
    const m = e.data;
    if (m.type === 'started') { next = m.frame; if (onStarted) onStarted(m); }
    else if (m.type === 'block') {
      if (m.frame !== next) gaps++;
      next = m.frame + m.frames;
      frames += m.frames;
      const k = i++, body = m.data;
      chain = chain.then(() => fetch(`/version-chunk?name=${name}&i=${k}`, { method: 'POST', body }))
        .then(r => { if (r && !r.ok) throw new Error(`the server refused block ${k}: ${r.status}`); })
        .catch(err => { failed = failed || err; });
    } else if (m.type === 'stopped') { if (onStopped) onStopped(m); }
  };

  return {
    // begin: the folder is opened on the server (it refuses one that already holds a version,
    // unless `over`), then the recorder is started. → { frame, time, sampleRate } of the first sample
    async start(n, over = false) {
      name = n; i = 0; frames = 0; gaps = 0; failed = null; chain = Promise.resolve();
      const r = await fetch(`/version-begin?name=${name}${over ? '&over=1' : ''}`, { method: 'POST' });
      if (!r.ok) throw new Error(r.status === 409 ? `the version "${name}" is already made — it is not written over`
                                                  : `version-begin: ${r.status}`);
      return new Promise(res => { onStarted = m => { onStarted = null; res(m); }; node.port.postMessage({ type: 'start' }); });
    },
    // end: the last block out, everything posted. → what was taken
    async stop() {
      await new Promise(res => { onStopped = m => { onStopped = null; res(m); }; node.port.postMessage({ type: 'stop' }); });
      await chain;
      if (failed) throw failed;
      return { frames, gaps, chunks: i, sampleRate: ctx.sampleRate };
    },
    async abort() {
      await new Promise(res => { onStopped = () => { onStopped = null; res(); }; node.port.postMessage({ type: 'stop' }); setTimeout(res, 1500); });
      await chain;
      await fetch(`/version-abort?name=${name}`, { method: 'POST' }).catch(() => {});
    },
    get name() { return name; },
  };
}
