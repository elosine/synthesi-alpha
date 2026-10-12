// Shared envelope curves — the Roads set + Env.perc, equal-loudness
// levelled (journal §110). ONE source: attack-lab, assembly-lab and
// any future consumer load this file; no twin copies (§74's lesson).
(function () {
  const ENVFN = {
    perc:       null,   // needs duration — handled in envCurve
    gaussian:   t => Math.exp(-0.5 * ((t - 0.5) / 0.18) ** 2),
    quasigauss: t => t < 0.2 ? 0.5 * (1 - Math.cos(Math.PI * t / 0.2))
                  : t > 0.8 ? 0.5 * (1 - Math.cos(Math.PI * (1 - t) / 0.2)) : 1,
    hann:       t => 0.5 * (1 - Math.cos(2 * Math.PI * t)),
    triangle:   t => 1 - Math.abs(2 * t - 1),
    trapezoid:  t => Math.min(1, t / 0.15, (1 - t) / 0.15),
    expodec:    t => t < 0.02 ? t / 0.02 : Math.exp(-5 * (t - 0.02) / 0.98),
    rexpodec:   t => t > 0.98 ? (1 - t) / 0.02 : Math.exp(-5 * (0.98 - t) / 0.98),
    sinc:       t => { const x = (t - 0.5) * 6 * Math.PI;
                       return Math.abs(x) < 1e-6 ? 1 : Math.abs(Math.sin(x) / x); },
  };
  function envCurve(name, amp, durS) {
    const N = 256, a = new Float32Array(N);
    const perc = u => {                       // Env.perc: 10 ms in, exp -4 out
      const att = Math.min(0.2, 0.01 / Math.max(0.02, durS));
      if (u < att) return u / att;
      const v = (u - att) / (1 - att);
      return (Math.exp(-4 * v) - Math.exp(-4)) / (1 - Math.exp(-4));
    };
    const fn = name === 'perc' ? perc : (ENVFN[name] || perc);
    let sq = 0;
    for (let i = 0; i < N; i++) { const v = Math.max(0, fn(i / (N - 1))); a[i] = v; sq += v * v; }
    const scale = Math.min(amp * 0.612 / (Math.sqrt(sq / N) || 1), 2.2);
    for (let i = 0; i < N; i++) a[i] *= scale;
    a[0] = 0; a[N - 1] = 0;
    return a;
  }
  window.EnvCurves = {
    ENVFN, envCurve,
    NAMES: ['perc', 'gaussian', 'quasigauss', 'hann', 'triangle',
            'trapezoid', 'expodec', 'rexpodec', 'sinc'],
  };
})();
