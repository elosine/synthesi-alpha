// Shared score animation core — ONE source for the score page and the
// performance page. tools/score_valpha.py inlines this file's text into
// build/score-valpha.html at build time; engine/perform.html loads it as
// a script. The grain math is the calibrated paint() loop moved here
// verbatim; element lookup is scoped to `root` so several live copies of
// the strip (view-2 lenses) can animate independently, each on its own
// playhead clock.
//
// ScoreAnim(root, G, ENV, C) -> { paintAt(t) }
//   root: element containing the strip's #gI_J / #pl0 / #toneg nodes
//   G/ENV: the generator's grain and loudness arrays
//   C: {MID, TON0, TON1, PXS, X0} constants from the build
function ScoreAnim(root, G, ENV, C) {
  var byId, els, strokeEls, pl0, tg;
  var plE = 0, plMs = performance.now();
  var wasOn = G.map(function () { return false; });
  // (re)build the element maps from the root's current contents - the
  // performance page's lenses add/remove grain clones as the playhead
  // moves, and call rescan() after each membership change; smoothing
  // state (plume, wasOn) survives the rescan
  function rescan() {
    byId = {};
    var all = root.querySelectorAll('[id]');
    for (var q = 0; q < all.length; q++) byId[all[q].getAttribute('id')] = all[q];
    els = G.map(function (_, i) {
      return [0, 1, 2, 3].map(function (j) { return byId['g' + i + '_' + j] || null; });
    });
    // stroke-rendered grains (blades) get their shade animated on stroke
    strokeEls = els.map(function (row) {
      return row.map(function (el) {
        return !!(el && el.getAttribute('fill') === 'none');
      });
    });
    pl0 = byId['pl0'] || null;
    tg = byId['toneg'] || null;
  }
  rescan();

  function flight(dt, rise, settle) {
    if (dt <= 0) return 0;
    if (dt < rise) { var u = dt / rise; return u * (2 - u); }          // fast out
    var v = (dt - rise) / settle;
    return v >= 1 ? 0 : Math.pow(1 - v, 1.6);                          // gravity home
  }

  function paintAt(t) {
    for (var i = 0; i < G.length; i++) {
      // Lead the animation by each grain's own rise (plus a hair), so the
      // PEAK of the burst lands exactly as the cursor arrives. Triggering at
      // the true time put the whole rise behind the cursor and read as late.
      var g = G[i], dt = t - g[0] + g[3] + 0.05;
      var active = dt > 0 && dt < (g[3] + g[4] + g[5]);
      if (!active) {
        if (g[12]) {
          // the blades sway even at rest (J: "see what it looks like
          // if we wiggle the blades") - root-pivoted idle motion
          for (var j = 0; j < 4; j++) {
            var s = g[9][j], el = els[i][j];
            if (!el) continue;
            el.setAttribute('transform', 'translate(' + g[1] + ' ' + s[0]
              + ') rotate(' + (8 * Math.sin(6.283 * (t * s[3] * 0.35 + s[4])))
              .toFixed(1) + ')');
          }
          continue;
        }
        if (wasOn[i]) {
          for (var j = 0; j < 4; j++) {
            var s = g[9][j], el = els[i][j];
            if (!el) continue;
            el.setAttribute('transform', 'translate(' + g[1] + ' ' + s[0] + ')');
            if (g[10] === 2 && j > 0) el.setAttribute('opacity', '0');
            if (g[8] >= 0) {
              var rc = 'rgb(' + g[8] + ',' + g[8] + ',' + g[8] + ')';
              if (strokeEls[i][j]) el.setAttribute('stroke', rc);
              else el.setAttribute('fill', rc);
            }
          }
          wasOn[i] = false;
        }
        continue;
      }
      wasOn[i] = true;
      var o = flight(dt, g[3], g[4]);
      // the shape's recovery: swell + pallor relaxing over the tail
      var rel = Math.max(0, 1 - dt / g[5]) * g[6];
      var scale = 1 + rel * 1.1;
      var gr = g[8] > 100 ? Math.min(235, Math.round(g[8] + rel * 90)) : g[8];
      for (var j = 0; j < 4; j++) {
        var s = g[9][j], el = els[i][j];
        if (!el) continue;
        var oj = o;
        if (g[10] === 2 && j > 0) {
          // ripple rings, respec'd by J: "sync the ripples with those
          // echo repeats, so all of them pulse, and each repeat ...
          // they're tracked with the rocks themselves." Every ring in
          // the section pulses on one 0.28 s grid (anchor g[11] = the
          // section's measured onset); the two ring elements alternate
          // pulses (0.56 s life each); centre = the slab's position NOW.
          var since = t - g[0];
          if (since > -0.05 && since < 1.6) {
            var trj = ((t - g[11]) - 0.28 * (j - 1)) % 0.56;
            if (trj < 0) trj += 0.56;
            var ys = g[9][0][0] + g[2] * o * g[9][0][1];
            el.setAttribute('transform', 'translate(' + g[1] + ' '
              + ys.toFixed(1) + ')');
            el.setAttribute('rx', (8 + trj * 95).toFixed(1));
            el.setAttribute('ry', (4 + trj * 40).toFixed(1));
            el.setAttribute('opacity',
              (0.5 * Math.max(0, 1 - since / 1.6) * (1 - trj / 0.56)).toFixed(3));
          } else { el.setAttribute('opacity', '0'); }
          continue;
        }
        // the rock rises to its own fraction of the cloud, and boils inside it
        var boil = oj * s[5] * Math.sin(6.283 * (t * s[3] + s[4]));
        var y = s[0] + g[2] * oj * s[1] + boil;
        var xx = g[1] + s[2] * oj
          + oj * s[5] * 0.6 * Math.cos(6.283 * (t * s[3] * 0.8 + s[4]));
        var dsc = (1 + (g[7] - 1) * oj * 0.5) * scale, sx = dsc, sy = dsc, rot = 0;
        if (g[10] === 1) {
          // the suction: little height, strong forward pull, grains
          // stretched into horizontal streaks - wind through the cloud
          y = s[0] + g[2] * oj * s[1] * 0.75 + boil * 0.5;
          xx += oj * 38;
          sx = dsc * (1 + oj * 2.2); sy = dsc * (1 - oj * 0.4);
        }
        if (g[10] === 3) {
          // moderate suction (J: "like the sucking one, the original,
          // but maybe just a little bit slower ... more moderate
          // sucking"): the same forward wind at reduced strength
          y = s[0] + g[2] * oj * s[1] * 1.0 + boil * 0.7;
          xx += oj * 22;
          sx = dsc * (1 + oj * 1.3); sy = dsc * (1 - oj * 0.25);
        }
        if (g[10] === 5) {
          // reverse pull (J's lab choice for 50.37): the wind blows
          // against the timeline - grains drawn back into the passage
          y = s[0] + g[2] * oj * s[1] * 0.95 + boil * 0.5;
          xx -= oj * 30;
          sx = dsc * (1 + oj * 1.8); sy = dsc * (1 - oj * 0.35);
        }
        if (g[10] === 8) {
          // vortex (J's wind for the found tail window 171.91-173.96):
          // grains spiral inward as they are taken
          var Av = 6.283 * (t * 0.6 + s[4]);
          xx += oj * 24 + oj * 12 * Math.cos(Av);
          y = s[0] + g[2] * oj * s[1] * 0.9 + oj * 22 * Math.sin(Av);
          rot = (360 * oj * (t * 0.5 + s[4])) % 360;
          sx = dsc * (1 + oj * 1.2); sy = dsc * (1 - oj * 0.3);
        }
        if (g[10] === 7) {
          // pulsed gusts (J's lab choice for 82.42): the pull arrives
          // in waves - a stuttering wind
          var mg = 0.55 + 0.45 * Math.sin(6.283 * (t * 2.4 + s[4]));
          y = s[0] + g[2] * oj * s[1] * 0.95 + boil * 0.7;
          xx += oj * 26 * mg;
          sx = dsc * (1 + oj * 1.2 * mg); sy = dsc * (1 - oj * 0.25);
        }
        if (g[10] === 6) {
          // slow creep (J's lab choice for his ear window 66.497-68.31,
          // where alone "I only really hear the sucking")
          y = s[0] + g[2] * oj * s[1] * 1.1 + boil * 0.8;
          xx += oj * 10;
          sx = dsc * (1 + oj * 0.5); sy = dsc * (1 - oj * 0.12);
        }
        if (g[10] === 4) {
          // the leaf-blower (J: "particles swirl, like swirling leafs
          // blown up by leaf blower", 19.443 to the next marker): aloft,
          // each rock orbits its own eddy on its seeded frequency and
          // tumbles; the eddy widens as the gust peaks
          var swA = 6.283 * (t * s[3] + s[4]);
          xx += oj * s[5] * 7 * Math.cos(swA);
          y = s[0] + g[2] * oj * s[1] * 1.15 + oj * s[5] * 4.5 * Math.sin(swA);
          rot = (t * s[3] * 252 + s[4] * 360) % 360;
        }
        if (g[12]) {
          // the wiggle rides on top of the frozen displacement
          rot += 8 * Math.sin(6.283 * (t * s[3] * 0.35 + s[4]));
        }
        el.setAttribute('transform',
          'translate(' + xx.toFixed(1) + ' ' + y.toFixed(1) + ')'
          + (rot ? ' rotate(' + rot.toFixed(1) + ')' : '') + ' scale('
          + sx.toFixed(2) + ' ' + sy.toFixed(2) + ')');
        if (j === 0 && g[8] >= 0) {
          var pc = 'rgb(' + gr + ',' + gr + ',' + gr + ')';
          if (strokeEls[i][j]) el.setAttribute('stroke', pc);
          else el.setAttribute('fill', pc);
        }
      }
    }
    // the long tone's glow: on while it sounds, breathing slowly
    if (tg) {
      var e0t = Math.min(1, Math.max(0, (t - C.TON0) / 0.3))
        * Math.min(1, Math.max(0, (C.TON1 - t) / 0.5));
      tg.setAttribute('opacity', (e0t * (0.6 + 0.4 * Math.sin(6.283 * 1.1 * t)))
        .toFixed(3));
    }
    // the plume, tamed (J, journal §53-54): one ellipse, envelope smoothed
    // so the dust breathes instead of strobing - 50 ms rise, 350 ms
    // release, no opacity floor, modest peak
    if (pl0) {
      var e0 = ENV[Math.min(ENV.length - 1, Math.max(0, Math.round(t * 50)))] || 0;
      var nowMs = performance.now(), dtp = Math.min(0.5, (nowMs - plMs) / 1000);
      plMs = nowMs;
      plE += (e0 - plE) * (1 - Math.exp(-dtp / (e0 > plE ? 0.05 : 0.35)));
      var xc = C.X0 + t * C.PXS; // the plume sits on the sound
      pl0.setAttribute('cx', xc.toFixed(1));
      pl0.setAttribute('rx', (30 + 110 * plE).toFixed(0));
      pl0.setAttribute('ry', (24 + 170 * plE).toFixed(0));
      pl0.setAttribute('opacity', (0.25 * plE).toFixed(3));
    }
  }

  return { paintAt: paintAt, rescan: rescan };
}
if (typeof window !== 'undefined') window.ScoreAnim = ScoreAnim;
