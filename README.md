# Sýnthesi Alpha

*Σύνθεση Άλφα* — a piece for a player and fixed electronics, with an
animated score. Ten minutes.

One recording, read many ways. On stage the player presses play and
plays along with the electronics; nothing listens back.

This repo is the whole piece: what it is made from, the workshop that
makes a version of it, and the versions that are kept.

## To hear it

- `versions/seed-1/sound.flac` plays in any audio player. It is
  version 1 — the final draft.
- **The player — the sound and the animated score together — is not
  built yet** (`docs/PLAN.md`, build chunk B3).

## To run the workshop

The workshop plays the piece live, as it was composed.

```
python tools/serve.py
```

Then open http://localhost:8733/engine/perform.html — [begin], then
ENTER. ESCAPE stops it.

Needs Python 3 and a current browser.

## To make a version

```
python tools/serve.py
```

Then open http://localhost:8733/engine/perform.html?make — [begin],
then ENTER. Leave it ten minutes; the tab may sit in the background.

- The version lands in `build/versions/seed-N/` — a **candidate**. Git
  does not keep `build/`.
- A version you keep is copied to `versions/` — the shelf — and
  committed. Only kept versions go into git.
- A version already made is never written over.
- Needs also `numpy` and `ffmpeg`.
- **Today the seed is the one in the scenario file — seed 1.** A new
  seed in one step is not built yet (`docs/PLAN.md`, B5).

## What is here

| | |
|---|---|
| `versions/` | the shelf — the kept versions. Each a folder: the sound, the record of what the picture did, the seed and scenario that made it |
| `engine/` · `tools/` | the workshop — the program that plays the piece and makes a version |
| `voices/v-alpha/` | what the piece is made from — the recording, its map, the scenario, the nineteen played sequences, the pre-processed samples |
| `picture/` | the drawn score |
| `docs/PLAN.md` | the plan of the standalone piece, and where the build stands |
| `docs/PROJECT_JOURNAL.md` | §2 Resume Here — the state, for a cold start |
| `docs/RUNNING_LOG.md` | the lab journal of this repo |
| `docs/history/` | the record of how the piece was made — a frozen copy |

## The names

- **Sýnthesi Alpha** is the piece. *Sýnthesi* — σύνθεση — is Greek for
  a composition, and for synthesis.
- **v-alpha** is the voice it is made from: the first of the voices of
  `live-electronics-engine`, which are named with the Greek alphabet.

## Where it came from

Made in [`live-electronics-engine`](https://github.com/elosine/live-electronics-engine),
2026-08-27 to 2026-10-12. That repo keeps everything that made it —
the labs, the play-in, the other voices, the full journal. This one is
a copy of what the piece needs, taken at its commit `3d75010`,
and is the piece's own from there on.

Orientation for an AI session: `CLAUDE.md`, then
`docs/PROJECT_JOURNAL.md` §2.
