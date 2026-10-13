# Sýnthesi Alpha

*Σύνθεση Άλφα* — a piece for a player and fixed electronics, with an
animated score. Ten minutes.

One recording, read many ways. On stage the player presses play and
plays along with the electronics; nothing listens back.

This repo is the whole piece: what it is made from, the workshop that
makes a version of it, and the versions that are kept.

## To play it

The player plays a kept version — its sound and the animated score
together.

```
python tools/serve.py
```

Then open http://localhost:8733/player/

- Click a version on the shelf.
- [begin — sound and picture]. The sound loads whole — a second or two.
- ENTER plays it from the top. ESCAPE stops. (On a tablet: [GO]; press and hold two
  seconds to stop.)
- After ENTER nothing is fetched from anywhere.
- To go back to the shelf, reload the page.
- The picture keeps its 1920 × 1080 shape in any window (F11 for the full screen).

**On more than one machine** — one has the sound, the others the picture only, and
ENTER or ESCAPE on any of them begins or stops them all: [`docs/STAGE.md`](docs/STAGE.md),
the set-ups and what to bring.
- A version just made and not yet kept (a candidate, in
  `build/versions/`) is heard the same way:
  http://localhost:8733/player/?candidate=seed-N

Needs Python 3 and a current browser.

To hear it without the picture: `versions/seed-1b/master.flac` plays
in any audio player. It is the kept version — the final draft.

## To run the workshop

The workshop plays the piece live, as it was composed.

```
python tools/serve.py
```

Then open http://localhost:8733/engine/perform.html — [begin], then
ENTER. ESCAPE stops it.

Needs Python 3 and a current browser.

## To master a version

A version's MASTER is the same take made safe for a hall: nothing over
−1 dB. The player plays it when there is one.

```
python tools/master.py --candidates versions/seed-1b
```

makes a few candidates into `build/masters/seed-1b/`. Then listen to
them side by side: http://localhost:8733/engine/master.html?v=seed-1b

```
python tools/master.py --keep NAME versions/seed-1b
```

keeps the one named as `versions/seed-1b/master.flac`.

- The version's own sound is never written over.
- `python tools/master.py --selftest` checks the tool.
- Needs `numpy`, `soundfile` and `ffmpeg`.

## To make a version

```
python tools/serve.py
```

Then open http://localhost:8733/engine/perform.html?make&seed=7 — the
seed you want in the address — [begin], then ENTER. Leave it eleven
minutes; the tab may sit in the background.

That one step makes the seed's samples (the first time: a minute),
plays the piece and records it, checks it, and masters it.

- The version lands in `build/versions/seed-N/` — a **candidate**. Git
  does not keep `build/`.
- Hear it, with its picture: http://localhost:8733/player/?candidate=seed-N
- The page says so if a take is SPOILED (sounds that began late). Such
  a take is not kept.
- A version you keep goes onto the shelf:
  `python tools/shelve.py seed-N --what "…" --verdict "…"`, then commit.
  Only kept versions go into git.
- A version already made is never written over.
- Without `&seed=`, the seed is the scenario file's own: 1.
- Needs also `numpy`, `soundfile` and `ffmpeg`.

## What is here

| | |
|---|---|
| `versions/` | the shelf — the kept versions. Each a folder: the sound, the record of what the picture did, the seed and scenario that made it |
| `player/` | the player — plays a kept version: its sound file, and the picture drawn from its record. No engine inside |
| `engine/` · `tools/` | the workshop — the program that plays the piece, makes a version, and masters it |
| `voices/v-alpha/` | what the piece is made from — the recording, its map, the scenario, the nineteen played sequences, the pre-processed samples |
| `picture/` | the drawn score |
| `docs/STAGE.md` | on stage: the set-ups, the kit, how the machines are kept together |
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

## Rights

- **The program** — `engine/`, `tools/`, `player/` — is free to use
  under the MIT licence: [`LICENSE`](LICENSE).
- **The piece** — the recording, the versions, the drawn score, the
  record — is © 2026 elosine, all rights reserved:
  [`LICENSE-PIECE.md`](LICENSE-PIECE.md).

Orientation for an AI session: `CLAUDE.md`, then
`docs/PROJECT_JOURNAL.md` §2.
