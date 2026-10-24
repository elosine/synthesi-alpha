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

## §10. Version 1's master is kept — `safe`

**What was put to him** with §9: the four candidates as a lettered table (a `safe` — as
made, the limiter only · b `softened` — plus a low-pass at 3.5 kHz · c `evened` — plus
gentle compression · d `evened-more` — plus firmer compression), the listening page's
address, five 30-second previews sent as files (as made, then the four, around the
loudest moment), and the AI's pick: a, "unless the quiet pages feel lost next to the loud
ones; then c".

**His answer:** "a, go"

*(Whether he listened before he answered, he did not say. The shelf's verdict on version
1 still reads "not heard yet": that is his to give.)*

**Decided (his):** version 1's master is `safe` — the limiter only. The low-pass and the
compressor stay off. Those are the piece's dials from now on
(`voices/v-alpha/master.json`, unchanged by this: they were the starting dials).

**What was done.**

- The candidates were made once more first — the tool had been uncommitted when they were
  made, and a kept master's report should name the tool's commit. `safe.flac` came out
  **the same file, byte for byte** (its hash before and after: `d76b7dd1b4d11b50…`).
- `python tools/master.py --keep safe versions/seed-1` →
  `versions/seed-1/master.flac` (34,981,418 bytes) and `master.json`; the shelf row now
  says `"plays": "master.flac"`.

**The kept master, measured again apart from the tool** (`ffmpeg`, EBU R 128): true peak
−1.0 dBFS · loudness range 16.3 LU. Its report: −17.4 LUFS · 29,079,296 frames, as the
source · the limiter worked on 2.16 s of the piece in 51 moments, 1.03 dB at most · of the
samples it did not turn down, 0 differ from the source's · the tool at commit `0cb96d0`,
clean.

**`sound.flac` is as it was** — git shows no change to it.

**In the running app:** the player's row reads "mastered"; it loads `master.flac` —
29,079,296 frames, its loudest sample at −1.0 dB (the as-made sound's is 0.0).

**Not done, not claimed.** His ear on the master through the player · "a new seed in one
step" (B5) does not yet end with the master · the engine's own `build/versions/seed-1/`
was not given a master (it is not in git there; one command if wanted).

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ (his eyes and ears pending) · BM ☑ the
master · **► B4 the stage set-ups, at his word.**

## §11. Clicks in the last two pages — found: the buffer override's joins

**He listened** (the first report of anyone's ear on version 1), and said:

"there is some clicking in the last two pages, I couldn't tell you for sure what it is. It
might sound a little bit like small attacks not properly enveloped. It's a little bit like
that sound when there's an, a, uh, an attack or when a sound plays and there's no ramp up
a little bit. Or the other thing it sounds a bit like is if there were some CPU or
processing power issues. But the last two pages has a lot of it. and these weren't there
in the previous final draft in the old repo. So something about the rendering process this
time, or perhaps the mastering process. I'm not sure how to tell you to diagnose, but
maybe you have a solution."

And, while it was being looked for:

"when we were building it, it might have been the case that when with the combination
effects, we rendered the IC effect first on the sections and then use those rendered sound
files and applied additional effects to those like the tremolo and buffer override, etc.
I'm not 100% sure this was the case, but this might be a potential fix."

**What was tried, in order.**

*1. Is it the mastering?* A click counted as a kink in the wave far over what is around
it: 975 in the sound as made, 974 in the master, page for page the same. **Not the
mastering.**

*2. What kind of click?* The sharpest, printed sample by sample: the wave runs smoothly,
then two neighbouring samples stand half of full scale apart, both channels alike (at
563.5775 s: … +0.265 +0.356 +0.253 | −0.378 −0.351 …). A HARD BREAK — a cut, not an
attack. Counted as such (a step over 0.12 of full scale, six times the steps beside it):

| the version, as made | hard breaks |
|---|---|
| pages 1 … 10 (0 – 480 s) | 6 |
| page 11 (480 – 530 s) | 53 |
| page 12 and the play-out (530 – 606 s) | 46 |

His ear and the count agree: the last two pages.

*3. Whose break?* Often in pairs, the same distance apart again and again (533, 1279,
2556 samples) — so something that repeats, not chance. The pre-processed samples of pages
8 … 12 were looked at one by one: breaks in page 11's `set45` (3) and page 12's `set46`
(6), `set47` (17), `set48` (2) — every one a sample the BUFFER OVERRIDE had been over; none
in a sample that is icy only.

*4. Proof.* Each of the 99 breaks from page 11 on was set against the sounds sounding at
that moment (the picture's record) and the place each was reading in its sample (the
page's manifest). First answer: 0 of 99 — every one about 574 samples off. That was the
engine's own bus: two of the browser's compressors in a row (the glue, the safety
limiter), 6 ms of look-ahead each — **the sound leaves the engine 12 ms after it is
played.** With those 12 ms allowed for:

| a break at that very place in the sample being read | 99 of 99 |
|---|---|
| page 11 `set45` (override) | 61 |
| page 12 `set47` (icy + override) | 20 |
| page 12 `set46` (icy + override) | 14 |
| page 12 `set48` (icy + override) | 4 |
| in no sample | 0 |

**The clicks are in four sample files, and are heard each time a cursor or an attack reads
across them.** `set45` holds only three — and was read across sixty-one times. Not the
making of the version, not the recorder, not the master, not the player.

*5. Were they in the final draft?* The four files are the same in `live-electronics-
engine`, byte for byte, and unchanged since its tag `v-alpha-final-draft` (they were last
made at 15:12 on 2026-10-12 — "the buffer override 3 dB up", engine journal §245; the tag
is 15:21). **So the final draft's own samples have these breaks, at these places.** This
does not agree with what he remembers; it is what the files say.

*6. His hint.* Right: page 12's samples ARE made that way — the icy first, then the
override over the render ("it's like in layers", engine journal §243; `tools/
page_samples.py`). And it is that second step that breaks — on page 11 the override
alone.

**What the break is** — three places where the override joins two pieces of sound without
a crossfade. The loop is the same in `engine/override-processor.js` (the live unit) and in
`tools/page_samples.py` (the samples):

1. *A forced buffer begins.* The sliver that was repeating is dropped mid-wave and the new
   sound cuts in — no join at all.
2. *A pass begins shorter than the one before* (the rate rising; or the forced buffer
   running out). The pass that fades out is read on from where a pass of the NEW length
   would have ended, not from where it did end.
3. *A last pass of a few samples* — when a pass ends just as the forced buffer runs out, a
   pass eight samples long is begun, with a join of one sample.

On a quiet or broken sound these are small. On an icy render — one long loud wave, and the
override 3 dB up — each is a step of up to half of full scale.

**The mend, tried on a copy** (a scratch script; nothing in the repo was written):

1. the new forced buffer crosses in over one join's length, the old sliver running on
   under it (sine and cosine: the power held, no corner);
2. the fading pass is read on from where it ended;
3. a last pass shorter than 64 samples is not begun: the one sounding runs on.

| the sample, remade | hard breaks: as it is → mended | all breaks, the small ones too (a step over 0.02) |
|---|---|---|
| page 11 `set45` (4.3 s) | 3 → 0 | 26 → 0 |
| page 12 `set47` (12.8 s) | 22 → 0 | 68 → 0 |
| page 12 `set46` (27.5 s) | 7 → 0 | 121 → 0 |

The level is the same to the hundredth of a dB. (The first two mends alone left 2, 6 and
18: every one of them where a pass of eight samples had begun — which is how the third was
found.) The remade "as it is" stands 15 … 22 dB under the kept files in difference — the
kept ones are Vorbis, and for the icy ones the grain's small stray is drawn afresh.

**Previews, real files, sent to him:** `build/click-previews/` — `page12-set47` and
`page11-set45`, each "as it is" and "mended".

**Rejected.** *The player, the recorder, the processor being short of breath:* the breaks
are in the files the piece reads, before any of them. *Mending by ear in an editor:* 99
places, and every new seed makes more.

**Not decided — put to him:** to mend the override at its source (both homes of the loop),
make the samples of pages 9 … 12 again, and play the piece again — a new take, since the
samples it reads are part of it; or to keep this take and mend the breaks in the finished
file.

**Not done, not claimed.** Nothing in the repo is changed: not the tool, not the unit, not
a sample, not version 1 · his ear on the mended samples · the live unit's page (page 6's
override on the bus) was not listened to or counted apart — pages 1 … 10 hold 6 hard
breaks between them · whether the 12 ms of the bus matter to the picture: it is the same
live as in a version, and the score's lag was set by his eye with it there.

## §12. The override mended at its source; the samples of pages 9, 11 and 12 made again

**What was put to him** with §11: (a) mend it at the source — the override's joins, the
samples of pages 9 to 12, and the piece played again, a new take; the AI's pick · (b) keep
this take and repair the finished file — faster, not built, small clicks may remain, and
new seeds would still need (a).

**His answer:** "a, go"

**The mend, in its two homes** — `tools/page_samples.py` (`override`, which makes the
samples) and `engine/override-processor.js` (the live unit: page 6's override on the
bus). The same three changes in each, and each file says so at its head:

1. *A forced buffer begins:* it CROSSES IN over one join's length (the join of its own
   first pass; never under 64 samples, never over half the forced buffer), the sliver that
   was repeating running on under it. Sine and cosine — the power held, and neither side
   starts with a corner. A sliver still in its first pass is the sound as it comes: there
   is nothing to cross, and nothing is done.
2. *A pass begins shorter than the one before:* the pass that fades out is read on from
   where IT ended — its own length kept beside the new one.
3. *A pass is never cut short to fit what is left of the forced buffer.* It begins whole,
   and the next forced buffer crosses in over it.

**The third was restated on the way.** First it read "a last pass shorter than 64 samples
is not begun". That left one small step in the live unit, on one sample of eight (0.021
of full scale): a last pass 124 samples long had been begun, and a pass that short gets a
join of 14 — a corner. The cause was not the 64: it was that a pass was being shortened to
FIT at all, and its join with it. The plugin this is made after does not do that; it lets
the forced buffer's end cut the pass. With the first mend that cut is a crossing — so the
shortening went.

