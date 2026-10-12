// Reading a version's picture record — versions/README.md, "picture.json".
// Pure: no page, no sound. Every time is in seconds of the sound file.
//
// The workshop draws the picture from the live engine (engine/perform.html
// paintV1 · engine/scenario.js paintPic). These say the same things from the
// record, so that the player (player.js) draws them with the same lines.

export const SETTLE = 2.0;        // s a lens outlives a forward read, for its marks to come to rest
export const SETTLE_BACK = 0.4;   // … and a reversed one, which ends where every mark is at rest

// Is this a record this page can draw? A sentence saying why not, or null.
export function checkPicture(pic, SD) {
  if (!pic || pic.kind !== 'picture' || pic.schema !== 1) return 'not a picture record this player knows (schema 1)';
  if (Math.abs(pic.pxPerSecond - SD.PXS) > 1e-9 || Math.abs(pic.duration - SD.DUR) > 1e-3)
    return 'this version was made with another score than the one in picture/';
  if (!Array.isArray(pic.main) || !Array.isArray(pic.sounds)) return 'the picture record is not whole';
  return null;
}

// Electronics main: the score time it is sounding at file time tau. A line a
// run — at c0 it leaves p0, moves at the sound's own speed, at c1 is on p1 and
// stays. Before the first run it rests on the first p0.
export function mainAt(pic, tau) {
  const M = pic.main;
  if (!M.length) return 0;
  let p = M[0].p0;
  for (const r of M) {
    if (tau < r.c0) break;
    p = tau >= r.c1 ? r.p1 : Math.min(r.p1, r.p0 + (tau - r.c0));
  }
  return p;
}

// How far through its stretch a read is at u of its time: evenly, or by the
// record's 33 points (a read whose speed changes), straight between them.
export function fracAt(frac, u) {
  if (!frac) return u;
  const n = frac.length - 1, k = Math.min(n, Math.max(0, u * n)), i = Math.min(n - 1, Math.floor(k));
  return frac[i] + (frac[i + 1] - frac[i]) * (k - i);
}

// A sound of the record at file time tau: null while it is not in the
// picture, else what is drawn of it —
//   a … b   the stretch of the score its lens lifts
//   t       the time that stretch's notation shows
//   attack: u — its burst, 0 … 1, gone at 1
//   phrase: T — where its cursor is · tail — 1, fading to 0 once it has ended
export function soundAt(sd, tau) {
  const back = sd.variant === 'reverse';
  if (tau < sd.when || tau > sd.end + (back ? SETTLE_BACK : SETTLE)) return null;
  const e = tau - sd.when, d = sd.end - sd.when;
  if (sd.kind === 'attack') {
    return { kind: 'attack', a: sd.at - 0.05, b: sd.at + sd.dur + 0.3, t: sd.at + e,
             at: sd.at, u: Math.min(1, e / (sd.dur + 0.15)) };
  }
  // a slowed read moves the notation as slowly as it moves the cursor; past
  // its end the marks run on at their own speed, to rest
  const span = sd.t1 - sd.t0, u = fracAt(sd.frac, Math.min(1, Math.max(0, e / d)));
  return { kind: 'phrase', a: sd.t0, b: sd.t1,
           t: back ? sd.t1 - u * span : e <= d ? sd.t0 + u * span : sd.t1 + (e - d),
           T: back ? sd.t1 - u * span : sd.t0 + u * span,
           tail: tau > sd.end ? Math.max(0, 1 - (tau - sd.end) / 0.4) : 1 };
}
