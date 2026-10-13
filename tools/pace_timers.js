// MAKING A VERSION IN A HIDDEN PAGE (log 13): run this in the make page BEFORE [begin].
// The page's timers are paced from a worker's, which the browser does not hold back.
(() => {
  const w = new Worker(URL.createObjectURL(new Blob(['setInterval(() => postMessage(0), 10)'], { type: 'text/javascript' })));
  let id = 1e6; const T = new Map();
  window.setTimeout = (fn, ms = 0, ...a) => { const k = id++; T.set(k, { fn: () => fn(...a), at: performance.now() + (+ms || 0), every: 0 }); return k; };
  window.setInterval = (fn, ms = 0, ...a) => { const k = id++; T.set(k, { fn: () => fn(...a), at: performance.now() + (+ms || 0), every: Math.max(1, +ms || 0) }); return k; };
  window.clearTimeout = window.clearInterval = k => { T.delete(k); };
  w.onmessage = () => { const now = performance.now(); for (const [k, t] of [...T]) { if (t.at <= now && T.has(k)) { if (t.every) t.at = now + t.every; else T.delete(k); try { t.fn(); } catch (e) { console.error(e); } } } };
})();
// then: [begin] · rig.engine.out.gain.value = 0 (his speakers; the recorder is before it) ·
// rig.scenario.makeVersion({ name: 'seed-N' })