**The two homes, tested on every override sample** (the unit run outside a browser, by
node, block by block as a browser runs it; against the unit as it was, from git):

| the sample | the unit as it was: hard · all breaks | the unit, mended | the tool, mended |
|---|---|---|---|
| page 9 `set35` · `set36` · `set37` · `set38` | 0 · 4 — 0 · 10 — 0 · 7 — 0 · 14 | 0 · 0, all four | 0 · 0, all four |
| page 11 `set45` | 1 · 17 | 0 · 0 | 0 · 0 |
| page 12 `set47` | 13 · 67 | 0 · 0 | 0 · 0 |
| page 12 `set46` | 4 · 98 | 0 · 0 | 0 · 0 |
| page 12 `set48` | 0 · 88 | 0 · 0 | 0 · 0 |

The unit's level, mended against as it was: within 0.03 dB on every one. The sound sits
where it sat: moved by 0 samples.

*Seen in passing:* the tool and the unit are the same loop and not the same samples — set
against each other they stand 1 to 16 dB apart in difference. The unit reads its clock
once a block of 128 samples, the tool at every sample, so the forced buffers fall a few
samples differently and the slicing drifts. That was so before the mend. The tool's own
head says "ported sample for sample"; of the override that is not exact. Left as it is:
it changes no decision.

**The samples made again** — `python tools/page_samples.py 9`, `11`, `12` (page 10 holds
no override). The tool rewrites every file of a page; the four that are icy only came out
**the same sound to the last sample** (the largest difference 0.000000) and only their
packing differed, so the kept files were put back — nine files change, and no other:

| the sample | kind | level, dB | peak, dB | hard breaks | all breaks |
|---|---|---|---|---|---|
| page 9 `set35` | override | −39.77 → −39.77 | −20.25 → −20.25 | 0 → 0 | 3 → 0 |
| page 9 `set36` | override | −35.30 → −35.33 | −18.41 → −19.14 | 0 → 0 | 10 → 0 |
| page 9 `set37` | override | −30.22 → −30.21 | −13.70 → −13.75 | 1 → 0 | 11 → 0 |
| page 9 `set38` | override | −29.93 → −29.94 | −13.37 → −13.50 | 0 → 0 | 13 → 0 |
| page 11 `set43` | override | −32.03 → −32.03 | −22.12 → −22.30 | 0 → 0 | 1 → 0 |
| page 11 `set45` | override | −30.50 → −30.51 | −14.58 → −14.57 | 3 → 0 | 22 → 0 |
| page 12 `set46` | icy + override | −29.89 → −29.89 | −11.45 → −11.24 | 6 → 0 | 93 → 0 |
| page 12 `set47` | icy + override | −23.15 → −23.15 | −3.85 → −5.23 | 17 → 0 | 51 → 0 |
| page 12 `set48` | icy + override | −32.58 → −32.57 | −15.49 → −15.48 | 2 → 0 | 83 → 0 |
| **all fifteen samples of pages 9 … 12** | | | | **29 → 0** | **289 → 2** |

Every one the same length as before; the level the same to 0.03 dB. (`set47`'s peak fell
1.4 dB: its peak had been a click. The two breaks left are in page 10's `set39`, an icy
sample this did not touch.) Under the icy-then-override samples the icy layer is the one
it was — the tool draws the same numbers from the seed — so what changed is the joins and
nothing else.

**Decided by the AI, told to him:** the crossing's law is sine and cosine, not the square
roots the passes join with — the square root starts with a corner, which is the thing
being mended; the passes' own joins were left as they are: they are part of how the
override sounds, and he chose that sound · the crossing's length is the pass's own join —
no new dial.

**Not done, not claimed in this entry.** His ear on the mended override — in the samples,
and on page 6, where the unit runs live · the piece played again: §13.

## §13. The piece played again — a take spoiled, and the take that is good: `seed-1b`

The second half of his "a, go" (§12): play the piece again, and master it as before.

