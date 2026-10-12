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

# 2026-10-12 — session 2 (the first session held in this repo)

## §2. The licence

His words, opening the session — his answers to the two things the journal held pending
him:

"the licence: whatever is the common one for this type of code, MIT?  · your word to make
the repo public. yes public"

**What was looked at.** The licences in his other repos on this machine:
`composition-system` and `septet_LGMF_2026` carry MIT, "Copyright (c) 2026 elosine" ·
`for_seven_tubas` and `for_bass_clarinet_harp_and_accordion` carry CC0 ·
`string_quartet_no1-composer` carries Apache 2.0.

**The answer given.** Yes — MIT is the common one for this kind of code. But a licence at
the root covers everything in the repo unless it says otherwise, and this repo holds the
recording, the kept versions and the drawn score.

**What was put to him** — one decision, three ways:

| | |
|---|---|
| a | MIT for the code; the piece — recording, versions, score — © 2026 elosine, all rights reserved. The AI's pick |
| b | MIT for everything, one file, as in `composition-system` |
| c | MIT for the code; a Creative Commons licence for the piece |

**His answer:** "a, go"

**Why a rather than b** (the AI's reason, put to him with the options): a licence once
given cannot be taken back from the copies already out; "all rights reserved" can be
opened up on any later day.

**What was done.**

- `LICENSE` — the MIT text, word for word the lineage's, "Copyright (c) 2026 elosine".
  Kept as the bare text, nothing added, so that it is recognisable as MIT.
- `LICENSE-PIECE.md` — says which is which. The program is `engine/` and `tools/`: MIT.
  Everything else is the piece and its record — `voices/`, `versions/`, `picture/`,
  `docs/` — all rights reserved; look and listen freely, any other use needs his yes.
- `README.md` — a "Rights" section pointing at both.
- The deviations register — a new line (2.4: LICENSE carried now, and split).

**Decided by the AI, told to him:** `docs/` falls on the reserved side — it is not code,
and what he was asked about was the recording, the versions and the score · the notice
names "performing it" among the uses that need his yes; that is what "all rights
reserved" covers, but the word is the AI's, not his · where to ask is his GitHub page —
no e-mail address is written into the repo.

**Not done, not claimed.** The piece's notice is plain words, the AI's — not a lawyer's
drafting.

## §3. The repo is public

His word (the same message as §2): "your word to make the repo public. yes public" — and
then "a, go" on the agenda put to him: the licence in, then the repo public and `main`
pushed.

**What was put to him before the push**, in one line: public shows the whole repo —
`docs/history/` (the engine's journal, with his quoted words) and this log among it —
"say if anything should stay out". He answered "a, go" and named nothing.

**Looked at before the push.** The tracked text, searched for keys, tokens, passwords and
e-mail addresses: none found (one hit, a variable named `rangeToken`). The largest file:
`versions/seed-1/sound.flac`, 33.4 MB — under GitHub's 100 MB limit for a file.

**What was done.** `gh repo create elosine/synthesi-alpha --public`, with the remote
`origin` and the push of `main`, in one command.

**Read back from GitHub, not assumed:**

| | |
|---|---|
| the address | https://github.com/elosine/synthesi-alpha |
| visibility | PUBLIC |
| the licence GitHub names | MIT License |
| the description | "Sýnthesi Alpha — a piece for a player and fixed electronics, with an animated score" |
| `main` there · `main` here | `8c82fc8` · `8c82fc8` — the same commit |
| files | 140 |

**Decided by the AI, told to him:** the repo's one-line description on GitHub (the
README's first line) · the commit that holds this entry is pushed too, so that the public
repo does not say less than is true of it.

**Asked, not answered:** the push rule for this repo from here on. Until he says: commit
locally, and "push now?" at session end.

**Not done, not claimed.** The page was not opened in a browser: what a visitor SEES is
not checked, only what GitHub reports · GitHub names the licence "MIT" for the whole
repo; that the piece is reserved is said in `LICENSE-PIECE.md` and the README, which a
visitor has to read · no fresh clone was made or tried (B6) · every commit carries his
name and e-mail address as its author, and they are public with it · the pointers both
ways (the plan's S6 — `composition-system`'s INDEX, the Hetzner page) were not touched.

**Where the build stands:** B1 ☑ make a version · B2 ☑ this repo — now public ·
**► B3 the player.**

## §4. The push rule

Asked because the plan says so — S6: "the push rule asked when it is made".

**What was put to him:**

| | |
|---|---|
| a | ask "push now?" at session end — everything pushed is now published, so he gets a look first. The AI's pick |
| b | push with every commit, as in the engine |

**His answer:** "a, next B3"

**Decided:** commit locally; "push now?" at session end; no push in between. Written into
`CLAUDE.md`. The two pushes of §3 stand — they were the making of the public repo.

## §5. B3 — the player

His words: "a, next B3" — and, to the proposal below, "a, go".

**What was put to him.** What it is: one new page that plays a kept version — the sound
from `sound.flac`, the picture redrawn from `picture.json`, no engine inside. The one
thing to understand: this is the first time the picture's record is read back; if it
lacks something the picture did, it shows here. The build's top line: the shelf · the
sound · the clock · the picture · the check. The one decision:

| | |
|---|---|
| a | as the plan says — [begin], then ENTER plays from the top; ESCAPE stops. The AI's pick |
| b | the same, plus start from any page — for rehearsal; not in the plan, cheap to add later |

**His answer:** "a, go"

**What was built.**

| | |
|---|---|
| `player/index.html` | the page: the shelf, [begin], the stage |
| `player/player.js` | the shelf, the loading, the sound and its clock, the drawing |
| `player/record.js` | how a picture record is read — `mainAt`, `soundAt`, `fracAt`. Pure: no page, no sound |
| `versions/shelf.json` | the list the page opens on |

- **The drawing is the workshop's, copied** — `paintV1` and `makeLens` from
  `engine/perform.html`, `paintPic` from `engine/scenario.js` — and fed from the record
  where the workshop feeds it from the live engine. **The workshop was not touched.** The
  animation core is not copied: both pages load the one `engine/score-anim.js`.
- **The sound is loaded whole and unpacked before [begin].** The audio context runs at the
  file's own rate (48 kHz), so nothing is resampled.
- **The one clock:** the context's time since the start, less the output latency — "what
  is being heard now", as the workshop reckons it. At rest it holds where it stopped.
- **Keys:** ENTER plays from the top · ESCAPE stops (out over about 50 ms, no click) · a
  second ENTER while it plays does nothing · chords are left to the browser.
- **The stage is the whole window** — two lines in `player.js` (`W`, `H`) are all B4's
  fixed 1920 × 1080 shape has to change.

**Decided by the AI, told to him.**

- *The sound whole in memory, not streamed by the browser's own audio player.* After ENTER
  nothing is fetched — his floor rule (the plan's S4: the network gone, nothing stops) —
  and the clock is the workshop's own. The cost: 233 MB of memory for version 1
  (605.8 s × 48,000 × 2 channels × 4 bytes), and a wait at the pick — 1.4 s on this
  machine, from this machine's own server.
- *The shelf's list is a plain file* (`versions/shelf.json`), not a question to the
  server: it works the same from a folder, the small server, or a share.
- *His verdict lives in that file*; empty, the page says "not heard yet".
- *Back to the shelf = reload the page.* Nothing built for it.

**What was tried, in order — all in the running app, this machine, Chromium (the AI's
pane).**

*1. The page.* The shelf shows one row: seed-1 · the final draft · 1 · 10:05.8 ·
2026-10-12 · not heard yet · live-electronics-engine · f66ec1e. A click loads it in
1.40 s: 29,079,296 frames, 48 kHz, 2 channels — `version.json`'s own figures; 13 runs,
848 sounds.

*2. The sound against the file.* Three sums a channel — of the samples, of their sizes,
and of each sample times its place (mod 1000) — taken in the page and, from the FLAC, in
Python.

- First: **different.** Half the page's samples were not on the 16-bit grid.
- Found: the browser's own conversion of 16 bits to its 32-bit floats divides a positive
  sample by 32,767 and a negative one by 32,768.
- With that — and a half rounded up, as the page rounds — **the same, both channels, all
  three sums** (channel 0: 38,731,150 · 34,700,670,934 · 8,849,449,231; channel 1:
  153,694,992 · 34,856,351,558 · 66,015,505,154).
- So: every sample is in its place. A positive sample is 1 part in 32,767 larger than in
  the file (0.00027 dB); about 25,500 samples a channel move by one 16-bit step. This is
  Chromium's, on any page that plays a 16-bit file — not the player's to change, and far
  under hearing.

*3. The keys.* ENTER: playing; the clock went 7.919 s in 8.002 s of wall time (the first
reading fell inside the 0.14 s before the first sample is heard). A second ENTER: no
restart — 22.348 s and counting. ESCAPE: stopped at 22.359 s, and still there a second
later. ENTER again: from the top (1.86 s after 2 s).

*4. Version 1 replayed whole* — the picture painted at 2,424 moments, every quarter second
from 0 to 605.8 s, and the page read back each time:

| | |
|---|---|
| errors | 0 |
| the scroll off the record's line | 0 (worst 0.049 px — a style is read back to 6 digits) |
| the lenses on screen ≠ the sounds the record says are in the picture | 0 moments |
| a phrase's cursor off its read | 0 |
| sounds seen | 848 of 848 |
| most at once | 20, at 381 s |
| a lens with no marks | 0 |
| at the end | 0 lenses, 0 marks still lifted out of the still score |

(The first run of this called the scroll "off" at 179 moments: the tolerance was tighter
than the 6 digits a style is read back with. The scroll was right.)

*5. What a frame costs* — script time, at true frame steps (1/60 s), 22 s a stretch:

| stretch | mean | worst | frames over 16.7 ms |
|---|---|---|---|
| 370 … 392 s, the busiest | 2.90 ms | 12.7 ms | 0 of 1,321 |
| 20 … 42 s | 2.16 ms | 10.2 ms | 0 |
| 540 … 562 s | 2.96 ms | 15.1 ms | 0 |

SCRIPT time only. The pane does not draw: what the browser then spends putting the frame
on a screen is not in these figures.

*6. Against the workshop's live picture — the thing B3 had to prove.* A short pass made in
the workshop, here (page 12, the stand cut to 4 s: 54 sounds, 77.8 s; rolled 27.341 s,
held 27.338 s — §1's figures again), with every lens it painted written down — the
frame's time, the stretch, the scroll, the time its notation showed. Then the record that
pass wrote, read by `player/record.js` at the same moments.

It took four tries, and the first three are worth keeping:

- *In a background tab:* the browser gave the page no frames. Nothing was drawn; nothing
  to compare.
- *In the front tab, the pane hidden:* the same — 0 frames in 20 s. (Earlier the same
  pane had given about 100 a second; whether it was on show then was not looked at.)
- *The page's own frame loops paced from a worker's timer* (62.5 a second; set before
  [begin]): the workshop's picture ran. The comparison showed 34.7 ms — but the log had
  read the clock at each lens, after the lenses before it in that frame were built, not
  at the frame's own moment.
- *The frame's own time taken where the page takes it:* the figures below.

| the lenses | |
|---|---|
| drawn live · in the record · matched | 54 · 54 · 54 (46 attacks, 2 phrases forward, 6 reversed) |
| the stretch lifted | the same, every one (0 difference) |
| the time its notation shows, 12,741 frames | median 0.033 ms apart · 99.9 % within 0.1 ms · worst 2.7 ms (one audio block is 2.667 ms: the clock ticking between the log's reading and the page's) |
| a lens on screen before its time | never (−0.2 ms) |
| a lens on screen after its time | 1 frame of 12,742, by 0.033 ms — the record is written to 4 decimals |

| the scroll: the record ahead of the workshop, ms of score | frames | least | median | most |
|---|---|---|---|---|
| at rest | 3,606 | −0.046 | −0.046 | 0 |
| in steady motion | 1,248 | −2.7 | +2.7 | +24.0 |
| within 0.1 s of a start | 24 | −2.7 | +2.7 | +40.0 |
| within 0.1 s of a stop | 23 | −40.0 | −0.046 | +8.0 |

**What the last two rows are — a real, small difference between the two pictures.** The
workshop places the score from the engine's position reports, less the output latency
(40 ms on this machine) for as long as the engine is moving. When the ENGINE stops, that
allowance goes — 40 ms before the stop is HEARD — and its score snaps the last 40 ms:
2.8 px of the strip, 5 px on a 1080 screen. At a start, the mirror of it. The player has
only the record, and glides in and out with what is heard. In steady motion the workshop
trails the true place by a few ms (its reports come every 10.7 ms). So the player is not
the workshop's picture to the pixel at the thirteen starts and stops: it is the nearer of
the two to the sound.

*7. The curved reads* — six in version 1, all on page 5; none in the page-12 pass, so by
arithmetic: the record's 33 points fit the workshop's curve to 7 parts in a million; read
straight between them, as the player does, they stray 4.2 ms of score at most — half a
pixel on a 1080 screen.

**What was rejected.** Streaming the sound through the browser's own audio player: it
starts sooner and holds 35 MB, not 233 — but it may still be fetching when the network
drops, and its clock is coarser than the context's. · Copying `score-anim.js` into
`player/`: two copies of the one thing that says how the marks move.

**Not done, not claimed.**

- **Nobody has seen it.** The pane does not draw. Every figure above is where things were
  PUT, not how they look.
- **Nobody has heard it through the player.**
- Only Chromium, only this machine. Not Firefox, not Safari, not an iPad — where 233 MB
  for the sound may be too much.
- Live, against the workshop: page 12's short pass only. Pages 1 … 11 and the curved
  reads were replayed against version 1's own record, not against a live pass.
- Two sounds that begin inside one frame, on marks they share: the workshop lays their
  lenses in the order they were called for, the player in the order they began. Not
  measured; the figures above did not show it.
- From a share (Hetzner), and the video: not built — S3's other half.
- With the page hidden, the player's own frame loop stands still as any page's does; the
  sound goes on.

**The checks made sound on his machine:** the player, about half a minute of version 1;
the workshop, page 12 four times, 78 s each. The test's folder
(`build/versions/b3-check/`) was removed.

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ built and checked by numbers — **his eyes
and ears on it pending** · ► B4 the stage set-ups, at his word.

## §6. A mastering pass — the question, and the state of things

His words (after B3 was handed to him, before he had looked at it):

"One thing I forgot to do is do a mastering bus pass on the sound files. I'm not sure if
that was done. I doubt it. There might be a plan or a sketch of how to do this in the last
piece. Approaching. So if we can write up a plan to repass the audio and what the
mastering stage should look like, just some basic like low pass and compression if
necessary and limiter. Alternatively, another possibility is I just run the current sound
file in Reaper through some plugins. That's okay too. Either way, let's figure out a plan
to do this if it hasn't been done already and where I would do it in the Live Electronics
Engine repo or here. Uh, either way, we should build the mastering stage infrastructure
into the Live Electronics engine repo as well."

Taken as a planning question: his planning method (`/plan-item`), phase 1 — the data
first. Nothing is decided in this entry.

**Was it done? No.** What version 1 went through is the engine's own bus, as it played
(`engine/playhead-engine.js`, the "ensemble bus" of engine journal §113–114), and the
recording is taken after it:

| stage | setting |
|---|---|
| high-pass | 30 Hz |
| "glue" compressor (the dry path) | −18 dB, 2:1, 6 dB knee, 30 / 250 ms |
| "safety limiter" | the browser's compressor at −1 dB, 20:1, 2 ms attack — no look-ahead |
| low-pass | none |

**Version 1 as it stands, measured** (`ffmpeg` `ebur128`, and `version.json`):

| | |
|---|---|
| integrated loudness | −17.3 LUFS |
| loudness range | 16.3 LU (−29.1 … −12.8 LUFS) |
| true peak | 0.0 dBFS |
| the loudest sample before packing | +0.16 dB — 15 samples over full scale, clipped when packed to 16 bits |
| RMS | −22.8 dB |

So the "safety limiter" does not hold its −1 dB: it is a compressor with a 2 ms attack,
and peaks pass it.

**The sketch in the last piece** — piece 6, *Approaching* (`decibel_TENOR_2026`): its
`docs/RUNNING_LOG.md` §164 and `docs/PLAN.md` 11.6, "the bus", built 2026-10-06 in
SuperCollider (`electronics/sc/synths.scd`, `\leMaster`; the generic engine is
`live-electronics-system`):

- high-pass 30 Hz · a low-pass (there, switched off) · the glue as a soft-knee RMS
  compressor (the same −18 dB, 2:1, 6 dB, 30 / 250 ms) · a LINKED LOOK-AHEAD LIMITER,
  ceiling −1 dB, 5 ms, which cannot overshoot · a clip · a meter: loudness (LUFS) and
  true peak.
- Proven there by an offline battery (`bus_test.scd`). "NOT CLAIMED: his ear on any of
  it."
- Its own note (that log's §1736): his memory of "a mastering bus built in SuperCollider"
  had been of THIS browser bus — high-pass, glue, safety.

**Two repos, near in name:** `live-electronics-engine` is the browser sandbox this piece
was made in — its bus is the table above. `live-electronics-system` is the SuperCollider
engine — it has the real bus. His "Live Electronics engine repo" is read as the first.

**Also found, not read:** `jwy_audioEngineering/archive/Mastering-Log.md`.

## §7. The master is for the hall

**What was put to him** with §6's figures — his intention read back (a basic chain: a
low-pass, compression only if needed, a limiter; as a built stage or by hand in Reaper;
either way the stage also goes into `live-electronics-engine`), the AI's read, and one
question: what is the master for, first?

| | |
|---|---|
| a | the hall — he on stage, the file through the PA. A clean, safe file: nothing over −1 dB, the top tamed, compression only where quiet pages get lost. Loudness is the house's fader. The AI's pick |
| b | listening at home or online — the video, the public repo: brought up to a streaming level, more limiting |
| c | both — one master for the hall, a louder one printed later for the video |

**His answer:** "a"

**Decided:** the master is made for the hall. A louder print for listening was not asked
for; it can come with the video (B7) if he wants it then.

**The AI's read, put to him in the same turn and not objected to — not yet his word:**
the stage is BUILT, as a pass on a finished sound file (file in, file out). The piece is
not played again, so the take and its picture's record stay as they are. Why built and
not by hand: he wants the stage in the engine anyway, and every new seed's version needs
the same master. Reaper stays open for a one-off.

**Next:** the top line of the plan item, put to him (phase 2).

## §8. The top line is his; the steps are handed to the AI

**The top line put to him** — a new item in the plan, "S7. The master": 1 the target · 2
the source · 3 the stage · 4 his ear · 5 where the master lives · 6 the same stage in
`live-electronics-engine`. "Is this the order?"

**His answer:** "yes I don't need to see the steps, write plan or go with build if plan
done"

**What that was taken to mean.** The order stands. His planning method's third phase —
each step's goal and sub-steps talked through one at a time — he waived for this item: the
AI lays the steps out, writes them into the plan, and builds. So every sub-step of S7 is
the AI's decision, written as such in `docs/PLAN.md` ("each is his to reverse"), and the
reasons are here and in §9.

**Decided by the AI, for him to reverse** — the ones that are choices and not arithmetic:

| | decided | rather than | why |
|---|---|---|---|
| S7.1 | the ceiling is a TRUE peak of −1.0 dB | a sample's peak (piece 6's live bus) | a file can afford to read the wave between the samples; a live bus cannot without delay |
| S7.1 | loudness is not chased | a target level (−16, −14 LUFS) | his "a": the hall, the house's fader |
| S7.2 | the master is made from the kept file | playing the piece again, before the engine's own limiter | another take is another version; and the engine's bus is what he composed through |
| S7.2 | the workshop is not changed | a real limiter in the browser now | it changes what every page sounds like — his ear first, another day |
| S7.3 | a Python tool, numpy only | the browser · SuperCollider · Reaper | below, §9 |
| S7.4 | few candidates, screened first | a panel of dials | the engine's choice methodology — "I don't want too much knob fiddling" |
| S7.5 | a kept master goes into git only at his word | made and committed now | 35 MB a time, and git never forgets |
| S7.6 | the same two files, copied | a shared module | the plan's S6: a frozen copy is what is not forgotten |

**Where it sits in the build order:** a chunk of its own, "BM, the master", put in after
B3 and before B4 — the stage set-ups play whatever file the shelf names, so the master is
better settled first.

## §9. BM — the mastering stage, built; version 1's candidates made

**What was built.**

| | |
|---|---|
| `tools/master.py` | THE STAGE — file in, file out; `--selftest` · `--candidates` · `--keep` |
| `voices/v-alpha/master.json` | the piece's dials, the named compressor settings, the candidates for his ear |
| `engine/master.html` | the listening page — the candidates side by side |
| `player/` | the shelf row's `plays` names the file a version plays; a column "sound" |
| in `live-electronics-engine` | the same three files, and its journal 263, its `docs/plan/mastering-stage.md` |

**The chain, as built.**

- *The low-pass:* 12 dB an octave, −3 dB at the named frequency, no phase shift — the
  whole file's spectrum is shaped at once.
- *The compressor:* both channels as one · the running level over 30 ms · a 6 dB knee ·
  30 / 250 ms · then made up to the loudness the file was made at. Under its knee it
  multiplies by exactly 1.
- *The limiter:* looks ahead · both channels as one · reads the true peak, four points a
  sample · comes down 1 dB in 1.5 ms, lets go 1 dB in 60 ms. Where nothing is over the
  ceiling its gain is exactly 1. It cannot overshoot: the gain is "the largest of every
  peak's own straight line", which a running maximum gives exactly.
- *16 bits, packed.* With the limiter alone there is NO dither: a sample it did not turn
  down stays the sample it was. With the low-pass or the compressor on, every sample has
  changed, and the rounding is dithered from a fixed seed.
- *The ceiling is held by a second meter.* The made file is measured by `ffmpeg` (EBU
  R 128); if its true peak stands over the ceiling the limiter is asked for that much
  less and the file is made again.

**The self-test** (`python tools/master.py --selftest` — made-up sounds whose right answer
is known). MASTER SELFTEST PASS:

| | |
|---|---|
| under the ceiling the limiter changes nothing | the largest difference 0.0 |
| white noise at −6 dB (its samples under the ceiling, the wave between them not) | the wave's peak −0.48 → −0.995 dB; then the second meter's turn |
| a tone 6 dB over full scale — 60 · 220 · 1000 Hz | leaves at −1.001 dB, true peak −1.001 |
| a struck burst 6 dB over, 1 ms to rise | −1.002 dB |
| a tone whose every sample sits 3 dB under its own peak | the peak read 0.000 dB (it is 0); held at −1.001 |
| a click through each stage | not moved — at sample 24000, put at 24000 |
| the low-pass at 2 kHz: 200 Hz · 2 kHz · 8 kHz | −0.0 · −3.01 · −24.1 dB (0 · −3.01 · −24.1) |
| the compressor: 9 dB over its threshold · 6 under · on it | −4.51 · 0.00 · −0.381 dB (−4.5 · 0 · −0.375) |
| a 16-bit file through it, the limiter alone | 0 untouched samples changed · true peak +1.3 → −1.0 dB by ffmpeg |

**Version 1's sound, looked at before choosing what to offer.**

| | |
|---|---|
| samples over −1 dB | 444 — nine thousandths of a second, in 36 of the 605 seconds |
| samples over −3 dB · −6 dB | 0.13 s · 1.14 s |
| the middle of its spectrum | 1.3 kHz |
| its energy, band by band (of the whole) | 100–300 Hz −15.8 dB · 300 Hz–1 kHz −5.9 · 1–3 kHz −1.6 · 3–6 kHz −15.9 · 6–9 kHz −37.3 · 9–12 kHz −42.0 · 12–16 kHz −48.7 · over 16 kHz −52.7 |

**The screen** (the engine's choice methodology: a choice is offered only if it moves
something by a just-noticeable difference — about 2 dB in level or range, about 15 % in
where the spectrum sits):

| the low-pass at | moves the spectrum's middle by | the level by |
|---|---|---|
| 12 kHz | −0.2 % | 0.00 dB |
| 9 kHz | −0.6 % | −0.01 |
| 6 kHz | −2.2 % | −0.05 |
| 4.5 kHz | −4.1 % | −0.12 |
| 3.5 kHz | −6.2 % | −0.23 |
| 2.5 kHz | −10.2 % | −0.56 |

**The finding: the piece is already dark, and by the numbers a low-pass is not a choice on
it.** There is almost nothing over 6 kHz to take away. One is offered all the same — at
3.5 kHz, marked on the page as under the screen — because the numbers are the first cut
and his ear is the verdict.

| the compressor | loudness range (16.3 LU as made) |
|---|---|
| 1.5:1 from −24 dB | 13.9 LU |
| 2:1 from −24 dB | 12.6 LU |
| 2:1 from −30 dB | 10.9 LU |
| 3:1 from −30 dB | 9.1 LU |

Two are offered, about 3.5 LU apart: 2:1 from −24, and 3:1 from −30.

**The candidates of version 1** — `python tools/master.py --candidates versions/seed-1`,
89 s, into `build/masters/seed-1/` (not in git):

| name | what | loudness | range | true peak | the limiter worked | against "safe" |
|---|---|---|---|---|---|---|
| *as made* | | −17.3 LUFS | 16.3 LU | 0.0 dB | | |
| `safe` | the limiter only | −17.4 | 16.3 | −1.0 | 2.16 s of the piece, 51 moments, 1.03 dB at most | — |
| `softened` | + the low-pass at 3.5 kHz | −17.7 | 16.4 | −1.0 | 1.10 s, 39 moments, 1.06 dB | brightness −6.2 % — UNDER the screen |
| `evened` | + the compressor, 2:1 from −24 dB (8.5 dB down at most, 3.9 up) | −17.3 | 12.6 | −1.0 | 2.86 s, 63 moments, 2.82 dB | range −3.7 LU — a choice |
| `evened-more` | + the compressor, 3:1 from −30 dB (15.3 dB down at most, 8.4 up) | −17.4 | 9.3 | −1.0 | 8.12 s, 93 moments, 4.88 dB | range −7.0 LU — a choice |

Checked on the files, apart from the tool's own report: every one is 29,079,296 frames at
48 kHz, as the source; not moved by a sample (the source against each, at three places);
its loudest sample at −1.000 dB. In `safe`, of the samples the limiter did not turn down,
**0 differ from the source's.**

**Tried and changed, in order.**

- *The true-peak meter.* A 16-point curve between the samples read a tone at a quarter of
  the rate 0.12 dB high (in part the test's own fault: it measured a slice, whose cut
  ends ring), and `ffmpeg` read a noisy test file at −0.8 dB where the tool's own meter
  read −1.0. Made 32 points under a Kaiser window: 0.000 dB on the tone; the two meters
  then agreed on the file. And the second meter was given the last word (above).
- *The first self-test of "under the ceiling" failed rightly:* white noise at −6 dB is
  not under a true-peak ceiling of −1 — between its samples the wave reaches −0.5 dB. The
  test was wrong, not the limiter; it became two tests.
- *The compressor's make-up.* First none: the files came out 2.7 and 4.8 dB quieter.
  Then "to the ceiling" — the loudest peak back at −1 dB: it bought only 1.1 dB, because
  a compressor that takes 30 ms lets the transients through — the loud pages had come
  down and the peaks had not. Now "to its own loudness": back to the loudness it was made
  at, the limiter taking the peaks. All four candidates stand within 0.4 LU of each
  other — so what differs between them is not the volume (his interface preferences).
  **This departs from the plan's first wording ("no make-up"), and the plan was corrected
  to say so.**

**Rejected.**

- *The browser for the stage:* its compressor is the "safety limiter" that does not hold.
- *SuperCollider:* the real bus is there (piece 6), but this repo needs no SuperCollider,
  and the plan's test of done is a fresh clone that fetches nothing.
- *Reaper by hand* — his own alternative: fine for a one-off; forgotten in two years, and
  to be done again for every seed.
- *scipy:* it is on this machine and would have given the filters ready-made; the repo
  asks only for numpy and soundfile, so the tool is written with those.
- *Dither with the limiter alone:* it would change 29 million samples to round a few
  thousand.

**The listening page** — `engine/master.html?v=seed-1`. Rows, as his stored things are
listed: click one to hear it; it goes on from where the piece is. SPACE plays and stops,
TAB goes to the next. Buttons to each of the twelve pages, the end, and the loudest
moment (6 min 13 s). "The same loudness for all" is on as it opens. Checked in the
running app, by numbers: four rows, each 605.819 s · loaded in 0.8 s · SPACE plays (2.47 s
after 2.5 s) · TAB goes to row 2 and keeps the place (3.8 s) · "5" goes to page 5's start
(187.3 s) · a click on row 4 keeps the place, and only one sounds at a time · SPACE stops
all.

**The player** — a shelf row's `plays` names the file a version plays. Checked: with none
named it holds the as-made sound (loudest sample 0.0 dB); with `safe.flac` named it holds
that (−1.0 dB), the same 29,079,296 frames. The row shows "as made" or "mastered".

**In `live-electronics-engine`** — the same `tools/master.py`, `engine/master.html` and
`voices/v-alpha/master.json`; the self-test passes there; the four candidates made there
from its own `build/versions/seed-1/` are **the same files as here, byte for byte**. Its
journal 263, with three clips (as made · safe · evened, the same 15 s);
`docs/plan/mastering-stage.md`. Committed there, not pushed. Its LIVE bus was left as it
is — named there as its own item.

**Not done, not claimed.**

- **His ear has not been on any of it** — not the candidates, not the page.
- **No master is kept.** `versions/seed-1/` holds what it held. `--keep` has not been run
  on a real version.
- The page was not SEEN: the pane does not draw.
- "A new seed in one step" (B5) does not yet end with the master.
- The limiter's two speeds (1.5 ms and 60 ms a dB) and the compressor's times are the
  AI's starting numbers; nobody has listened for them.

**The checks made sound on his machine:** a few seconds of each of two masters.

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ (his eyes and ears pending) · **BM ◐ the
master — built; HIS EAR on the four candidates is the next thing** · B4 the stage
set-ups.

---
