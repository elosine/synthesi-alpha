# PROJECT JOURNAL — synthesi-alpha (Sýnthesi Alpha)

> One file. Three sections (a lean kit — `PROTOCOL_DEVIATIONS.md`).
> §2 is read at every session start — keep it short; trim old sessions to one line each.
> The lab journal (`RUNNING_LOG.md`) is the raw trail underneath; this is the curated state.

---

## §1 Quick-Start

- **The piece:** *Sýnthesi Alpha* — a player and fixed electronics, with an animated
  score. Ten minutes. Finished as a composition 2026-10-12.
- **Where it was made:** `live-electronics-engine` (the sandbox), 2026-08-27 … 2026-10-12.
  Its journal, §1 … §261, is in `docs/history/` — frozen.
- **What this repo is for:** to carry the piece to a venue and play it on whatever
  machines are there; and to make new versions of it from new seeds.
- **The plan:** `docs/PLAN.md` — S1 … S6 (decided), B1 … B7 (the build order).
- **The stack:** a web page and a small Python server. `python tools/serve.py` → port
  **8733**. No SuperCollider, no Reaper, no MIDI.
  - the workshop: http://localhost:8733/engine/perform.html — [begin], ENTER
  - makes a version: http://localhost:8733/engine/perform.html?make
- **Needs:** Python 3 · `numpy`, `soundfile` · `ffmpeg` · a current browser.
- **Reference repos** (read-only): `live-electronics-engine` — the labs, the play-in, the
  score-drawing tool, his interface preferences (`docs/reference/ui-preferences.md`) ·
  `for_seven_tubas` — `docs/ENGINE_BRIEF.md` §3, the sync model S4 is taken from. What
  the pieces share: `composition-system/INDEX.md`.

---

## §2 Resume Here

**FIRST — HIS STANDING RULE (2026-09-11):** after `/clear` + `/postclear`:
play back, then **STOP and ask**. No edits, no builds, no tool calls beyond the resume
reads. Start only on his word. *(At `/session-start`: orient, agree the agenda, then work.)*

### SESSION 2, IN PROGRESS (2026-10-12) — version 1 is MASTERED and the player plays the master; the player itself still waits for his eyes and ears. The repo is public.

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ make a version · B2 ☑ this repo, public ·
  B3 ☑ the player — http://localhost:8733/player/ (log §5) · BM ☑ the master (the plan's
  S7, log §6 … §10) · **► B4 next, at his word.** On the shelf: `versions/seed-1/` — the
  final draft: `sound.flac` as it was made, and `master.flac`, which the player plays.
- **OPEN, FIRST (his ear, 2026-10-12 — log §11): CLICKS in pages 11 and 12.** Found and
  proven: 99 of 99 are hard breaks inside four pre-processed samples the BUFFER OVERRIDE
  made (page 11 `set45`; page 12 `set46` `set47` `set48`) — three joins the override
  makes without a crossfade, in `tools/page_samples.py` AND `engine/override-processor.js`.
  Not the version's making, not the master, not the player. The same files are in the
  engine's final draft. A mend was tried on a copy: breaks 215 → 0 on three samples, the
  level the same; previews sent (`build/click-previews/`). **NOTHING IN THE REPO IS
  CHANGED. His word is awaited: (a) mend at the source, remake the samples of pages
  9 … 12 and the piece — a new take; or (b) keep this take, mend the finished file.**
  The scratch mend is in the log's §11, in words: three changes to the override's loop.
- **► THEN: B4, the stage set-ups (S4)** — put its proposal to him
  first (proposal → his go → build → verify → write down → commit). And still open
  before or beside it: **his look at the player** — nobody has seen or heard it.