**The first take was spoiled — by the AI — and thrown away.** It was made in the AI's
pane (hidden), as version 1 and every short pass had been, and this time with the
speakers MUTED (`engine.out` at 0 — after the recorder's tap, so the recording was whole),
to spare him ten minutes of sound he had not asked to hear.

| the spoiled take | | version 1 |
|---|---|---|
| length | 682.9 s | 605.8 s |
| the last sound ends | 650.5 s | 600.8 s |
| the loudest sample | +1.48 dB, 81 over full scale | +0.16 dB, 15 |
| the version's own check: rolled · held | 582.164 · 582.146 s — **passed** | the same |

*What had happened.* The picture's record gave it away: a sound's END stood far from the
moment it was ASKED for. 159 sounds of pages 11 and 12 began late — by up to 58.4 s — and
in clumps: 91 of them ending together at 563.3 s, the next clump at 623.3 s. A minute
apart. A page that is hidden AND silent has its timers held back by the browser, after
some minutes to one a minute; and the piece's sounds are CALLED from a timer
(`engine/patterns.js`: a tick every 100 ms, looking 0.35 s ahead — 1.5 s when hidden,
which is enough for a timer held to one a second, not one a minute). Muted, the page was
silent. Each time the timer woke it called everything it was behind with, at once.

*Two things this showed, both written into `CLAUDE.md`:*

- **A version is not made muted in a hidden page** — or its timers are paced from
  somewhere the browser does not hold back.
- **The version's own check is blind to it.** It measures electronics main, which runs on
  the audio clock and was right to the fiftieth of a millisecond. Nothing in it counts a
  sound that begins late. By the record's measure version 1 — made unmuted — has **0**
  sounds late: it was not touched by this.

**The second take.** The mended code was committed first (so that the version names a
clean commit: `ee393c5`); the page's own timers were paced from a worker's, 100 a second,
measured over the whole pass; still muted. `rig.scenario.makeVersion({ name: 'seed-1b' })`,
10.4 minutes.

| `seed-1b`, as made | | version 1 |
|---|---|---|
| length | 606.139 s (29,094,656 frames) | 605.819 s |
| the last sound ends | 600.797 s | 600.808 s |
| the loudest sample | +0.16 dB, 15 over full scale | +0.16 dB, 15 |
| level (RMS) | −22.79 dB | −22.81 dB |
| runs · sounds called | 13 · 848 | 13 · 848 |
| the check: rolled · held | 582.164 · 582.146 s | the same |
| worst stop · start | 0.354 · 2.566 ms | the same |
| blocks lost | 0 | 0 |
| sounds that began late | **0** | 0 |

**Against version 1, sound by sound:** the same 848 called, in the same pages, the same
ways · a sound's start (from START) differs by 8.0 ms at most · its length by 0.1 ms at
most · the thirteen runs by 0.1 ms at most. The same piece, taken again.

**The clicks.**

| hard breaks (a step over 0.12 of full scale) | version 1 | `seed-1b` |
|---|---|---|
| pages 1 … 10 | 6 | **0** |
| page 11 | 53 | **0** |
| page 12 and the play-out | 46 | **0** |

And by the rougher count that takes a sharp attack for a click too (§11) — so that the
pages the override does not touch serve as a measure of the count itself:

| page | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | out |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| version 1 | 117 | 40 | 89 | 6 | 51 | 37 | 60 | 140 | 59 | 192 | 120 | 64 |
| `seed-1b` | 116 | 41 | 80 | 0 | 2 | 42 | 46 | 33 | 41 | 36 | 38 | 3 |

Pages 1, 2, 3, 7 stand where they stood — attacks. Page 6, where the override runs LIVE
on the bus, fell from 51 to 2: the mended unit, heard in a take. Pages 9, 11, 12 and the
play-out fell with their samples. (Pages 4, 8 and 10 moved a little without the override
in them — 6 → 0, 60 → 46, 59 → 41: sounds from the pages beside them ring on into these,
and the grain's small stray is drawn afresh in every take. Not looked into further.)

**Mastered as version 1 was** — `python tools/master.py build/versions/seed-1b`, the
piece's dials (the limiter only): −17.3 LUFS · loudness range 16.3 LU · true peak −1.0 dB
· the limiter worked on 2.06 s of the piece in 48 moments, 1.03 dB at most · of the
samples it did not turn down, 0 changed. → `build/masters/seed-1b/master.flac`.

**The player takes a candidate** — `player/?candidate=<its folder>`: a version made and
not yet kept is put first in the shelf's list, marked "a CANDIDATE — made, not on the
shelf", and its master is played if one is made. (The plan's S5 wants this anyway: "he
listens; the kept ones go on the shelf".) Checked in the running app: the row reads
`seed-1b · a CANDIDATE … · 10:06.1 · mastered · synthesi-alpha · ee393c5`; it holds the
master (29,094,656 frames, its loudest sample at −1.0 dB); and its picture's record
replayed whole — 2,425 moments, 0 errors, the lenses on screen the record's at every one,
848 of 848 sounds seen, nothing left lifted at the end.

**In `live-electronics-engine`:** the mended unit and tool; its own tool, run there,
makes the same sound as here (the largest difference 0.000000); the nine sample files are
the same in both repos, byte for byte; its journal 264, two clips; its
`docs/plan/mastering-stage.md` says what a make page must know. Committed there, not
pushed. The tag `v-alpha-final-draft` is not moved.

**Decided by the AI, told to him.**

- *The take is named `seed-1b`* — the same seed, the samples mended. A made version is not
  written over, so it is not `seed-1`.
- *It is a CANDIDATE, not on the shelf, not in git* (`build/versions/seed-1b/`, its master
  in `build/masters/seed-1b/`): only what he has heard and kept goes there, and he has not
  heard it. Version 1 stays on the shelf as it is until he says.
- *Muting the pass* — the AI's, and the cause of the lost take. The second was muted too,
  with the timers paced.

**Not done, not claimed.**

- **His ear on `seed-1b`** — whether the clicks are gone to HIM, and whether the override
  still sounds as he chose it.
- Whether `seed-1b` goes on the shelf, and whether `seed-1` stays there.
- The make page does not yet pace its own timers, and its check does not yet count late
  sounds: both are named for B5. Until then a version is made by the steps in
  `CLAUDE.md`.
- Timers a second late — what a hidden page that is NOT silent gets — were not measured
  for what they do to a take: the reverb's send is closed by a timer, 0.3 s after a stop
  (`engine/scenario.js`). Version 1 was made that way. `seed-1b`, with its timers paced,
  was not.

**The checks made no sound on his machine** this time, but for a few seconds of the
player.

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ (his eyes and ears pending) · BM ☑ ·
**the clicks: mended and taken again — HIS EAR on `seed-1b` is the next thing** · then
B4.

## §14. His ear: "clicks are gone" — `seed-1b` is kept; version 1 comes off the shelf

**What was put to him** with §13: the player's address for the candidate, two 30-second
files of the same stretch of page 12 (version 1, and `seed-1b`), and two things to listen
for — are the clicks gone on pages 11 and 12; does the override still sound as he chose
it. And: say whether to keep it, and whether version 1 stays on the shelf.

**His answer:** "clicks are gone, keep it, take version 1 off the shelf"

This is the first verdict of his ear on a version in this repo — and on the mended
override. *(Of the override's sound itself he said nothing apart from this.)*

**Done.**

- **`seed-1b` is on the shelf** — `versions/seed-1b/`: its sound, its picture's record,
  its facts and its scenario copied from the candidate, each compared and the same.
- **Its master is kept beside it.** Made once more, from the shelf's copy (so that its
  report names the file it was made from and the tool's commit): `safe.flac` came out
  **the master he had heard, byte for byte**. `python tools/master.py --keep safe
  versions/seed-1b` → `master.flac`, `master.json`; the shelf row plays it.
- **The shelf's list** (`versions/shelf.json`): one row — `seed-1b`, "the final draft,
  taken again — the buffer override's joins mended", his verdict in his words.
- **`seed-1` is off the shelf** — its folder removed from the repo (`git rm`), its row
  gone. It is not lost: it is in git's history, its as-made sound from the repo's first
  commit on; and the same sound file is on his disk in `live-electronics-engine`
  (`build/versions/seed-1/`, compared: the same).
- The candidate's copy in `build/` was cleared, once the shelf's was seen to be the same.

**In the running app:** the player opens on one row — `seed-1b · the final draft, taken
again … · 1 · 10:06.1 · 2026-10-12 · mastered · kept 2026-10-12 — "clicks are gone, keep
it" · synthesi-alpha · ee393c5` — and loads its master: 29,094,656 frames, the loudest
sample at −1.0 dB, 848 sounds in its picture's record.

**What "version 1" means from here.** In this log and the plan it stays the name of
`seed-1`, the final draft's first recording: everything measured on it (§1, §5, §6, §9,
§10) is true of it. What was learned there holds for `seed-1b` — the same piece, the same
848 sounds within 8 ms, the same master's dials — and what was measured afresh on
`seed-1b` is in §13.

**Not done, not claimed.** His eyes on the player's picture — he has listened through
the player and has not said how it looks · what the plan still holds (B4 … B7).

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ · BM ☑ · the clicks ☑ ·
**► B4 the stage set-ups, at his word.**

## §15. B4 — the stage set-ups

His word: "next B4".

**What was put to him.** What it is: the same player on two or three machines — one plays
the sound, the others show the picture only and keep it with that sound. The one thing to
understand: it can be tested here on one machine only, two pages of a browser; a second
laptop or iPad, the house wifi, the network pulled on purpose are his. The top line: the
fixed shape · sound or picture only · GO from any machine · screens keep to the sound · the
trim · measured, and the kit list. How the machines connect: his laptop runs the small
server; any other machine opens its address in a browser, nothing installed. The one
decision — what stops the show:

| | |
|---|---|
| a | ESCAPE on any machine stops everything — the same as GO: one key, from wherever he is. The AI's pick |
| b | only the sound machine can stop the sound — safer against a stray key on a screen, but not from his stage view |

**His answer:** "a but sound machine can have image too right?"

**Answered:** yes — the sound machine shows the picture too; one laptop by itself does
both, as before; "picture only" is for the extra screens. The plan's S4 had it so ("one —
one laptop: sound, projection, his view"). His "a" was taken as the word to build: the
question changed nothing in the design.

**What was built.**

| | |
|---|---|
| `player/sync.js` | the stage: a machine's clock against the small server's; a picture-only machine's clock kept to the sound (`makeFollower`) |
| `player/player.js` · `index.html` | two ways to begin; ENTER and ESCAPE to every machine; the trim; `H`; the fixed shape |
| `tools/serve.py` | `/sync/…` — its own clock, who has the sound, the last few words said |
| `docs/STAGE.md` | the set-ups, the kit, the steps, what was measured |

- **Two ways to begin:** "sound and picture" · "picture only". The sound is fetched only
  where it is played — at that button, not at the pick. A picture-only machine fetches no
  sound and opens no audio at all.
- **Exactly one machine has the sound:** a second one asking is told "ANOTHER MACHINE HAS
  THE SOUND" and may take it with a second click. A machine keeps its name through a
  reload of the page, so the sound machine, reloaded, still has it.
- **ENTER on any machine.** On the sound machine: the sound begins, and it says so. On a
  picture-only machine: it begins at once by its own clock — with no network that IS the
  start, "close, not exact" — and asks; the sound machine begins; its first word sets the
  asker right.
- **ESCAPE on any machine** stops them all (his "a").
- **How a screen keeps to the sound.** The sound machine says where its sound is — at the
  start, a second on, then every two seconds: "at this moment of the server's clock, file
  time τ was heard". A screen brings that to its own clock and compares:
  - inside 8 ms, or inside what its clock estimate may itself be wrong by: nothing;
  - past that: it runs at most 1.5 % fast or slow, aiming to be back in 4 s;
  - it SETS its place — a jump — only at the first word after a start, at the second if
    the score is still at rest (the piece's first three seconds), or when it is more than
    a quarter of a second out.
- **The floor rule:** no word, no change. The loop that listens needs no timer and no
  frame of the page's.
- **The trim:** LEFT / RIGHT, the picture 10 ms later / earlier on that machine; SHIFT,
  1 ms; kept on the machine.
- **`H`:** what the machine knows — its part, the version, the trim, the network, and on a
  picture-only machine how far it stood from the sound at the last word.
- **The fixed shape:** the stage is a box of the form's own shape (the picture's record
  says 1920 × 1080), as large as the window allows, black bars around it.

**Decided by the AI, told to him.**

- *The wire is the small Python server, asked and answered* (a question held open until
  there is news), *not a WebSocket server in Node* — which is what the tubas' brief names.
  The repo needs Python and a browser, and still does; the words are few and none is in a
  hurry: the clock is not carried by the wire, only checked over it.
- *A screen keeps to the SOUND, by the sound machine's own words* — the plan's one
  departure from the brief, kept.
- *The numbers* — 8 ms, 1.5 %, 4 s, 0.25 s — are the brief's "early and tiny", the AI's to
  begin with; his eye may move them.
- *A different version on a screen than on the sound machine is said, not refused.*
- *The trim on the arrows* (below).

**What was tried, in order — and what it found.**

*1. A screen's clock, with made-up words* (`makeFollower`, by itself, in node; a frame
every 16 ms for 606 s; the sound's clock 30 parts in a million fast):

| | from the sound, once in step | nudged · set | most off its own speed | the largest move in a frame, once the score moves |
|---|---|---|---|---|
| a good network | 2.9 ms mean, 7.0 most | 2 · 2 | 0.22 % | 0.04 ms |
| begun by hand 0.3 s early | 2.8 · 7.1 | 2 · 2 | 0.21 % | 0.03 ms |
| a poor network (clock known to ±15 ms) | 6.9 · 15.2 | 51 · 2 | 0.68 % | 0.11 ms |
| the network gone from minute 1 to minute 9 | — | 1 · 2 | 0.46 % | 0.07 ms — and 16.4 ms out when it came back |
| a sound card 200 ppm fast | 3.7 · 8.5 | 13 · 2 | 0.24 % | 0.04 ms |
| no word at all | runs alone | 0 · 0 | 0 | 0 |

*(First the second SET was allowed on any second word: with the words a second apart in
the test's first form it fell after the score had begun to move — a jump of 2.8 ms, 17 on
the poor network. It is now allowed only while the score is at rest.)*

*2. The fixed shape, in the running app.* A window of 1024 × 768 gives a stage of
1024 × 576, 96 px down, black around. From its centre to its edge: 7.619 s of score — the
form's own 7.62. `seed-1b` replayed in it, 1,213 moments: 0 errors, the scroll on its line,
the lenses the record's, every cursor on its read, 848 of 848.

*3. The server, as it was, could not tell a clock.* A machine's question came back in
300 ms — its clock known to ±151 ms. Two causes, both this server's: a new connection for
every question; and `localhost`, which a browser tries on the new kind of address (IPv6)
first, where this server did not listen. Now it keeps a connection open and listens on
both: **a question answered in 1.0 … 2.4 ms, the clock known to ±0.6 … 0.9 ms.** The
workshop was tried again on the changed server — the short pass of page 12: 54 sounds,
rolled 27.341 s, held 27.338 s, 78 blocks, none lost; as before.

*4. Two pages, one with the sound and one with the picture only.*

- ENTER on the picture-only page → the sound began **143 ms** later (the sound's own
  0.1 s of lead and its 40 ms to the ear; the wire, 3 ms). That page had begun at the key
  by its own clock; the sound's first word set it back 142.7 ms — in the first second,
  where nothing moves.
- ENTER on the sound page → the other "began"; the second word set it 0.6 ms; then, word
  by word: 0.00 · +0.21 · −0.03 · +0.07 · −0.33 ms.
- ESCAPE on the picture-only page → both stopped: at 91.649 s and 91.646 s. ESCAPE on the
  sound page → both.
- A picture-only page began in 0.45 s; it held no sound and no audio context.
- A second page asking for the sound: refused, with the sentence above.

*5. By another road* — each page asked, apart, where IT was against the server's clock.
First: **10.2 ms apart.** Not real: the sound page's timers were being paced for the
check on a 10 ms beat (the page is hidden: §13), the sound card hands the page its clock
in steps of 8 and 10.7 ms, and every reading fell at the same stale place. With the
pacing made uneven, as a page's own timers are: **0.26 ms apart**, each clock known to
about 1 ms; and by the screen's own log, from the sound's words: −1.22 … +0.21 ms, the
median 0.00.

*6. The network pulled* — the picture-only page told to stop asking, for 279.7 s. It went
on alone, at its own speed. When it asked again the sound's first word found it
**0.39 ms** out (its own clock estimate, grown stale, then good for ±9 ms; a moment later
±0.75). That is 1.4 parts in a million — ONE machine's two clocks, its sound card's and
its own. Two machines' will differ by more.

*7. One word in thirty came 9 ms stale* (the screen nudged once, 0.2 % for four seconds).
The sound page had kept only two seconds of readings of its clock, and a busy moment left
it only stale ones. It keeps twenty now. *Not measured again over a long run after the
change.*

*8. The trim keys.* `[` and `]` first: the check's keys did not reach them — and on a
keyboard where they are typed with a second key they would not reach them either, since
the page leaves such chords to the browser. Moved to LEFT and RIGHT, which sit where they
sit on every keyboard. RIGHT, RIGHT, SHIFT+LEFT: "the picture 19 ms earlier on this
machine", kept on the machine, and the picture's time 19 ms ahead of its clock while it
played. (Put back to nothing after.)

**Seen on the way, and left.** The browser gives two accounts of what is being heard:
the context's time less its "output latency" (what the player and the workshop use), and
its "output timestamp", which on this machine stands 12 ms later. Which is right cannot be
told without a microphone. The score's lag was set by his eye over the first; the trim is
there for the rest.

**Rejected.** A WebSocket server (above). · A countdown after GO, so that every machine
could begin on one stroke: the piece's own first three seconds are that countdown — the
score stands still — and the sound should begin when he presses. · Correcting the sound
toward anything: never (his, engine journal §254).

**Not done, not claimed.**

- **Two real machines.** A house wifi, an iPad, a projector's delay, a real network
  pulled, Safari, Firefox: none tried. Windows will ask, the first time, whether Python
  may be reached from the network.
- **Nobody has seen it** — the fixed shape, the bars, `H`: placed, not looked at.
- A screen cannot keep itself awake (that needs a secure address; the laptop's is not
  one): sleep is turned off by hand — `docs/STAGE.md`.
- The small server's other home, his Hetzner share: B6.
- With the files opened from a share and no small server, every machine is by itself —
  by design; not tried.

**The checks made no sound on his machine** (the source was turned to nothing each time).

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ · BM ☑ · the clicks ☑ · B4 ☑ built, on one
machine — **the machines are his** · ► B5 a new seed in one step, at his word.

## §16. His first try: "says another machine has the sound" — the AI's own page was holding it

His words, on trying B4: "says another machine has the sound"

**What it was.** The AI's pane had been left on the player's page after §15's checks. That
page had been the sound machine in the checks; reloaded, it kept its name (so that a sound
machine, reloaded, is still the one with the sound — §15) and sat on its shelf, asking the
server for news every fifteen seconds. To the server it was still there, so it still held
the sound — though it was playing nothing and had not asked to. His click was refused by
a page he could not see.

**Two faults, one the AI's housekeeping and one the design's.**

- The pane was left on the page. It is on another page now, and `CLAUDE.md` says to
  leave it off the player when a check is done.
- A machine held the sound for as long as it was THERE. It holds it now only while it is
  there AS the sound machine: one that has gone, or sits on its shelf again, does not.

**Checked on the running server**, with two made-up machines: A asks, has it · B asks,
refused · A goes back to its shelf · B asks, has it · A asks, refused · A takes it with a
second click. As meant.

**Also mended, seen while there:** the server's count of words began at 0 each time it
was started — a server started again in mid-session would have counted from behind what
the machines held, and they would have taken its words for old ones. It begins at the
clock's seconds now, so it is always ahead.

**Not claimed.** His second try.

## §17. "still" — and then: "it was the other agent, clear now"

His words, after §16's mend: "still" — and, while it was being looked into: "it was the
other agent, clear now"

**What the server said when asked.** The sound was held by a machine named
`reaper5bdebc`; the last words (a play, 42 s of reports, a stop) were another's,
`reaperdre6pa`; and three machines were on the wire — two there as the sound machine, one
with the picture only. None of the names was of this session's making: its pages take
eight letters, and these had twelve, beginning alike. So: other pages, driven by
something else, were using the same small server — and by his word, another agent.

The refusal he saw the second time was therefore RIGHT: another machine did have the
sound.

**A correction to §16.** It says his first refusal was the AI's own page. That page was
there, and by the rule as it then stood it could have been the holder; but the other
agent's pages may have been there as well, and which of them refused him cannot now be
told. §16's mend stands either way: a page on its shelf should not hold the sound.

**Added, so that this can be SEEN next time:** `http://localhost:8733/sync/who` — the
machines on the wire: each one's part, how long since it was heard from, the address it
asks from, its browser, and which has the sound. Read after the server was started
again: one machine, from this laptop, there as the sound machine — his.

**A thing this shows about the design, not mended:** the small server is one room. Any
page that opens the player on it is on the same stage — a second session, a forgotten
tab. For a concert that is what is wanted. For two people (or two agents) trying things
at once on one laptop it is not, and nothing tells them apart but `/sync/who`.

## §18. B4 on his try: "ok works"

His words: "ok works can I continue recording test with other agent and then go for b5"

**What that says, and what it does not.** B4 worked on his try — the first word of anyone
but the AI on the stage set-ups. He did not say what the try was: how many machines, which
ones, whether a second machine or a second page. So: "it works for him", and nothing more
exact is claimed. Two real machines, a house network, a projector stay "not tried" until
he says.

**Answered:** yes — and while the other agent's recording test runs, this session keeps
off the small server and off the player's page: every page on that server is on one
stage (§17), an ESCAPE here would stop a sound there, and a server started again would
cut a recording being sent to it.

**B5's proposal was put to him in the same turn,** to be answered when the other test is
done. Nothing of B5 is built or begun.

## §19. A start without a keyboard — [GO], and a held press to stop

His words: "tablets won't have access to enter, can we come up with another start,"

A thing B4 had not seen: its set-ups put an iPad on the stage as his view, and every
control it built was a key.

**What was put to him:**

| | |
|---|---|
| a | a [GO] button on the resting screen — only on touch screens, so a projected laptop stays clean; gone the moment the piece begins; it starts every machine, as ENTER does. The AI's pick |
| b | tap anywhere on the picture to begin — nothing drawn at all; the risk: a stray touch while the tablet is set on its stand begins the sound in the hall |

And, in either case, to stop: press and hold anywhere for two seconds — a brush of the hand
does nothing. ENTER and ESCAPE keep working where there is a keyboard.

**His answer:** "a, go"

**What was built** (`player/player.js`, `player/index.html`).

- **[GO]** — on the resting picture of a screen that is TOUCHED: a tablet or a phone from
  the first (the browser says its pointer is a coarse one), any other screen once a finger
  has been on it. It does what ENTER does. It is there whenever the piece is at rest — at
  the start, after a stop, at the end — and not while it plays.
- **A held press stops** — two seconds, anywhere, by a finger or a pen; not by a mouse,
  which has a keyboard beside it. A bar fills while it is held, with the words "hold to
  stop". Letting go, or a finger that travels more than 30 px, ends it and nothing
  happens. The browser's own long-press menu is kept off the stage.
- **`?alone`** in the address — the page asks the small server nothing and tells it
  nothing. Made for this very check (another agent was using the stage: §17, §18), and
  kept: it is the way to try the player while something else is on the wire.

**Checked in the running app** — a page begun with the picture only, `?alone`, its touches
made by the check (no tablet was touched):

| | |
|---|---|
| a screen not yet touched | no button |
| after one touch, at rest | [GO] shown |
| [GO] | playing; the button gone |
| a press of 0.6 s | the bar shown while held; let go — still playing, the bar gone |
| a finger that travels 70 px | the hold ended; still playing |
| held 1.5 s | still playing, the bar filling |
| held past 2 s | stopped, at 3.49 s; [GO] back |
| [GO] again | from the top |
| on the stage's wire | no — `?alone` |
| errors on the page | none |

It made no sound (a picture-only page has none) and sent the other machines nothing.

**Not done, not claimed.**

- **No tablet has been touched.** An iPad's own browser, its long-press, its way of going
  full screen: not tried.
- The trim (LEFT / RIGHT) and `H` are still keys only — said to him; not asked for.
- [GO] and the hold going to OTHER machines was not tried again here (it is `play()` and
  `stop()`, the same two that ENTER and ESCAPE call, checked in §15) — the stage was
  another agent's at the time.

## §20. B5 — a new seed in one step

His words: "works, a go for b5" — the tablet's [GO] works on his try (he did not say more),
and his "a" to B5's one decision: the first batch is three candidates, seeds 2, 3 and 4.

**What had been put to him** (§18): what it is — one address makes a whole new version
from a new seed: the samples made, the piece played and recorded, checked, mastered. The
one thing to understand — a browser still has to play the piece, so a version takes about
ten and a half minutes; he opens one address and presses ENTER, and the rest runs by
itself. The top line: the seed in the address · that seed's own samples · the pass, its
timers paced by the page · the check counts late sounds · the master at the end · a first
batch. The one decision — the first batch: a) three, seeds 2, 3, 4, about 35 minutes of
machine time (the AI's pick) · b) he names the seeds, or how many.

**What was built.**

| | |
|---|---|
| `engine/scenario.js` | `&seed=N` in the address; a seed's samples asked for and found; the check counts late sounds |
| `engine/perform.html` | the make page says which seed, and paces its own timers |
| `tools/icy_render.py` · `page_samples.py` | a second word, the seed: another seed's samples are made apart |
| `tools/serve.py` | `/samples?seed=N` · the version's own scenario · the master at the end · nothing made over the shelf |
| `tools/master.py` | `--into`: the master beside a version's sound (and so in the engine repo too) |
| `tools/shelve.py` | a kept candidate → the shelf |
| `player/player.js` | a candidate's own master is played; a spoiled one says so |

- **The seed in the address:** `engine/perform.html?make&seed=7`. The scenario file's own
  seed (1) stays in the file; the address overrides it for that page. Everything the seed
  rolls is rolled from it — the waits, the designs, the sequences, and the samples of
  pages 8 … 12. (`?seed=7` without `make` plays seed 7 live, the same way.)
- **A seed's own samples.** The file's own seed has its samples in the piece
  (`voices/v-alpha/renders/`, in git). Another seed's are made by the server the first
  time a page wants them — `/samples?seed=N` runs the two tools — into
  `build/seeds/seed-N/renders/`, not in git: they are made again from the seed whenever
  wanted.
- **The page paces its own timers** — on the page that makes a version, from a worker's
  (§13's stop-gap, built in). So the tab may sit in the background, and may be muted.
- **The check counts the sounds:** how many were called · how many began more than 50 ms
  after they were asked for · the worst. One late sound and the page says "SPOILED … do
  not keep it"; `tools/shelve.py` refuses it; the player marks it.
- **The step ends with the master** — beside the sound, at the piece's dials; the
  version's facts carry its figures. A take that cannot be mastered is still a take, and
  says so.
- **The version's scenario** carries the seed it was made from.
- **Nothing is made over the shelf:** a name that is on the shelf is refused.
- **`tools/shelve.py <name> --what … --verdict …`** — at his word, with his words: the
  candidate copied to `versions/`, the copy compared with what was made, its row added to
  `shelf.json`, its line to the shelf's table, the candidate cleared. It does not commit.

**Decided by the AI, told to him.**

- *"One step" is one address and ENTER* — not one command. The piece is played by a
  browser, and a browser wants a hand on it before it will sound.
- *A seed's samples are not kept in git, even when its version is.* The version is the
  recording; the samples are made again from the seed by the same two tools.
- *A version's "clean" now means: nothing uncommitted in what MAKES a version* — engine,
  tools, voices, picture — so that the record can be written while a pass runs.
- *The workshop here is no longer the engine's, line for line:* `engine/scenario.js` and
  `engine/perform.html` carry B5's changes and the engine repo's do not; the two sample
  tools carry the seed's second word here only. What must stay the same in both is said
  at the head of each: the override's loop.

**What was tried.**

*1. Seed 2's samples, asked of the server:* made in 20.5 s — pages 8, 9, 10, 11, 12, twenty
sounds and five manifests in `build/seeds/seed-2/renders/`. The piece's own samples were
not touched. Dealt differently from seed 1's, as a seed should:

| page | seed 1 | seed 2 |
|---|---|---|
| 8 | icy decel · 17x · 10x · accel · accel long | icy 15x short · accel · 17x · 10x · decel long |
| 10 | icy decel long · icy accel long | icy accel long · icy decel |
| 11 | override · icy accel · override · icy 10x short | icy 15x short · override · icy 10x · override |
| 12 | three icy + override, two icy | two icy, three icy + override — other icys, other containers |

Breaks in all of seed 2's samples, the small ones too: **0** — the mended override.

*2. A short pass with seed 2* (`perform.html?make&seed=2`; page 12, the stand cut to 4 s).
The page said "THIS PAGE MAKES A VERSION OF SEED 2"; its timers were paced; it read its
samples from seed 2's folder. Made: 32 sounds (seed 1's same pass calls 54 — another
piece of the same piece), rolled 27.341 s, held 27.338 s, **0 sounds late**; mastered
beside the sound (true peak −1.0 dB); its scenario carrying seed 2. The player listed it
as a candidate and took its own master. The test's folder was removed.

**Not done, not claimed in this entry.** The batch itself: §21.

## §21. The first batch: seeds 2, 3 and 4 — three candidates

His "a" (§20): three candidates, seeds 2, 3, 4.

**How they were made.** One at a time, each by the one step — the address with its seed,
[begin], the make — in the AI's pane, hidden, the speakers at nothing; the page pacing its
own timers; from commit `490a306`, clean. Seed 3's and seed 4's samples were made by the
server as each page asked.

| | `seed-1b` (kept) | `seed-2` | `seed-3` | `seed-4` |
|---|---|---|---|---|
| length | 10:06.1 | 10:02.7 | **9:28.4** | 10:05.7 |
| electronics main ends | 582.5 s | 570.7 s | 548.5 s | 566.8 s |
| the last sound ends | 600.8 s | 597.3 s | 563.2 s | 600.6 s |
| sounds called | 848 | 777 | 762 | 691 |
| **sounds that began late** | (0, by its record) | **0** | **0** | **0** |
| worst stop · start | 0.354 · 2.566 ms | 0.354 · 2.646 | 0.354 · 2.449 | 0.354 · 2.613 |
| rolled · held | 582.164 · 582.146 s | 570.668 · 570.650 | 548.456 · 548.439 | 566.780 · 566.762 |
| blocks lost | 0 | 0 | 0 | 0 |
| the loudest sample, as made | +0.16 dB | +0.29 | +0.37 | −0.10 |
| **hard breaks** | 0 | **0** | **0** | **0** |
| the master: loudness | −17.3 LUFS | −14.9 | −16.6 | −18.0 |
| the master: loudness range | 16.3 LU | 19.8 | 18.8 | 16.3 |
| the master: true peak | −1.0 dB | −1.0 | −1.0 | −1.0 |
| the limiter worked on | 2.06 s | 2.52 s | 2.82 s | 0.97 s |

Sounds by page, 1 … 12:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `seed-1b` | 50 | 36 | 47 | 3 | 6 | 6 | 69 | 123 | 144 | 111 | 155 | 98 |
| `seed-2` | 50 | 39 | 47 | 2 | 6 | 7 | 111 | 72 | 139 | 94 | 145 | 65 |
| `seed-3` | 50 | 39 | 47 | 2 | 6 | 7 | 66 | 92 | 117 | 102 | 131 | 103 |
| `seed-4` | 54 | 39 | 47 | 2 | 5 | 7 | 54 | 72 | 78 | 130 | 114 | 89 |

**What the table says.**

- **Each is another playing of the same piece** — other waits (seed 2's, before each run:
  3.0 · 34.8 · 29.9 · 29.4 · 32.5 · 36.5 · 33.6 · 32.0 · 30.3 · 35.4 · 27.4 · 35.4 ·
  28.4 s), other samples, another deal of the sequences. Pages 1 to 6 are nearly the same
  count in all four; from page 7 on the seed deals.
- **The piece is not one length.** Seed 3 is 38 s shorter than the kept version: its
  waits were rolled shorter. "Ten minutes" is nine and a half to ten.
- **They are not one loudness.** −14.9 to −18.0 LUFS — three decibels between the loudest
  and the quietest. The master does not chase a level (his "a", §7: the house's fader),
  so a version louder as made stays louder. Seed 2 is the loudest and has the widest
  range.
- **No clicks, no late sounds, the ceiling held** — in all three.

**Each one's picture record replayed whole in the player** (a picture-only page, kept off
the stage's wire): `seed-2` 1,206 moments, 777 of 777 sounds · `seed-3` 1,137, 762 of 762 ·
`seed-4` 1,212, 691 of 691 — 0 errors, the lenses the record's at every moment, nothing
left at the end. Each is listed as "a CANDIDATE — made, not on the shelf", and plays its
own master.

**Where they are.** `build/versions/seed-2/`, `seed-3/`, `seed-4/` — each whole: the sound
as made, its master and the master's report, the picture's record, its facts, its
scenario with its seed. NOT on the shelf, NOT in git. Full-length copies to carry about:
`build/versions/previews/synthesi-alpha-seed-N.mp3`, sent to him.

**Decided by the AI, told to him:** nothing was shelved — "only a version he has heard and
kept goes onto the shelf".

**Not done, not claimed.**

- **His ear on any of the three.** Whether a version three decibels louder, or half a
  minute shorter, is one he wants: his.
- The one step was run by the AI's pane, not by his hand in his own browser: the address
  and ENTER are his to try.
- The make page's pacing was proven by three passes with 0 sounds late, each hidden and
  muted the whole way — the conditions that lost a take in §13.

**Where the build stands:** B1 ☑ · B2 ☑ · B3 ☑ · BM ☑ · the clicks ☑ · B4 ☑ · **B5 ☑
built; its first batch made — HIS EAR on seeds 2, 3 and 4 is the next thing** · then B6.

## §22. "keep all three" — seeds 2, 3 and 4 go on the shelf; commit, and push

His words: "keep all three, comitt push next?"

**What had been put to him** with §21: the three candidates — length, sounds, loudness, and
an address to hear each — and two things to know first: they are not all one length (seed
3 is 38 s shorter), and not all one loudness (3 dB between seed 2 and seed 4; the master
does not chase a level, as he chose). And: say which to keep, with a few words on each.

**Decided (his):** all three are kept. *(He gave no words on each, and did not say he had
listened: the shelf carries his sentence as it was, and a plain line of fact for what each
is — the loudest and widest · the shortest · the sparest and quietest. The words on what
each IS are the AI's, from §21's table; they are his to replace.)*

**Done.** `python tools/shelve.py seed-N --what … --verdict …`, three times: each
candidate copied to `versions/seed-N/`, six files, each compared and the same as made;
its row in `versions/shelf.json` with `plays: master.flac`; its line in the shelf's
table; the candidate's copy cleared. The tool's line had said "heard and kept" — it says
"the composer's word" now, which is what is known.

**In the running app** (a page kept off the stage's wire): the player opens on four rows —
`seed-1b` · `seed-2` · `seed-3` · `seed-4` — each "mastered", each with its verdict, and
picks each with its own master and its own record (848 · 777 · 762 · 691 sounds).

**The shelf now:** four versions, about 270 MB of sound in the repo's tree (two lossless
files a version); with `seed-1`'s first recording and its master still in the history,
the repo carries about 340 MB. The plan's ceiling was "about a dozen" versions, against
GitHub's guidance of about 1 GB.

**Pushed, at his word** — this repo and `live-electronics-engine` (whose own rule is
commit and push before the session ends).

## §23. The push, as it went; B6's proposal put; a checkpoint

**The push.** Before it, the text about to go public was searched for the addresses of
his machines, keys, passwords, e-mail: none. Then: `synthesi-alpha` `580a4c2..82f0560` (20
commits, about 310 MB new — no file over 40 MB) · `live-electronics-engine`
`5900d65..3da7d96` (4 commits). In both, GitHub's `main` read back as the local one.

**B6's proposal, put to him in answer to his "next?"** — what it is: the last tidy-up, so
that in two years he opens one repo and needs to remember nothing. The top line: 1 the
front page, a final pass · 2 the pointers — this repo, the engine repo and
`composition-system`'s index each pointing at the others · 3 the fresh-clone test — the
repo cloned from GitHub into an empty folder, a version played and one made, nothing
fetched from anywhere else · 4 his Hetzner share. The one decision:

| | |
|---|---|
| a | B6 without Hetzner now — steps 1 to 3; Hetzner its own step when he is ready to sign in. The AI's pick |
| b | Hetzner included now — he says what the share is (plain web space, or a machine that can run a program) and signs in himself |

Said with it: the fresh-clone test will be on THIS machine, in an empty folder; a truly
different machine is his.

**He did not answer it: he asked for a checkpoint** (`/checkpoint`) — the chat is to be
cleared and the same work gone on with. Nothing of B6 is built.

---

## §24. B6: "b" — Hetzner included now; what his share is, found

His words: "b there might be some info about the hetzner in piece 1 string quartet, or
walk me thru the set up"

**Decided (his):** b — B6 takes in Hetzner now, not as a later step.

**Looked for, in order:** "hetzner" across `string_quartet_no1-composer` — five files.
Read: `docs/MAINTENANCE.md` (its server table and its common operations) and two lines of
`docs/SERVER_AUDIT.md`.

**Found — the share is a MACHINE THAT RUNS A PROGRAM, already set up:**

- a Hetzner virtual server, the small kind (CPX11), behind his domain `justinwenloyang.com`
  (through Cloudflare);
- nginx in front, with a certificate (Let's Encrypt); a non-root `deploy` user;
- the quartet lives there as a git clone, its server run by PM2, at
  `/string-quartet-no1`;
- the way in is SSH with a key already on this machine; a deploy is a `git pull` there.

*(Its address and the key's path are in the quartet's docs, not here: this repo is
public.)*

**Not checked:** whether the server answers, whether the key still opens it, how much room
is on it. Nothing was sent to it.

**Put to him next:** what Hetzner is FOR in this piece — the plan's S6 says only "pointers
both ways … on the Hetzner page".

---

## §25. How the Hetzner share is billed; what 270 MB would cost it

Put to him after §24: a) a pointer only — a line on his website linking to this repo (the
AI's pick) · b) the player online. He asked how a) works (one link on the site's home
page; nothing of the piece on the server — where that page lives is not yet looked at),
then: "how the Hertzner share works? I seem to get billed every once in a while … it's
not consistent … I'm surprised that anyone's visiting it at all. And what would be the
impact if it's 270 megabytes?"

**From Hetzner's own documentation** (two web searches, `docs.hetzner.com` and
`hetzner.com` only — his account and his invoices were not looked at):

- a cloud server is billed by the hour, up to a monthly cap, for as long as it EXISTS —
  used or not, switched on or off; visitors do not enter into it;
- billed after the month, not before;
- no invoice is made until the amount owed passes €10 (or three months go by): small
  months add up and are invoiced together. A small server is under €10 a month, so this
  alone gives invoices "every once in a while", each of a different size. If his card is
  not in euros, the exchange rate is a second cause — not checked which currency he pays
  in;
- a CPX11 has 40 GB of disk; traffic out is included up to a limit — at least 1 TB a
  month in the US, more in Europe. Which location his server is in: not checked.

**The 270 MB, worked out (not measured on the server):** under 1 % of a 40 GB disk ·
no change to the bill — disk is in the price · a listener downloads one master, about 35
MB (the shelf's 270 MB over eight files), so 1 TB is about 29,000 listens a month before
traffic costs anything extra.

---

## §26. How the versions reach people — the planning method entered

His words: "can we think about the versions or like a different solution? I don't think
everyone needs to download all the versions every time. So like one possibility is that
we keep some versions on the server and they just get one, or they download the engine
and just need to know to generate a version if they want to use a different one. Um,
I'll take recommendations here."

Taken as a planning question (the plan-item method, phase 1: state and restate).

**Measured** (`ls`, `du`, this machine):

| | |
|---|---|
| one version on the shelf | `master.flac` 32 … 34.5 MB · `sound.flac` (the take) the same · four small files, 0.1 MB with the picture's record |
| what the player fetches to play one | its master and its picture — about 34 MB |
| the workshop and what it makes from (`engine` · `player` · `voices` · `picture`) | about 21 MB |
| the shelf (`versions/`) | 257 MB |
| git's own store (`.git`) — what a clone downloads | 345 MB |

**The answer put first:** to HEAR a version nobody downloads them all — the player
fetches only the one picked. All versions come only with the repo (a git clone).

**Put to him:** his idea read back; the AI's recommendation in three lines (the website
plays one at a time · the repo stays the shelf's safe home, since a server goes when its
bill stops · a performer gets a small download of the player and one version); and the
one question: who is "everyone" — listeners, players taking it to a venue, or both.

**Held aside:** git's history keeps the four versions for good (shrinking it means
rewriting a public history) · the plan's ceiling of about a dozen versions in git · each
version carries two sound files and the player needs only the master.

---

## §27. "Walk me through what's actually happening" — the performance, as it is

His words: "could you simplify for me? … So this would be performers or players, I think
B. Listeners can just watch the YouTube video. … they go to the website and then it
downloads … the begin page … and that sound file is still … 270 megabytes. And then, how
about like the second machine? … What if there happens to be two performances at the
same time and they pick the same version and then the other venue can't get the sound
and picture because it's locked? … walk me through what's actually happening and let's
figure out the right scenarios."

**Answered (his):** "everyone" is the PERFORMERS — §26's b. Listeners: the video (B7).

**Put right, from `docs/STAGE.md`:**

- one version's sound is about 35 MB; 270 MB is the four together;
- today the website plays no part. The performer's laptop holds the piece and runs the
  small server; every machine at the venue opens the player from the laptop, over the
  venue's network; the sound machine fetches its 35 MB once, at [begin]; after ENTER
  nothing is fetched, and nothing goes over the internet;
- a picture-only machine talks to the laptop, not to any website: the sound machine says
  every two seconds where its sound is, and the picture follows;
- two performances at once do not meet — each venue's laptop is its own stage; and a
  file served is never locked.

**A point of theory — where they WOULD meet:** if the stage ran from the website, every
venue would be on one stage — "the stage is one room" (§15, §16), and ENTER in one would
begin the other. So the stage stays on the performer's laptop, and the website has no
part in a performance; at most it points to the download.

**Put to him:** the read-back (performers take the piece to a venue · listeners get the
video · the website plays nothing) and the one question — what a performer downloads:
a) everything, as now, about 345 MB, nothing to build (the AI's pick, while the shelf is
small) · b) the program and the one version picked, about 55 MB, a new thing to build.

