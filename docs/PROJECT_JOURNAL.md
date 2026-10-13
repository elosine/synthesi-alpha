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

### SESSION 2, IN PROGRESS (2026-10-12) — THE SHELF HOLDS FOUR VERSIONS (`seed-1b`, and seeds 2, 3, 4: "keep all three"). B1 … B5 are built. Pushed. Next, at his word: B6.

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ · B2 ☑ this repo, public · B3 ☑ the player
  (log §5) · BM ☑ the master (S7, log §6 … §10) · the clicks ☑ (log §11 … §14) · B4 ☑ the
  stage set-ups (log §15 … §19; his try: "ok works", "works") · B5 ☑ a new seed in one
  step (log §20 … §22) · **► B6 next, at his word.**
  - ON THE SHELF, in git: `versions/seed-1b/` (the final draft, the override mended —
    "clicks are gone, keep it") · `versions/seed-2/`, `seed-3/`, `seed-4/` (other
    playings, from other seeds — "keep all three"). Each: the sound as made, its master
    (the limiter only, true peak −1.0 dB), which the player plays, its picture's record,
    its facts, its scenario. Seed 3 is 9:28; loudness runs −14.9 … −18.0 LUFS.
  - PUSHED 2026-10-12, at his word ("comitt push") — this repo and
    `live-electronics-engine`. From here: commit locally, "push now?" at session end.
- **Then, at his word: B6, the repo finished (S6)** — the front page, the pointers, the
  fresh-clone test; his Hetzner share (his sign-in). Put its proposal to him first.
- **B5, in short (log §20).** `engine/perform.html?make&seed=N`, [begin], ENTER: the
  seed's samples are made by the server the first time (`build/seeds/seed-N/`, not in
  git), the piece is played and recorded, checked (`check.soundsLate` must be 0 — the
  page says SPOILED otherwise, and `tools/shelve.py` refuses it), and mastered beside
  its sound. The make page paces its own timers. About eleven minutes a version.
- **MAKING A VERSION in the AI's pane:** commit first · the address with its seed ·
  [begin] · `rig.engine.out.gain.value = 0` · `rig.scenario.makeVersion()` · one at a
  time (`CLAUDE.md`, machine notes).
- **THE STAGE IS ONE ROOM.** Any page that opens the player on this server is on the
  same stage. He has had a laptop, a tablet and another agent's pages on it. **For any
  check of the player use `player/?alone`; leave the pane off the player when done;
  http://localhost:8733/sync/who shows who is there.** Starting the server again cuts
  the others' wire for a moment (they go on alone and come back).
- **Done this session:** the licence ☑ (log §2 — MIT for `engine/`, `tools/`, `player/`;
  the piece and its record all rights reserved; **a new top-level folder is named in
  `LICENSE-PIECE.md` the day it is made**) · public ☑ (log §3) · the push rule ☑ (log §4:
  commit locally, "push now?" at session end) · B3 · BM · the clicks · B4 (with the
  tablet's [GO] and held press, his "a", log §19) · B5.
  - **Commits since the last push are local — in this repo AND in
    `live-electronics-engine` (four there: journal 263 … 265, and `tools/master.py`'s
    `--into`; its own rule is commit and push before the session ends).**
  - ONE FILE IN TWO REPOS, change both: `tools/master.py` · `engine/master.html` ·
    `engine/override-processor.js`. NO LONGER the same, by B5 and B4: `engine/scenario.js`,
    `engine/perform.html`, the two sample tools (their `override` must still match the
    unit's), `tools/serve.py`.
- **`Resume reads:`** `docs/RUNNING_LOG.md` §20, §21 · `docs/PLAN.md` (the build order;
  S6) · `docs/STAGE.md` · `README.md` (B6 finishes it) ·
  `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface work).
- **Pending him:**
  - **his ear on seeds 2, 3 and 4 — which are kept;**
  - two real machines on the stage set-ups, said plainly (he has said "works"; not with
    what) — and the trim and `H` on a tablet, if he wants them there;
  - his eyes on the player's picture, the fixed shape and its bars;
  - the engine's LIVE bus: its "safety limiter" does not hold −1 dB — his to ask for;
  - whether the score-drawing tool should travel here too (it did not);
  - the build order is the AI's — his to change.
- **Not proven:** how any of it LOOKS · a real tablet's own browser · the one step run by
  HIS hand in his own browser · the stage's numbers (8 ms, 1.5 %, 4 s, 0.25 s) and the
  limiter's speeds are the AI's starting numbers · an iPad as the SOUND machine (233 MB
  unpacked).
- **To check a picture in the AI's pane:** hidden, it gives no frames — pace the page's
  own loops from a worker's timer, set before [begin] (log §5, `CLAUDE.md`). A background
  tab is slower still: front the one being measured.
- **Deliberately uncommitted:** nothing. (`build/` is not in git, by design.)

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
