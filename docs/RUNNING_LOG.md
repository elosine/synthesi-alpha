# RUNNING LOG — the lab journal of Sýnthesi Alpha's own repo

> **Why this exists** (the composer, 2026-09-02, in the engine where the piece was made):
> *"I want to some time in the future be able to recreate the order we did things, what
> questions we ask, what things we tried and rejected and what things were successful and
> why, and have media too."*
>
> Rules (carried from `live-electronics-engine`): written **as the work happens**, at the
> end of any exchange that produced a decision, a result, a rejection, a measurement, or a
> point of theory — never at session end. Each entry: what prompted it, in the composer's
> words, quoted; what was tried, in order; the numbers; what was rejected and why; what
> was decided and why that rather than the alternative. **Append-only; a correction is a
> new entry.** Entries are numbered §N and never renumbered.
> Current state lives in `PROJECT_JOURNAL.md` §2 and `PLAN.md`; this is the trail.
>
> **A `§N` in this file is THIS repo's.** The journal of the engine, where the piece was
> composed, is cited as "engine journal §N" — a frozen copy of it, §1 … §261, is in
> `docs/history/journal/`.

---

# 2026-10-12 — session 1 (made from a session in the sandbox, `live-electronics-engine`)

## §1. The repo opens

There was no first message in this repo: it was made from the engine's session. These are
the composer's words that brought it about, in the order he said them (all 2026-10-12).

The goal (engine journal §248):

"I have this live electronics engine But if I wanted to make just this piece, V-Alpha, its
own repo, what we put in there, what would we clone over there? ... with the goal being I
have a standalone performance version that's flexible to tech different tech I have a repo
that's focused on just this piece and is able to generate different versions"

What the repo is for (§255):

"I won't remember where everything is. So let's say I play this once and then in two years
time I play it again. I don't want to have, I won't have remembered that the generator is
in this other repo, for example. So we'll just need some things to connect everything."

Its name (§257, §259): "lets use sýnthesi" · "synthesi-alpha is good, S6 is good, next"

Public or private (§258): "public"

The kit (§261): "a is good, go and build" — a being the LEAN kit.

**What was understood.** One repo holds the whole piece — what it is made from, the
workshop that makes a version of it, the versions that are kept — so that in two years
nothing has to be remembered. The sandbox keeps everything it has; this is a copy of what
the piece needs, and from today the piece's own.

**What was decided before the repo existed** — six steps, each his decision, agreed one at
a time in the engine (journal §248 … §259) and written into `docs/PLAN.md`:

| step | decided |
|---|---|
| S1 What is live | nothing — "I'll press play on stage and play along with the electronics" |
| S2 What a version is | one finished recording, made by the engine from a seed |
| S3 What plays it | a web page; a video as fallback; SuperCollider not used |
| S4 The stage set-ups | one sound machine, always; every screen keeps to its sound; the network gone, nothing stops |
| S5 The versions | a few, each heard by him; lossless; only the kept ones in git |
| S6 The piece's own repo | `synthesi-alpha`, public; one repo holds all, the workshop too |

**What was done** (the plan's build chunk B2; from the engine at commit `3d75010`).

| | |
|---|---|
| the recording | packed lossless: 34.97 MB WAV → 7.17 MB FLAC; 8,742,272 frames, every sample compared and the same |
| its map and the scenario | section-index · replay-index · seam-levels · scenario-1.json |
| his played sequences | 19 |
| the pre-processed samples | 25 files — 20 sounds, 5 manifests (pages 8 … 12) |
| the picture | the drawn score as built: score-strip.svg · score-data.js → `picture/` |
| the workshop | twelve files of `engine/`; the two sample tools; a server written again, short (port 8733) |
| the shelf | version 1 → `versions/seed-1/` |
| the record | the engine's journal §1 … §261 with its clips, the plan the piece was built by, the what-the-piece-is page → `docs/history/`, frozen |

*Three paths were re-pointed in the copied page* — the recording (now a `.flac`), the two
picture files — and the labs' three doors (the sampler, the play-in, the sandbox) were
taken out; they stay in the engine. Nothing else in the playing parts was touched.

**The copy was tried, not only made.** This repo's own server, its own page, the recording
decoded from the FLAC (182.1307 s, 2 channels): a short version made here — page 12, the
stand cut to 4 s — against the same pass in the engine (engine journal §260):

| | the engine | here |
|---|---|---|
| sounds called | 54 | 54 |
| rolled · held | 27.341 · 27.338 s | 27.341 · 27.338 s |
| worst start · stop | 2.646 · 0.354 ms | 2.646 · 0.354 ms |
| blocks lost | 0 | 0 |

The workshop here plays what the engine plays. The test's folder was removed.

**Version 1** — on the shelf — is seed 1, the final draft, made in the engine the same day
(engine journal §260): 34.98 MB, 10 min 05.8 s; the last sound at 10 min 00.5 s; the
twelve page stops 0.000 ms off their section ends; no block lost. **Nobody had heard it
when it was shelved**, and its picture's record had never been replayed. It is on the
shelf as the final draft's recording, not yet as a version he has kept by ear — the one
exception to "only what he has heard goes on the shelf", made so that the lossless file
is in git and not on one machine.

**Where this start left the protocol:** `docs/PROTOCOL_DEVIATIONS.md` — thirteen lines.
The first says it all: the new-piece protocol is for the START of a piece; this is a
piece's extraction at its END.

**Decided by the AI, told to him:** the folders keep the engine's names so the workshop
runs as copied · no licence in the repo until he says which covers a public recording ·
`PROJECT_JOURNAL.md` kept, three sections, because his session skills read its §2 · the
score-drawing tool NOT copied (it is rooted in the engine's corpus and its `build/`
folder; the picture travels as the finished drawing).

**Not done, not claimed.** Not pushed; no remote; no GitHub repo exists · tried on this
machine only — the fresh-clone test on another is B6 · nothing of the player (B3) ·
`composition-system`'s INDEX has no line for the piece.

**Where the build stands:** B1 ☑ make a version · B2 ☑ this repo · **► B3 the player.**

---