---

## §28. "I thought … it was being served from the cloud"

His words: "So the piece isn't served from the share. And number one, they go to the
website to download the piece. Is that what happens? … I think the thing I thought it
was, was it was being served from the cloud."

**Put plainly to him:** it is not served from any cloud. Once, beforehand, the performer
downloads the piece from GitHub; at the venue their laptop runs it and the other
machines connect to the laptop; no internet at the concert. His website has no part
today; with a pointer it links to GitHub.

**Held back:** §27's question (what a performer downloads) — it rests on this way of
doing it. Asked first: is "download once, the laptop runs it" the way he wants, or did he
want it served from the cloud.

---

## §29. B6 is held — "it probably has to be rebuilt"

**Before it**, he asked for the whole walk-through: GitHub against Hetzner, and what a
performer sees after the download. Put to him: for a download the two do the same job (a
place that stores files · a computer he rents, which can also run a program); the piece
is already on GitHub. Then the five steps — download the ZIP · a folder, its README · `python
tools/serve.py` (Python 3, not Node) · http://localhost:8733/player/ · a version,
[begin], ENTER — and more machines by `docs/STAGE.md`. Found on the way: the sound files
are plain git files, no large-file store, so a ZIP from GitHub carries them whole. Not
checked: the ZIP route itself.

