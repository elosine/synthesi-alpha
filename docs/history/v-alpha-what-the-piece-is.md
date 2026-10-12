# v-alpha — what the piece is

*The state of things on 2026-10-12, at the final draft (git tag
`v-alpha-final-draft`; journal §246, §247). A reference page: it is
rewritten whenever the piece changes. Kept at J's word — "let's just
keep a, a document of some sort".*

Four things are written down here:

1. the parts the piece is made of
2. the state of the audio — what is a file, what is made live
3. what the seed decides, and what it does not
4. how a re-roll is done today

---

## 1. The parts

| part | what it is | where | in git? |
|---|---|---|---|
| **The recording** | ONE audio file, 3 min 02 s | `voices/v-alpha/layers/v-alpha-05_gran_dense_bcl_s6.wav` (35 MB) | **no** — only an mp3 copy of it is |
| **The score picture** | the drawn score, and the data that animates it | `build/assets/score-strip.svg` (4.3 MB) · `score-data.js` (1.3 MB) | **no** — made by `tools/score_valpha.py` |
| The map of the recording | 51 containers · 67 phrases · 69 attacks, each with its times | `voices/v-alpha/score/replay-index.json` | yes |
| The scenario | the form, the twelve pages, every effect's settings, the seed | `voices/v-alpha/scenario/scenario-1.json` | yes |
| The played sequences | 19 — J's rhythms as DATA (which key, when). No sound in them. | `voices/v-alpha/library/patterns/pt1 … pt19.json` | yes |
| The pre-processed samples | 20 audio files, for pages 8 … 12 | `voices/v-alpha/renders/page-8 … page-12/` (7.8 MB) | yes |
| The grain windows | ten shapes for the icy grains | `engine/grain-windows.json` | yes |
| The engine | the program that plays it, in a browser | `engine/` | yes |

**So the tag is not the whole piece.** A fresh copy of the repository
at `v-alpha-final-draft` has no recording and no picture. The recording
has to be carried alongside. The picture can be built again from its
tool only ON THIS MACHINE: the tool reads working files in `build/`
that git does not keep (corrected 2026-10-12, journal §261).

**Since 2026-10-12 the piece has its own repo, `synthesi-alpha`**
(journal §261), which holds the recording (lossless), the picture as
built, the workshop and the kept versions. This page describes the
piece as it stood HERE the day it was called final.

---

## 2. The state of the audio

**In one line:** two kinds of audio file — the one recording, and
twenty samples made from it beforehand. Everything else is made live,
as the piece plays.

### The audio files

| | format | how much | used on |
|---|---|---|---|
| **The recording** | WAV · stereo · 48 kHz · 16-bit · not compressed | 182.13 s · 35 MB | every page |
| **The samples** | Ogg Vorbis (compressed, quality 6) · stereo · 48 kHz | 20 files · 7 min 30 s · 7.8 MB | pages 8 … 12 |

- All of them are loaded and unpacked into memory when the page opens.
  Nothing is read from disk while the piece plays.
- Nothing is written while it plays. A performance leaves no file.
- The sequences are not audio. They say *when* and *which key*; the
  sound is read from the recording or from a sample at that moment.

### Three ways a sound is played

**A. Plain playback of a file.** A stretch of a file, played as it
is, with a short envelope on it.

- every attack, on every page
- every hit on pages 8 … 12 (a stretch of a sample)
- page 12's whole containers (a sample from start to end)
- reversed, here, is the stretch truly turned round

**B. The granular read.** The recording read in overlapping grains
(0.2 s each, 8 at a time).

- **Electronics main**, always. At normal speed the grains line up
  and add back to the recording itself — so it sounds as the file
  does. It is the same reader the phrases and the icys use.
- **Phrases on pages 1 … 3 and 7; page 6's whole containers.** Plain:
  the recording as it is. Reversed: the grains step backward while
  each one plays forward (+10 dB to match).
- **The icys on pages 4 and 5.** The same read, slowed 2 to 50 times,
  17 grains at a time, the `expodec` window, +9 dB. This is real
  processing, live.

**C. An effect laid over a whole stream.** The stream's sounds pass
through it on their way out.

- the tremolos — an oscillator moving the level, 4 to 24 times a
  second