- **The master, in short (S7 — his: for THE HALL; the steps the AI's, at his word "I don't
  need to see the steps, write plan or go with build if plan done" — each his to
  reverse):** a pass on the version's finished file, `tools/master.py`. **Kept for
  version 1: `safe` — the limiter only, true peak −1.0 dB; his "a" (log §10).** The
  low-pass and the compressor are dials, off (`voices/v-alpha/master.json`). The same
  take, the same length, not moved by a sample. The finding (log §9): the piece is
  already dark — by the numbers a low-pass is not a choice on it.
- **Done this session:**
  - the licence ☑ (log §2) — MIT for the program (`engine/`, `tools/`, `player/`);
    `LICENSE-PIECE.md`: the piece and its record, © 2026 elosine, all rights reserved.
    **A new top-level folder is named there the day it is made.**
  - public ☑ (log §3) — https://github.com/elosine/synthesi-alpha.
  - the push rule ☑ (log §4) — his: commit locally, "push now?" at session end.
    **Commits since the last push are local — in this repo AND in
    `live-electronics-engine` (one commit there, journal 263; its own rule is commit and
    push before the session ends).**
  - B3 ☑ (log §5) — `player/`; his "a": [begin], ENTER from the top, ESCAPE stops.
  - BM ☑ (log §9, §10) — `tools/master.py` · `voices/v-alpha/master.json` ·
    `engine/master.html` · the player's `plays`; the same three files in the engine repo
    (`tools/master.py` is ONE FILE IN TWO REPOS — change both).
- **Left of the master, for B5:** "a new seed in one step" ends with the master, at the
  piece's dials.
- **`Resume reads:`** `docs/PLAN.md` (the build order; S4) · `docs/RUNNING_LOG.md` §5
  (the player) · `player/player.js` (its head; `W`, `H` are the two lines the fixed shape
  changes) · `for_seven_tubas/docs/ENGINE_BRIEF.md` §3 (the sync model S4 is taken from)
  · `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface
  work).
- **Pending him:**
  - his eyes and ears on the player — and through it on version 1 and its master;
  - his verdict on version 1 — it goes into `versions/shelf.json` ("not heard yet");
  - the engine's LIVE bus: its "safety limiter" does not hold −1 dB — a real one there
    is its own item, his to ask for (`live-electronics-engine/docs/plan/
    mastering-stage.md`);
  - whether the score-drawing tool should travel here too (it did not);
  - the build order is the AI's — his to change.
- **Not proven:** how any of it LOOKS or SOUNDS (the AI's pane does not draw, and has no
  ears) — whether he listened to the candidates before choosing `safe`, he did not say ·
  the limiter's speeds are the AI's starting numbers · any browser but Chromium, any
  machine but this one — an iPad least of all: the sound is 233 MB unpacked in the
  player.
- **To check a picture in the AI's pane:** hidden, it gives no frames — pace the page's
  own loops from a worker's timer, set before [begin] (log §5, `CLAUDE.md` machine notes).
- **Deliberately uncommitted:** nothing. (`build/masters/` — the candidates — is not in
  git, by design.)

---

## §3 The principles carried — his, of this piece

- **Nothing is live.** "I'll press play on stage and play along with the electronics,
  but there's no open mic or interactive electronics." (engine journal §249)
- **One sound machine, always.** "I ... wouldn't want more than one audio to be
  coordinated." (§254)
- **His order of harms.** A picture a little out of step "is not ideal, but it's not the
  end of the concert"; the picture stopping when the network drops "that's a problem".
  The fallback wanted is "the least worst option". (§254)
- **Not overwrought.** "I don't think it needs to be overwrought." (§254)
- **Nothing to remember.** "in two years time I play it again ... I won't have
  remembered" — one repo holds all of it. (§255)
- **A version is heard before it goes on stage.** (§255)
- **The recording is the version; the seed is its label.** A made version is never
  written over. Only kept versions go into git. (§255, §260)
- **The animation engine may be revisited** if the performance-version work on his other
  pieces finds something about smooth playback — a placeholder, in `PLAN.md` under S3.
  (§251)
