# Sýnthesi Alpha — the plan of the standalone piece

> **THIS IS THE LIVING COPY** (from 2026-10-12). Carried from
> `live-electronics-engine/docs/plan/v-alpha-standalone-plan.md` at its
> commit `3d75010`, where it was agreed with the composer one step at a
> time. The copy left there is frozen.
>
> **A `§N` in this file is the ENGINE's journal** — `docs/history/journal/`
> — unless it says "log §N", which is this repo's `docs/RUNNING_LOG.md`.
> "He" and "his" are the composer.

> **The piece is named *Sýnthesi Alpha* (his, §257, §259); its repo
> is `synthesi-alpha`, public (§258) — on GitHub since 2026-10-12
> (log §3).** "v-alpha" is the name of
> the VOICE it is made from (§256).
>
> **THE PLAN IS WHOLE — 2026-10-12 (§259).** All six steps agreed and
> written. Nothing is built. The order below is the order of DECIDING;
> the order of building is its own question.

*Opened 2026-10-12 (journal §248, §249), by J's planning method: the
top line first, then one step at a time, each written here the moment
it is agreed.*

**The goal (his words, §248):** "a standalone performance version
that's flexible to ... different tech" · "a repo that's focused on
just this piece and is able to generate different versions".

What the piece is today — its parts, its audio, its seed:
[`docs/history/v-alpha-what-the-piece-is.md`](history/v-alpha-what-the-piece-is.md) — as it stood in the engine.

## The build order

The AI's (§260), put to him — his to change. Not the order of deciding.

- **B1 ☑ Make a version** (S2) — built in the engine, carried here. **Version
  1 = seed 1, the final draft, made and checked (§260).**
- **B2 ☑ The piece's repo, on this machine** (S6, first half) —
  `synthesi-alpha` made by the protocol's kit, LEAN (his "a", §261);
  the piece and the workshop copied in and tried; version 1 on its
  shelf. **Public and pushed 2026-10-12, with the licence — at his
  word, ahead of B6 (log §2, §3).**
- **B3 ☑ The player, and the shelf it opens on** (S3 · S5) — written
  here: `player/`. Built and checked by numbers (log §5): version 1
  replayed whole, and the replay held against the workshop's live
  picture. **How it looks and sounds is his to say — pending.**
- **BM ☑ The master** (S7) — put in here at his word, 2026-10-12 (log
  §6 … §9): a mastering pass on a version's sound, for the hall.
  ☑ Built: the tool, version 1's four candidates, the listening page,
  the player's part; the same in the engine repo. **Version 1's master
  is kept — `safe`, his "a" (log §10) — and the player plays it.**
- **B4 ► The stage set-ups** (S4) — the small server, screens that keep
  to the sound, the trim, the fixed shape; measured.
- **B5 A new seed in one step** (S5) — the seed in the address, the
  samples a seed; a first batch of candidates. **The step ends with
  the master, at the piece's dials (S7.5).**
- **B6 The repo finished** (S6) — the front page, the pointers, the
  fresh-clone test; ~~public at his word~~ ☑ done early (log §3);
  Hetzner, his sign-in.