His words: "let's hold on this. Maybe you can just assemble the sort of structure for
now. It probably has to be rebuilt. What we're doing in my other repo is figuring out
the performance score, the way all those scores will be served. And so then when I
figure that out, how to … run a notation score and how to link an ensemble, et cetera,
for performance and whatnot, then I'll come back to these or I'll include these into that
build. … So just hold on this for now."

**Decided (his):** B6 is on hold. How this piece reaches performers waits on how all his
performance scores will be served — a notation score, an ensemble linked — worked out in
another repo (not named here).

**Done — the structure assembled, nothing built:** `docs/PLAN.md` B6 now carries who gets
the piece, how it goes as it stands, the website's part, what is open, and its parts when
taken up. §2 of the journal says B6 is held.

**Read by the AI as:** all of B6 is held — the front page and the fresh-clone test too,
since both would change if the way it reaches performers is rebuilt. Said to him, his to
correct.

---

## §30. The stands cut by 30 % — for TENOR 2027's ten minutes

**Prompted by** TENOR 2027 (artistic presentations at most 10 minutes; the work is run from
`paperSubmissions`, its running order step 6). His words: "I want to actually cut down, if
possible, the piece, and then I'll re-record a new piano part." Then, the options laid out
(silences only · shorter stands · whole pages lost · seed 3): "let me manage the cut" —
and he asked, "if we just shorten those … pauses between sections, then will everything else
just automate under it?"