- the buffer override, on page 6 — live, +3 dB

### What is live, and what was made beforehand

| page | the sound comes from | played | processing, live |
|---|---|---|---|
| 1 | the recording | attacks A · phrases B | — |
| 2 | the recording | attacks A · phrases B | a crescendo on each phrase |
| 3 | the recording | attacks A · phrases B | `trem waves` over it |
| 4 | the recording | whole containers, B | **icy** (the four steady ones) |
| 5 | the recording | whole containers, B | **icy** (the four that change speed) |
| 6 | the recording | whole containers, B, one at a time | **the buffer override** |
| 7 | the recording | two streams: attacks A · phrases B | `trem rush` on one · crescendos on the other |
| 8 | 5 samples (icy) | two streams, A | `trem waves` · `trem rush` |
| 9 | 4 samples (override) | two streams, A | crescendos on both |
| 10 | 2 samples (icy) + 3 containers of the recording | three streams, A | crescendo · `trem rush` · crescendo |
| 11 | 2 samples (icy) + 2 (override) | three streams, A | `trem waves` · crescendo · `chop accel` |
| 12 | 2 samples (icy) + 3 (icy, then override) | whole samples entering one after another, and two streams — all A | `trem waves` · `trem rush` |

Read down the last column: **the heavy effects (icy, override) are
live on pages 4, 5 and 6 and already in the files on pages 8 … 12.**
The light ones — crescendo, tremolo — are live everywhere.

### Always on, on the sum

- **The reverb** — at each stop of electronics main (the last 0.6 s
  goes into it) and at the end of each granular phrase. A hall made
  of 4 s of fading noise.
- **A low cut** at 30 Hz.
- **A gentle compressor** — over −18 dB, 2 to 1.
- **A limiter** — at −1 dB, 20 to 1.

### Small print

- The files are 48 kHz. The browser plays at the sound card's own
  rate; if that is 44.1 kHz it converts every file once, on loading.
- The samples are compressed (Ogg); the recording is not.
- Each granular voice holds its own copy of the recording in memory.

---

## 3. What the seed decides

The seed is `"seed": 1` in the scenario file. The final draft is seed
1: 9 min 42 s from START to the end of electronics main — and ten
minutes to the last sound (measured on version 1, journal §260: page
12 goes on for eighteen seconds after main ends).

**Stays, whatever the seed**

- the twelve pages and where each one stops
- which effect belongs to which page, and every effect's settings
- the nineteen played sequences, each as it was played
- pages 1 to 3 — their sequences, in the order stored
- which containers, phrases and attacks belong to each page
- the rules (40 · 30 · 20; one at a time; two streams, three; half
  and half; in layers)

**Rolled from the seed**

1. How long each page stands — 26 to 38 s each. So the length:
   seed 1, 9:42 · seed 2, 9:31 · seed 3, 9:08 · seed 4, 9:27 ·
   seed 5, 9:39.
2. Pages 4 and 5 — which container enters first, the order after,
   which icy each gets, the moment of each entry.
3. Page 6 — the order of its containers.
4. Pages 7 to 12 — which sequences go to which stream, in what order;
   which sound stands in for a key the page has no sound for.
5. Pages 8 to 12, **the samples** — which container is processed how.

**Not decided by the seed** (the browser draws these fresh each time)

- On pages 4 and 5, the small stray in each icy grain's length. Same
  seed: the same containers, icys and moments — not sample for sample
  the same texture.
- The reverb's hall: its 4 s of noise is made anew each time the page
  opens.

---

## 4. A re-roll, today

By hand, three steps:

1. Change `"seed"` in `voices/v-alpha/scenario/scenario-1.json`.
2. Make the samples again — about a minute:
   `python tools/icy_render.py 8`, then `python tools/page_samples.py 9`
   (and `10`, `11`, `12`).
3. Open the piece: http://localhost:8732/engine/perform.html

- Step 2 **writes over** the samples of the seed before. The final
  draft's are safe in git, under the tag.
- Not built: choosing the seed in the page's address (`?seed=2`), and
  a folder of samples for each seed, so that two versions can sit side
  by side. Offered (§246); J chose this document instead (§247).
