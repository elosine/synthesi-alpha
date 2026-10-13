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

### SESSION 2, IN PROGRESS (2026-10-12) — he heard CLICKS in pages 11 and 12; found, mended at the source, and the piece taken again: `seed-1b`, a candidate. HIS EAR ON IT IS THE NEXT THING.

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ · B2 ☑ this repo, public · B3 ☑ the player
  (log §5) · BM ☑ the master (S7, log §6 … §10) · **the clicks ☑ mended (log §11 … §13)**
  · then B4.
  - ON THE SHELF, in git: `versions/seed-1/` — version 1, the final draft's recording,
    WITH the clicks; `sound.flac` and `master.flac` (`safe`).
  - A CANDIDATE, not in git: `build/versions/seed-1b/` — the same piece taken again with
    the mended samples; its master in `build/masters/seed-1b/master.flac`.
- **► THE NEXT CONCRETE STEP: his ear on `seed-1b`** —
  http://localhost:8733/player/?candidate=seed-1b (its picture and its master). Are the
  clicks gone to him; does the override still sound as he chose it. **Then, at his
  word, it goes on the shelf:** copy `build/versions/seed-1b/` to `versions/seed-1b/` ·
  add its row to `versions/shelf.json` · `python tools/master.py --candidates
  versions/seed-1b` then `--keep safe versions/seed-1b` (or copy the master made and write
  the row's `plays`) · the table in `versions/README.md` · commit (about 70 MB). **And
  ask him: does `seed-1` stay on the shelf?**
- **The clicks, in short (log §11 … §13).** 99 of 99 hard breaks from page 11 on sat
  inside four samples the BUFFER OVERRIDE had made: three joins it made without a
  crossfade. Mended in its two homes — `tools/page_samples.py` (`override`) and
  `engine/override-processor.js` (the live unit; page 6) — the same three changes, said
  at the head of each. Nine samples made again (pages 9, 11, 12): the same length and
  level, breaks 287 → 0. `seed-1b`: the same 848 sounds as version 1, each within 8 ms;
  hard breaks 105 → 0. The same files are in `live-electronics-engine` (its journal 264).
- **A TAKE WAS LOST, AND WHY (log §13) — read `CLAUDE.md`'s machine notes before making
  a version.** Made muted in the hidden pane, the browser held the page's timers back and
  159 sounds began up to a minute late; the version's own check passed it. The good take
  was made with `tools/pace_timers.js` run before [begin].
- **Done this session:**
  - the licence ☑ (log §2) — MIT for the program (`engine/`, `tools/`, `player/`);
    `LICENSE-PIECE.md`: the piece and its record, © 2026 elosine, all rights reserved.
    **A new top-level folder is named there the day it is made.**
  - public ☑ (log §3) — https://github.com/elosine/synthesi-alpha.
  - the push rule ☑ (log §4) — his: commit locally, "push now?" at session end.
    **Commits since the last push are local — in this repo AND in
    `live-electronics-engine` (two commits there, journal 263, 264; its own rule is commit
    and push before the session ends).**
  - B3 ☑ (log §5) — `player/`; his "a": [begin], ENTER from the top, ESCAPE stops. Now
    also `?candidate=<folder>`.
  - BM ☑ (log §9, §10) — `tools/master.py` · `voices/v-alpha/master.json` ·
    `engine/master.html`; his "a": `safe`, the limiter only. (`tools/master.py` is ONE
    FILE IN TWO REPOS — change both.)
- **For B5, found the hard way:** "a new seed in one step" ends with the master · the make
  page paces its own timers · a version's check counts the sounds that began late.
- **`Resume reads:`** `docs/RUNNING_LOG.md` §11 … §13 · `docs/PLAN.md` (the build order;
  S4) · `CLAUDE.md` (machine notes) · for B4: `player/player.js` (its head; `W`, `H`),
  `for_seven_tubas/docs/ENGINE_BRIEF.md` §3 ·
  `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface work).
- **Pending him:**
  - **his ear on `seed-1b`; whether it is kept; whether `seed-1` stays on the shelf;**
  - his eyes on the player's picture — he has listened through it; he has not said how
    it looks;
  - his verdict on a version — it goes into `versions/shelf.json` ("not heard yet");
  - the engine's LIVE bus: its "safety limiter" does not hold −1 dB — a real one there
    is its own item, his to ask for (`live-electronics-engine/docs/plan/
    mastering-stage.md`);
  - whether the score-drawing tool should travel here too (it did not);
  - the build order is the AI's — his to change.
- **Not proven:** his ear on the mended override, in the samples and live on page 6 ·
  how the player LOOKS · the limiter's speeds are the AI's starting numbers · any browser
  but Chromium, any machine but this one — an iPad least of all: the sound is 233 MB
  unpacked in the player.
- **To check a picture in the AI's pane:** hidden, it gives no frames — pace the page's
  own loops from a worker's timer, set before [begin] (log §5, `CLAUDE.md` machine notes).
- **Deliberately uncommitted:** nothing. (`build/` — the candidate `seed-1b`, the
  masters, the previews — is not in git, by design.)

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
