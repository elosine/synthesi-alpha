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

### SESSION 2, IN PROGRESS (2026-10-12) — THE KEPT VERSION IS `seed-1b`: heard by him, kept, mastered, on the shelf; the player plays it. `seed-1` (it clicked) is off the shelf. Next, at his word: B4.

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ · B2 ☑ this repo, public · B3 ☑ the player
  — http://localhost:8733/player/ (log §5) · BM ☑ the master (S7, log §6 … §10) · the
  clicks ☑ (log §11 … §14) · **► B4 next, at his word.**
  - ON THE SHELF, in git: `versions/seed-1b/` — the final draft, taken again with the
    buffer override's joins mended. `sound.flac` as it was made; `master.flac` (`safe`:
    the limiter only, true peak −1.0 dB), which the player plays. **His verdict:
    "clicks are gone, keep it".**
  - OFF THE SHELF at his word: `seed-1`, the final draft's first recording (the plan's
    and the log's "version 1"). In git's history; the same sound file is in
    `live-electronics-engine/build/versions/seed-1/`.
- **► THE NEXT CONCRETE STEP: B4, the stage set-ups (S4)** — put its proposal to him
  first (proposal → his go → build → verify → write down → commit).
- **The clicks, in short (log §11 … §14).** He heard them in pages 11 and 12. 99 of 99
  hard breaks sat inside four samples the BUFFER OVERRIDE had made: three joins it made
  without a crossfade. Mended in its two homes — `tools/page_samples.py` (`override`)
  and `engine/override-processor.js` (the live unit; page 6) — the same three changes,
  said at the head of each. Nine samples made again (pages 9, 11, 12). `seed-1b`: the
  same 848 sounds as `seed-1`, each within 8 ms; hard breaks 105 → 0. The same files are
  in `live-electronics-engine` (its journal 264, 265).
- **MAKING A VERSION — read `CLAUDE.md`'s machine notes first (log §13).** A take was
  lost: made muted in the hidden pane, the browser held the page's timers back and 159
  sounds began up to a minute late; the version's own check passed it. Commit first ·
  run `tools/pace_timers.js` in the make page before [begin] · look for late sounds in
  `picture.json` after.
- **Done this session:**
  - the licence ☑ (log §2) — MIT for the program (`engine/`, `tools/`, `player/`);
    `LICENSE-PIECE.md`: the piece and its record, © 2026 elosine, all rights reserved.
    **A new top-level folder is named there the day it is made.**
  - public ☑ (log §3) — https://github.com/elosine/synthesi-alpha.
  - the push rule ☑ (log §4) — his: commit locally, "push now?" at session end.
    **Commits since the last push are local — in this repo AND in
    `live-electronics-engine` (three commits there, journal 263 … 265; its own rule is
    commit and push before the session ends).**
  - B3 ☑ (log §5) — `player/`; his "a": [begin], ENTER from the top, ESCAPE stops;
    `?candidate=<folder>` plays a version made and not yet kept.
  - BM ☑ (log §9, §10) — `tools/master.py` · `voices/v-alpha/master.json` ·
    `engine/master.html`; his "a": `safe`, the limiter only. (`tools/master.py` is ONE
    FILE IN TWO REPOS — change both. So are `engine/override-processor.js`,
    `engine/master.html` and — but for the file it reads — `tools/page_samples.py`.)
- **For B5, found the hard way:** "a new seed in one step" ends with the master · the make
  page paces its own timers · a version's check counts the sounds that began late.
- **`Resume reads:`** `docs/PLAN.md` (the build order; S4) · `docs/RUNNING_LOG.md` §5
  (the player) and §13 (making a version) · `player/player.js` (its head; `W`, `H` are
  the two lines the fixed shape changes) · `for_seven_tubas/docs/ENGINE_BRIEF.md` §3 ·
  `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface work).
- **Pending him:**
  - his eyes on the player's picture — he has listened through it; he has not said how
    it looks;
  - the engine's LIVE bus: its "safety limiter" does not hold −1 dB — a real one there
    is its own item, his to ask for (`live-electronics-engine/docs/plan/
    mastering-stage.md`);
  - whether the score-drawing tool should travel here too (it did not);
  - the build order is the AI's — his to change.
- **Not proven:** how the player LOOKS · the limiter's speeds are the AI's starting
  numbers · the mended override LIVE on page 6, by his ear on its own (he heard the
  whole take and said the clicks are gone) · any browser but Chromium, any machine but
  this one — an iPad least of all: the sound is 233 MB unpacked in the player.
- **To check a picture in the AI's pane:** hidden, it gives no frames — pace the page's
  own loops from a worker's timer, set before [begin] (log §5, `CLAUDE.md` machine notes).
- **Deliberately uncommitted:** nothing. (`build/` — the masters' candidates, the
  previews — is not in git, by design.)

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
