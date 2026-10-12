# The shelf — the kept versions

A version is the piece played once from START and kept. Each is a
folder named by the seed that made it.

| version | made | length | what it is |
|---|---|---|---|
| `seed-1` | 2026-10-12 | 10 min 05.8 s (the last sound at 10 min 00.5 s) | the final draft |

**The recording is the version. The seed is its label** — not a
promise that it can be made again sample for sample (the hall of the
reverb is drawn fresh each time, and on pages 4 and 5 the small stray
in each grain's length).

Only a version the composer has heard and kept is put here. Candidates
are made into `build/versions/`, which git does not keep.

## What a version folder holds

| file | what |
|---|---|
| `sound.flac` | the piece — 48 kHz, 16-bit, stereo, packed lossless. The engine's output as heard, after the limiter |
| `picture.json` | the record of what the picture did (below) |
| `version.json` | the seed · the length · the levels · the check against the roll · the commit of the workshop that made it |
| `scenario.json` | the scenario file as it stood |

## `picture.json` — what a player draws from

Not pixels: what the page draws FROM. Every time in it is in seconds
of the sound file (0 = its first sample).

- `start` — when START was (the piece's own clock begins here).
- `curlag` — the picture of electronics main runs this far behind its
  sound (0.2 s; the composer's calibration).
- `pxPerSecond`, `screen`, `duration` — the score's scale, the screen
  the form was cut to (1920 × 1080), the length of the score.
- `main` — electronics main, a line a run: at `c0` it leaves score time
  `p0`; it moves at the sound's own speed; at `c1` it is on `p1`, and
  stays there until the next run. Before the first run it rests on the
  first `p0`.
- `sounds` — every sound that was called, in order of `when`:
  - `kind` — `attack` or `phrase` (a phrase may be a whole container)
  - `when`, `end` — when it began and ended
  - `at`, `dur` — an attack's place in the score and its length
  - `t0`, `t1` — a phrase's stretch of the score
  - `variant` — `reverse`: its cursor travels from `t1` back to `t0`
  - `frac` — none: the cursor crosses the stretch evenly in time.
    Otherwise 33 numbers: how far through the stretch the read is at
    each 32nd of its time (a read whose speed changes)
  - `hue` — its colour
  - `page`, `pattern`, `id` — where it belongs, for a reader; a player
    does not need them
