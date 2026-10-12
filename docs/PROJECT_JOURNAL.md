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

### SESSION 2, IN PROGRESS (2026-10-12) — the player is built and checked by numbers; HIS EYES AND EARS ON IT ARE PENDING; the repo is public, with its licence

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ make a version · B2 ☑ this repo, public ·
  **B3 ☑ the player — http://localhost:8733/player/** (log §5). On the shelf:
  `versions/seed-1/` — the final draft, 35 MB lossless, ten minutes.
- **Done this session:**
  - the licence ☑ (log §2) — `LICENSE`, MIT, the program only (`engine/`, `tools/`,
    `player/`) · `LICENSE-PIECE.md`, the piece and its record, © 2026 elosine, all
    rights reserved. **A new top-level folder is named there the day it is made.**
  - public ☑ (log §3) — https://github.com/elosine/synthesi-alpha.
  - the push rule ☑ (log §4) — his: commit locally, "push now?" at session end.
    **Commits since the last push are local.**
  - B3 ☑ (log §5) — `player/` (the page · `player.js` · `record.js`) and
    `versions/shelf.json`. His "a": [begin], ENTER from the top, ESCAPE stops; starting
    from a page was offered and not taken. The workshop was not touched.
- **What B3's check showed (log §5, all by numbers):** version 1 replayed whole — 848 of
  848 sounds, no error · the sound the page holds is the file, every sample in its place
  · against the workshop's LIVE picture (page 12's short pass): the same lenses, the
  notation's time within 0.1 ms in 99.9 % of frames · one small real difference — at a
  start or a stop the workshop's scroll snaps 40 ms (5 px at 1080); the player glides
  with what is heard.
- **► THE NEXT CONCRETE STEP: his look at the player** — eyes and ears; nobody has seen
  or heard it. **Then, at his word, B4 — the stage set-ups** (S4): put its proposal to
  him first (proposal → his go → build → verify → write down → commit).
- **`Resume reads:`** `docs/PLAN.md` (the build order; S4) · `docs/RUNNING_LOG.md` §5 ·
  `player/player.js` (its head; `W`, `H` are the two lines the fixed shape changes) ·
  `for_seven_tubas/docs/ENGINE_BRIEF.md` §3 (the sync model S4 is taken from) ·
  `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface work).
- **Pending him:**
  - his eyes and ears on the player, and with it his ear on version 1;
  - his verdict on version 1 — it goes into `versions/shelf.json` (today: "not heard yet");
  - whether the score-drawing tool should travel here too (it did not);
  - the build order B1 … B7 is the AI's — his to change.
- **Not proven:** how the player LOOKS and SOUNDS (the AI's pane does not draw, and has
  no ears) · any browser but Chromium, any machine but this one — an iPad least of all:
  the sound is 233 MB unpacked · pages 1 … 11 and the six curved reads against a LIVE
  pass (they were replayed against version 1's own record).
- **To check a picture in the AI's pane:** hidden, it gives no frames — pace the page's
  own loops from a worker's timer, set before [begin] (log §5, `CLAUDE.md` machine notes).
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