**Answered from the code (not heard):** yes. Every page reads its stand from the one roll
(`standOf`, `engine/scenario.js`): the designed pages begin entries only while the page
stands; the sequence pages deal patterns "just enough to fill the whole page time period";
page 6's override turns once across its stand; a read that has begun plays to its end. Pages
1 … 3 play his pattern lists whole — with a shorter stand more of their tails fall off the
left edge when the score moves on. Nothing is played in again.

**Measured, `seed-1b`:** 10:06.1 as a file, 9:57.5 of sound. The stands after pages 1 … 12:
33.5 · 26.0 · 32.3 · 37.8 · 37.6 · 29.4 · 33.4 · 34.6 · 31.1 · 37.9 · 31.5 · 31.9 — 397 s,
about 6:37. The score moving (13 runs): 182 s. The tail after the last run: 18 s.

**His word:** "lets reduce all by 30%".

**Done:** `betweenWait` 26 … 38 → **18.2 … 26.6** (× 0.7) in
`voices/v-alpha/scenario/scenario-1.json`, its `_about` with it. The waits are one stream of
draws, one draw a stand (`rollLayer1`), so seed 1 gives the same draws: every stand is 70 % of
seed-1b's — 23.5 · 18.2 · 22.6 · 26.5 · 26.3 · 20.6 · 23.4 · 24.2 · 21.8 · 26.5 · 22.1 · 22.3,
278 s. **Expected, not made:** about 2:00 shorter — about 8:00 of sound. The designed pages'
own draws are their own streams and stay as rolled; what they hold changes with the shorter
stand.