- **B7 The video** (S3's fallback).

## The top line

Order confirmed by him (§249): "order is good".

1. **S1 What is live** — does anything answer the player in the moment
2. **S2 What a version is** — a recipe played · files triggered · one finished recording
3. **S3 What plays it** — a web page · a web page from his server · a SuperCollider standalone
4. **S4 The stage set-ups** — one laptop · two or three machines kept together
5. **S5 The versions** — how many are kept, as what, how a new one is made
6. **S6 The piece's own repo** — what moves there, what stays here, where the recording lives
7. **S7 The master** — added 2026-10-12 (log §6): the target · the source · the stage · his ear · where the master lives · the same stage in `live-electronics-engine`

"I come to the venue with what?" is not a step: it is the kit list
that falls out of S2, S3 and S4.

## The steps

**S1. What is live** (nothing — decided by him, §249) ☑

- v-alpha is the final draft as it stands. His words: "It's all,
  everything that's in the final draft is what I'll use. I'll press
  play on stage and play along with the electronics, but there's no
  open mic or interactive electronics."
- No microphone. No interactive lane. Nothing answers the player in
  the moment.
- Live input belongs to a later piece ("V beta"), made from the
  engine repo, which keeps everything that made v-alpha.
- *Why it came first:* it caps how far a version can be pre-recorded.
  With nothing live, a version can be a finished recording.

**S2. What a version is** (one finished recording, made by the engine
from a seed — agreed by him, §250: "a is good") ☑ built (§260); the
picture's record replayed in B3 (log §5)

Result when done: a version of v-alpha is a folder you can hold — one
finished sound file, the record of what the picture did, and the seed
that made it. The engine is the workshop that makes versions, at home.
On stage a machine only plays a sound file and draws; nothing is
computed in time.

- ☑ The engine gets a "make a version" pass — it plays the piece from
  START and records its own output, uncompressed, into one sound file.
  *(§260: `perform.html?make`, ENTER; engine/version-recorder.js ·
  version.js · tools/serve.py `/version-…`.)*
- ☑ The same pass writes down what the picture did — where the score
  was, which marks moved, when. *(`picture.json`. Replayed by the
  player, B3 — log §5: it holds what the picture did.)*
- ☑ A version is a folder: the sound file · the picture's record · the
  seed and the scenario that made it. *(`build/versions/seed-N/` —
  candidates; not in git.)*
- ☑ Seed 1 is made first — the final draft becomes version 1. *(§260:
  35.0 MB FLAC, 10 min 05.8 s; the last sound at 10 min 00.5 s.)*
- ☑ Version 1 is checked against the final draft: same length, same
  stops. *(Rolled 582.164 s, held 582.146 s; the twelve page stops
  0.000 ms off; 0 blocks lost.)*
- *Done with it, not asked for (§260):* the waits are on the AUDIO
  clock now — a run begins at "the stop + the wait" in the worklet,
  no timer between. A recording pass left in the background would
  otherwise stand each page up to a second long.
- *Why this and not the others:* his "sampler" (every sound a file,
  triggered) has more to go wrong on stage and buys nothing while
  nothing answers the player — it is the form for the day something
  does; the engine computing on stage, as now, needs the strongest
  machine for no gain. A finished recording also freezes the two
  things the seed does not reach (§246, §247).

**S3. What plays it** (a web page; a video as fallback — agreed by
him, §251: "a") ◐ the player page built (B3, log §5); the Hetzner
share and the video not

Result when done: one player — a web page that plays a version's sound
file and draws the picture from its record, both off one clock, with
no engine inside. The same page runs from a folder on his laptop with
no internet, and from his Hetzner share for anyone with the link. For
a machine that can do neither, any version can be printed as a video
file.

- ☑ A player page — loads a version; [begin], then ENTER; sound from
  the one file, picture from the record. *(`player/` — log §5. ENTER
  plays from the top, ESCAPE stops; a second ENTER while it plays does
  nothing. The sound is loaded whole before [begin]: after ENTER
  nothing is fetched. Starting from a page was offered and not taken —
  his "a".)*
- ☑ It runs from a folder on his laptop, with the small server, as
  today. *(http://localhost:8733/player/)*
- The same folder goes on the Hetzner share — opened by link.
- A way to print a version as a video file — 1920 × 1080, picture and
  sound together. (How is not known yet: the picture has to be
  captured frame by frame.)
- *Why this and not the others:* the page draws the picture he
  approved, sharp at any size, and a version stays small; the video
  covers his own case, "a laptop from the venue that runs video". A
  video ONLY would fix the picture at one size and soften it.
  SuperCollider falls away for v-alpha: with a finished recording
  there is nothing for it to compute, and it cannot draw the picture.

> **PLACEHOLDER — the animation engine may be revisited (his, §251).**
> "With my other pieces, we're creating performance versions. And I
> know part of that will be a discussion of how to optimize the
> animation smoothness. The tests so far are fine for this one, but
> let's just have a placeholder if those conversations reveal
> something useful here for animation playback, we could revisit the
> animation engine." Nothing to do now. When the other pieces'
> performance-version work finds something about smooth playback, look
> here again before the player page is called finished.
>
> *First pointer (§253):* `for_seven_tubas/docs/ENGINE_BRIEF.md` §2 C
> and §8 — for its concert stand that repo ruled a pre-rendered video
> kept to the clock by a frame servo, and measured it (a 12.5-minute
> piece at 1080p60 ≈ 80–100 MB). Not acted on — his: "I don't want to
> solve the smoothness problem now."

**S4. The stage set-ups** (one sound machine; every screen keeps to
its sound; nothing stops if the network does — agreed by him, §254) ☐
not built

Result when done: the sound comes from ONE machine, always. Every
screen — the sound machine's own, the projection, his view on stage —
runs the picture on its own clock and keeps it to where the sound is.
The network says GO once, and after that only nudges; if it drops,
every picture goes on playing. His set-ups are this one arrangement
on one, two or three machines.

His words (§254): "the thing to accomplish is really just to get
everyone's video to sync with the audio" · "if the video falls out of
sync with the audio a little bit, it's not ideal, but it's not the end
of the concert. However, if video playback stops altogether when the
network drops, then that's a problem" · "I don't think it needs to be
overwrought" · "I ... wouldn't want more than one audio to be
coordinated".

- The set-ups, named:
  - *one* — one laptop: sound, projection, his view.
  - *two* (the common one) — the venue's machine: sound + projection ·
    his laptop or iPad on stage: his view.
  - *three* — a laptop at the desk: sound · a video machine:
    projection · an iPad on stage: his view.
- One sound machine — the player has a sound switch; exactly one
  machine has it on. No second sound is ever coordinated.
- GO — one message, from any machine (his, on stage); every machine
  starts by its own clock.
- Pictures keep to the sound — the sound machine reports where its
  sound really is; each screen closes in on that, early and tiny,
  never a jump. **The sound itself is never corrected.**
- The floor rule — the network gone, or looking wrong: each screen
  runs on its own clock. Nothing stops.
- The small server — one program, two homes: his Hetzner share · a
  laptop on the house network (or, the rare case, his own router).
- No network at the start — each machine can be started by hand.
  Close, not exact.
- A trim on each screen — the picture earlier or later against the
  sound (a projector delays its picture; software cannot know by how
  much).
- The picture keeps its 1920 × 1080 shape on every screen, bars
  filling the rest — the form was cut to that screen (§214), and a
  page must be the same page on any projector.
- Measured, and shown to him: how far each screen is from the sound —
  with the network, and after it is pulled.
- The kit list — for each set-up: what he brings, what the venue
  gives.
- *Where the design is taken from:* `for_seven_tubas/docs/
  ENGINE_BRIEF.md` §3 — the one-tuple sync, "after GO, zero network
  needed", THE FLOOR RULE (summarised in journal §253). The smallest
  thing that obeys it is built here — no rooms, no parts, no portal;
  that repo's test-kit clock borrowed where it fits; v-alpha moves
  onto the shared server when it exists. *One departure, and why:*
  there every stand keeps to the server's clock; here every screen
  keeps to the SOUND, because the sound cannot be nudged and is the
  thing the audience hears the picture against.

**S5. The versions** (a shelf of a few kept versions; one step makes
another — agreed by him, §255) ◐ the shelf and its list built (B3,
log §5); a new seed in one step not (B5)

Result when done: v-alpha has a shelf of versions — a few, each a
folder named by its seed, each heard and kept by him — and one step
that makes a new one from a new seed in about ten minutes. Version 1
is the final draft. On stage he picks a version, then GO.

- Every version that goes on stage has been heard by him first (his,
  §255: "I don't think I need for it to be B"). The workshop stays
  home; he travels with the shelf.
- "Make a version" as one step — give a seed; the samples are made,
  the piece is played and recorded, the folder is written.
- The recording IS the version. The seed is its label — not a promise
  that it can be made again sample for sample (§246, §247).
- The sound file is kept LOSSLESS and packed (FLAC). A plain WAV of a
  version is 112 MB and GitHub refuses any file over 100 MB. Packed:
  an estimate of 25–65 MB — measured when version 1 is made. (The
  recording itself packs from 35.0 to 7.2 MB, measured §255; a version
  is louder and busier.)
- Only KEPT versions go into git. Candidates are made in a folder git
  ignores. Git never forgets: a version put in and thrown out later
  takes its space for good.
- How many: "just a few to actually hold" (his). The ceiling for the
  repo: about a dozen (0.3–0.8 GB, against GitHub's guidance of
  about 1 GB).
- ☑ The shelf — a list: seed · length · the date made · his verdict ·
  what made it (the workshop's commit). *(`versions/shelf.json` — log
  §5; the rest is read from each version's own `version.json`.)*
- ☑ The player opens on the shelf, and loads ONLY the version picked —
  its sound file and the picture. Never the others. *(B3, log §5.)*
- A first batch of a few candidates; he listens; the kept ones go on
  the shelf.

**S6. The piece's own repo** (`synthesi-alpha`, public; one repo holds
all; nothing to remember — agreed by him, §259: "S6 is good") ☐ not
built

Result when done: the piece has its own repo that holds all of it —
the recording, the picture, the workshop that makes versions, the
player, the kept versions — and a front page that says in a few lines
how to play it and how to make a new one. In two years he opens one
repo and needs to remember nothing. The engine repo keeps everything
it has; the two point at each other.

His requirement (§255): "I won't remember where everything is. So
let's say I play this once and then in two years time I play it
again. I ... won't have remembered that the generator is in this
other repo ... So we'll just need some things to connect everything."

- Made by the new-piece protocol's step "The repo and its kit"
  (`composition-system/protocol/NEW_PIECE_PROTOCOL.md` §2): under
  `github.com/elosine` · the name `synthesi-alpha` (his, §257, §259) ·
  PUBLIC (his, §258) · the push rule asked when it is made · the
  record docs from `composition-system/skeletons/`. Its profile: a
  start from a sandbox — this engine.
- Copied over, the piece — the recording, packed lossless (7.2 MB,
  §255: it simply goes into git) · the picture and the tool that draws
  it · the map of the recording · the scenario · his nineteen
  sequences · the grain windows · the final draft's samples.
- Copied over, the workshop — the engine's playing parts · the sample
  tools · "make a version" (S2). A FROZEN COPY, not a shared module:
  a finished piece must not change when the engine moves on, and a
  linked module is what gets forgotten in two years.
- New there — the player (S3) · the shelf of kept versions (S5) · the
  small sync server (S4).
- Stays here, not copied — the labs · the play-in · the other voices
  · the corpus.
- The front page — to play it · to make a new version · what each
  folder is · where it came from.
- The names, said on the front page — the piece is *Sýnthesi Alpha*;
  the voice it is made from is v-alpha (§256).
- The record — the journal's v-alpha days travel as a frozen copy,
  with this plan and `docs/reference/v-alpha-what-the-piece-is.md`.
- Pointers both ways — in this repo · in `composition-system`'s
  INDEX · on the Hetzner page.
- His to say — whether anything is personal and stays out of a public
  repo.
- The test that says it is done — a fresh clone, on another machine,
  plays version 1 and makes a version, with nothing fetched from
  anywhere else.

**S7. The master** (a mastering pass on a version's finished sound, for
the hall — his, 2026-10-12, log §6 … §10) ☑ built, and version 1's
master KEPT — `safe`, the limiter only: his "a" (log §10). Left:
"a new seed in one step" (B5) to end with the master

*How it was agreed:* the question and the target are his (log §6, §7:
"a" — the hall). The top line below is his too ("yes"). The sub-steps
are the AI's, at his word — "I don't need to see the steps, write plan
or go with build if plan done" (log §8). **Each is his to reverse.**

Result when done: every version on the shelf has a MASTER beside its
sound as it was made — the same take, the same length, made safe and
clean for a hall's PA: nothing over −1 dB, the top softened if his ear
wants it, the pages evened only if the quiet ones get lost. One tool
makes it from the finished file, at dials he has set once by ear. The
player plays the master. The same tool is in `live-electronics-engine`.

**S7.1 The target** (what "mastered for the hall" means, in numbers) ☑

- The ceiling: the true peak is never over −1.0 dB.
- Loudness is NOT chased — no target level. "Loudness is the house's
  fader." *(Corrected at the build, log §9: the compressor, when it is
  on, is made up to the loudness the file was MADE at — or it would
  only make the file quieter. Nothing is made louder than it was.)*
- The low-pass and the compressor are DIALS: off, unless his ear turns
  them on. The limiter is always on.
- Measured before and after, and written beside the master: loudness
  (LUFS), loudness range, true peak.
- *Why:* a concert file is turned up by the house. What it must not do
  is clip, or lose its quiet pages.

**S7.2 The source** (the kept version's own sound file) ☑

- The master is made FROM `sound.flac`, the version as it was made.
  The piece is NOT played again: another take is another version (the
  hall of the reverb is drawn fresh each time).
- `sound.flac` is never written over. The master is a second file
  beside it.
- Same length, same rate, not moved by a sample — so the one picture
  record fits both.
- The workshop is not changed. (Its "safety limiter" lets peaks past
  −1 dB, and 15 samples of version 1 were clipped at packing: log §6.
  The master's limiter is what holds the ceiling.)
- *Why:* "The recording is the version."

**S7.3 The stage** (`tools/master.py` — file in, file out) ☑ built,
self-test passing (log §9)

- The chain, in order: the low-pass → the compressor → the limiter →
  16 bits, packed lossless.
  - the low-pass: 12 dB an octave, no phase shift.
  - the compressor: both channels as one, on the sound's running
    level, a soft knee.
  - the limiter: looks ahead, both channels as one, reads the true
    peak, cannot overshoot.
- Nothing in it moves the sound in time.
- With only the limiter on, every sample it does not turn down stays
  the sample it was.
- It needs only what the repo already needs: Python with `numpy` and
  `soundfile`, and `ffmpeg`.
- A self-test (`--selftest`): the ceiling held on a tone 6 dB over ·
  nothing changed under it · the low-pass's curve · the compressor's
  curve · no shift in time.
- A report beside every master: the dials, the figures before and
  after, what the limiter and the compressor did.
- *Why this and not the others:* the browser's own compressor is the
  "safety limiter" that does not hold; SuperCollider has the real bus
  (piece 6) but this repo does not need SuperCollider; Reaper by hand
  is forgotten in two years and has to be done again for every seed.

**S7.4 His ear** (the dials set by listening) ☑ his: "a" — `safe`,
the limiter only; the low-pass and the compressor stay off (log §10)

- A few candidates, SCREENED BY MEASUREMENT FIRST (the engine's choice
  methodology): a choice is offered only if it moves something by more
  than a just-noticeable difference.
- Made into `build/masters/<version>/` — candidates, not in git.
  *(Version 1's four: `safe` · `softened` · `evened` · `evened-more`.
  The screen's finding: the piece is already dark — by the numbers a
  low-pass is not a choice on it.)*
- A listening page: the candidates side by side, switched in place,
  at the same loudness — what differs is the thing listened for.
  *(http://localhost:8733/engine/master.html?v=seed-1)*
- He names the one to keep. Its dials become the piece's:
  `voices/v-alpha/master.json`.

**S7.5 Where the master lives** (beside the version; the player plays
it) ☑ version 1's master is kept and the player plays it (log §10);
B5's part is open

- The kept master: `versions/seed-N/master.flac` and its report
  `master.json`. Onto the shelf only at his word — git never forgets.
- `versions/shelf.json` says which file a version plays. The player
  plays the master when there is one.
- "A new seed in one step" (B5) ends with the master, at the piece's
  dials.

**S7.6 The same stage in `live-electronics-engine`** (the tool and
the listening page, there too) ☑ there, committed, not pushed (its
journal 263)

- The same `tools/master.py` and the same listening page, copied: a
  version made there is mastered there.
- Its plan, its journal and its front page say where it is.
- NOT part of this, and named: the engine's LIVE bus keeps its "safety
  limiter" that does not hold. A real one in the browser changes what
  every page there sounds like — its own item, his ear first.

## Outside the plan — his

- **Listening** — hearing the candidate versions and keeping a few
  (S5).
- **Machines** — a second laptop, an iPad, a projector; pulling the
  network on purpose (S4).
- **Hetzner** — putting the piece on his share: his sign-in (S3, S4).
- **The public repo** — made at his word; and what, if anything, is
  personal (S6).
