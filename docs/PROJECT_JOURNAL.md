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

### SESSION 2, IN PROGRESS (2026-10-12) — the repo is PUBLIC and pushed, with its licence; version 1 is on the shelf; next is the player

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ make a version (built in the engine,
  carried here) · B2 ☑ this repo, made and tried (RUNNING_LOG §1). On the shelf:
  `versions/seed-1/` — the final draft, 35 MB lossless, ten minutes.
- **Done this session (his "a, go"):**
  - the licence ☑ (log §2) — `LICENSE`, MIT, the program only (`engine/`, `tools/`) ·
    `LICENSE-PIECE.md`, the piece and its record, © 2026 elosine, all rights reserved;
  - public ☑ (log §3) — https://github.com/elosine/synthesi-alpha, `main` pushed, read
    back from GitHub.
- **Carry into B3:** a new top-level folder (the player's) is named in
  `LICENSE-PIECE.md` the day it is made — unnamed, it falls on the piece's side.
- **► THE NEXT CONCRETE STEP: B3, the player.** Put its proposal to him first (the chunk
  cadence: proposal → his go → build → verify → write down → commit). What it is: a page
  that plays a version — `sound.flac` — and draws the picture from `picture.json`, both
  off the sound's clock, with NO engine inside; it opens on the shelf (S3, S5). The
  drawing to reuse is in `engine/perform.html` (`paintV1`, `makeLens`), `engine/
  score-anim.js` and `engine/scenario.js` (`paintPic`); what it draws FROM is described
  in `versions/README.md`.
- **`Resume reads:`** `docs/PLAN.md` (the build order; S3; S5) · `versions/README.md` ·
  `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface work).
- **Pending him:**
  - his ear on version 1 — nobody has heard it;
  - the push rule for this repo — asked 2026-10-12, not yet answered. Until he says:
    commit locally, "push now?" at session end;
  - whether the score-drawing tool should travel here too (it did not);
  - the build order B1 … B7 is the AI's — his to change.
- **Not proven:** the picture's record (`picture.json`) has been written and never
  replayed. The AI's browser pane does not draw: how the player LOOKS is his to see.
- **Deliberately uncommitted:** nothing.

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