**Not done:** the version itself (seed 1, about eleven minutes to make) — his to make or ask
for.

---

## §31. Shorter again — "something like, seven minutes, 15 seconds"

**His words:** "Let's do a little bit more, maybe something like, seven minutes, 15 seconds,
something like that."

**Worked out from `seed-1b` (§30's numbers):** 597.5 s of sound, of which the stands are 397 s;
the rest (the start wait, the 13 runs, the tail) about 200.5 s, and it stays. For 7:15 (435 s)
the stands come to about 234.5 s: × 0.59 of seed-1b's.

**Done:** `betweenWait` 18.2 … 26.6 → **15.34 … 22.42** (26 … 38 × 0.59), its `_about` with it.
Every stand 59 % of seed-1b's — 19.8 · 15.3 · 19.1 · 22.3 · 22.2 · 17.3 · 19.7 · 20.4 · 18.3 ·
22.4 · 18.6 · 18.8, 234 s. **Expected, not made:** about 7:15 of sound, about 7:24 as a file
with its silences. The tail after the last run (18 s in seed-1b) may move with page 12's shorter
stand.

**Not done:** the version itself.

---

## §32. The cut made — `seed-1-cut`

**His words:** "You make the version from seed 1 in your pane, with the sound muted."

**Done, as CLAUDE.md's machine notes say:** committed first (`8726526`, clean) · his server
already up on 8733 · `engine/perform.html?make&seed=1` in the AI's pane · [begin] ·
`rig.engine.out.gain.value = 0` · `rig.scenario.makeVersion({ name: 'seed-1-cut' })`. Before
it ran, the page's roll read: `standOf(1)` 19.78 · `standOf(2)` 15.36 · `standOf(12)` 18.80 —
§31's numbers.

**Measured (`build/versions/seed-1-cut/`, a candidate, not on the shelf):** 7:34.6 as a file
(454.6 s) · the first sound 0:03.0, the last ends 7:29.4 — **7:26.4 of sound** · 13 runs, 13
stops · 543 sounds (seed-1b: 848) · `soundsLate` 0 · gaps 0 · peak 0.16 dB, 5 samples over ·
mastered: −17.0 LUFS, true peak −1.0 dB. The stands as made: 19.8 · 15.4 · 19.1 · 22.3 · 22.2 ·
17.3 · 19.7 · 20.4 · 18.4 · 22.4 · 18.6 · 18.8.

**Against §31's 7:15:** 11 s long. The tail after electronics main ends is 30.0 s (seed-1b:
18.3 s): with page 12's stand shorter, the play-out run comes sooner and page 12's reads ring on
past it. Not looked into further.

**Sent to him:** `build/versions/previews/synthesi-alpha-seed-1-cut.mp3` (the master, 192 kb/s).
The player: http://localhost:8733/player/?candidate=seed-1-cut . **Not done:** his ear; the
shelf (`tools/shelve.py`, at his word).

---

## §33. Every icy sound 6 dB down

**His words:** "all of the time stretch/icy ones can we turn the level down? how involved is
this like -6db" — and, told what it takes: "Yes, turn all the icy ones down 6 dB, then make a
new version."

**Where icy is, read from the scenario and the manifests:** live reads under an icy overlay on
pages 4 and 5; pre-made renders on page 8 (all five, `tools/icy_render.py`), 10 (two of five),
11 (two of four) and 12 (all five, three of them with the override as well) —
`tools/page_samples.py`. No icy on pages 1 … 3, 6, 7, 9 (no played-in pattern names one).

**Two roads, the one taken:** the icy's `makeupDb` 9 → 3 would not do it — the playhead's
`makeup` has `minValue: 1` (0 dB), and on page 5 the dwell is taken off the makeup, so some
reads would fall less than 6 dB; and the renders are levelled to their containers by their own
tools. Put to him as "remake the renders 6 dB down"; done instead AS IT PLAYS, the same in the
sound and with the files left as they are:

- `levelDb: -6` on each of the eight icy presets (`voices/v-alpha/scenario/scenario-1.json`),
  the overlays' `_about` with it;
- `engine/voices.js` — `icyLevel(name)`, the preset's `levelDb` as a gain, on the three paths
  a sound takes: `sing` (a live read — the voice's own gain, after the makeup), `singRender` (a
  phrase or a container from a render — the manifest's `icy` names the preset) and `strike` (an
  attack read from a render).

**Not checked:** how it sounds; a version made with it — next.

---

## §34. `seed-1-cut-icy6` made — the cut with every icy sound 6 dB down

**Done:** §33 committed (`bcd82e7`, clean) · the make page reloaded (the server says no-store)
· [begin] · gain 0 · `makeVersion({ name: 'seed-1-cut-icy6' })`. Before it ran: `standOf(2)`
15.36 (§31's stands) · page 8's renders loaded with their icys named (icy decel · icy 17x · icy
10x · icy accel · icy accel long) — what `icyLevel` reads.

**Measured (`build/versions/seed-1-cut-icy6/`, a candidate):** 7:34.5 as a file · 7:26.4 of
sound · 543 sounds (as `seed-1-cut`: the same roll) · `soundsLate` 0 · gaps 0 · peak −0.06 dB ·
RMS −24.72 dB (`seed-1-cut`: −22.56) · mastered −18.8 LUFS (`seed-1-cut`: −17.0), true peak
−1.0 dB. The whole is 1.8 LU quieter with the icy alone turned down — the trim took. The master
holds a ceiling only; it does not bring the loudness back up.

**Sent to him:** `build/versions/previews/synthesi-alpha-seed-1-cut-icy6.mp3`. The player:
http://localhost:8733/player/?candidate=seed-1-cut-icy6 . **Not done:** his ear; the shelf.

---

## §35. To 6:30 — "let's trim to 6.5"

**His words:** "Okay, let's trim to 6.5, please." Read as 6:30 of sound.

**Worked out from the two made cuts:** the sound is about 231 s + the stands after pages 1 … 11
(`seed-1b`: 597.5 = 232.4 + 365.1 · `seed-1-cut`: 446.4 = 231.0 + 215.4). Page 12's stand
hardly counts: its reads ring on past the play-out, so its stand and the tail together stay
near 49 s (31.9 + 18.3 · 18.8 + 30.0). For 390 s: 365.1 × f = 159 → f = 0.4355.

**Done:** `betweenWait` 15.34 … 22.42 → **11.32 … 16.55** (26 … 38 × 0.4355), its `_about`
with it. The stands: 14.6 · 11.3 · 14.1 · 16.5 · 16.4 · 12.8 · 14.5 · 15.1 · 13.5 · 16.5 · 13.7
· 13.9. **Expected, not made:** about 6:30 of sound.

---

## §36. `seed-1-cut630` made · the icy reads of pages 4 and 5, read

**Made** (`27db59d`, clean; muted): 6:27.5 as a file · **6:19.2 of sound** (§35 aimed at 6:30) ·
415 sounds · `soundsLate` 0 · gaps 0 · −18.5 LUFS, true peak −1.0 dB. The stops: 0:12.2 · 0:40.0
· 1:06.1 · 1:37.4 · 2:08.3 · 2:38.3 · 3:08.7 · 3:36.8 · 4:09.2 · 4:35.0 · 5:10.1 · 5:36.4 · 5:58.0
(the end of electronics main). The tail 24.2 s (`seed-1-cut`: 30.0): page 12 got one whole
container through icy this time — set 49, icy 17x, 45.6 s, 5:36.6 … 6:22.2 — and it IS the
ending. 11 s under §35's sum: its "page 12's stand and the tail stay near 49 s" held for two
versions, not for this one. Sent: `build/versions/previews/synthesi-alpha-seed-1-cut630.mp3`.

**His question:** "can you tell me about the ICs on 4 and 5 … how do they get their length and
what would be the best way to shorten them? It looks like it plays through a whole container.
So maybe just start it later in the container and let it end on the end of the container."

**How long a read is** (`readOf`, `engine/voices.js`): the stretch of score it reads × the
icy's factor — icy 10x, 10x short ×10 · 15x short ×15 · 17x ×17 · accel, decel ×5.1 (ln 10 /
0.45) · accel long, decel long ×11.0 (ln 12.5 / 0.23). He is right: page 4 reads WHOLE
containers (16 … 19: 2.86 · 3.98 · 2.47 · 2.95 s), page 5 the part of each container on its
screen (20: 5.16 · 21: 2.65 · 22: 3.24 · 23: 4.17 s), start to end — end to start, reversed.
How many enter (`rollDesign`): only while the page stands, the next when the one before is
`enter` of its way through (page 4: 40 %; page 5: 10 %, 15 %, 20 % …).

**In this version:**

- page 4 (stops 1:37.4, stand 16.5): ONE read — set 17, icy 15x short, 59.7 s, 1:37.6 … 2:37.3;
  a second would enter at 40 % of it, 23.9 s, after the stand. It sounds through page 5 and
  ends inside the run to page 6.
- page 5 (stops 2:08.3, stand 16.4): three — set 21 reversed, icy decel, 13.6 s, 2:08.5 … 2:22.1
  · set 22, icy decel long, 35.6 s, 2:09.7 … 2:45.2 · set 20 reversed, icy accel long, 56.7 s,
  2:14.3 … 3:11.0 — past page 6 (stops 2:38.3) and page 7's stop (3:08.7). A fourth (set 23)
  would enter after the stand.

**Put to him, the AI's (his to choose):** a. HIS — start later, end where the read ends now:
the same speed and grain, the same ending; the read's beginning is lost (a reversed read keeps
its end too, the container's START). With the rule "a read ends by the next page's stop":
set 17 → 30.7 s (the last 2.05 s of 3.98) · set 22 → 28.6 s (2.6 of 3.24) · set 20 → 24.0 s
(2.2 of 5.16) · set 21 as it is. Shorter reads let more ENTER (page 4's second at 40 % of
30.7 = 12.3 s, inside its stand). b. a smaller factor (×15 → ×7): the same span, half the
time — the icy itself changes. c. a fade at a set time: the beginning kept, the ending lost.
d. as it is: one icy bridge over pages 4 … 6. **The AI recommends a**, with that rule.

---

## §37. Pages 4 and 5 — the icy reads begin later, and end by the next stop

**His words:** "a but can you leave p12? its fine how it is" — §36's road a, on pages 4 and 5.

**Done:**

- `endBy: "next stop"` in the designs of pages 4 and 5 (not 12), page 4's `_about` with it.
- `engine/scenario.js` `rollDesign`: the next stop, in seconds after the page's own stop, is
  its stand + the run to the next page's stop. A read that would sound past it begins later —
  by as much of its span as it is too long (a read's time is its span × the icy's stretch) — and
  ends where it ends whole: a plain read on the container's end, a reversed one on its start.
  The event carries the `span` it reads; its `lasts` is the cut read's, so the next entry comes
  that much sooner. `cutTo` gives the cut read an id of its own for the dwell; the event keeps
  the container's id (the picture's hue).
- `spanned(lookup)` — a designed page's lookup reads an event's span; `engine/patterns.js`
  hands the event to the lookup (`lookup(e.id, e)`; the other lookups ignore it).

**Expected from §36 (this version's stands):** page 4's set 17 59.7 → 30.7 s, page 5's set 22
35.6 → 28.6 s and set 20 56.7 → 24.0 s, set 21 as it is — and, the reads shorter, more of them
may enter. To be read from the roll before the take is kept.

---

## §38. `seed-1-cut630-icy45` made — §37 in the sound

**The roll, read 5 s into the take** (`designOf`): page 4 — set 17 plain, icy 15x short,
30.93 s, span 52.287 … 54.35 (the last 2.06 s of 50.37 … 54.35) · set 19 reversed, icy 10x,
enters at 12.93 s, 18.00 s, span 56.82 … 58.62 (the first 1.80 s of 2.95) — TWO reads (§36:
one). Page 5 — set 21 reversed, icy decel, 13.56 s, whole · set 22, decel long, 28.86 s, span
69.442 … 72.07 · set 20 reversed, accel long, 25.08 s, 61.016 … 63.3 · set 23, accel, 19.79 s,
72.377 … 76.244 · set 22 reversed, accel long, 15.07 s, 68.83 … 70.202 — FIVE reads (§36:
three). Every cut read ends on the next stop (page 4: 30.93 · page 5: 29.98 … 30.00 s after its
own); page 4's still sounding at page 5's stop: 0.003 s.

**Made** (`75daf5c`, clean; muted): 6:27.4 as a file · 6:19.2 of sound (as §36: the end is page
12's, untouched) · 418 sounds · `soundsLate` 0 · gaps 0 · −19.0 LUFS, true peak −1.0 dB. In the
take: page 4 1:37.6 … 2:08.6 (page 5 stops 2:08.3) · page 5 2:08.5 … 2:38.5 (page 6 stops
2:38.3). The icy of pages 4 and 5 is over by 2:38.5 (§36: 3:11.0).

**Sent:** `build/versions/previews/synthesi-alpha-seed-1-cut630-icy45.mp3`. The player:
http://localhost:8733/player/?candidate=seed-1-cut630-icy45 . **Not checked:** how a read that
begins inside a container sounds at its start — his ear.

---
