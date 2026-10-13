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

### SESSION 2, IN PROGRESS (2026-10-12) — B4, the stage set-ups, is BUILT and checked on one machine; two real machines are his to try. The kept version is `seed-1b`. Next, at his word: B5.

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order.
- **Where it stands · the deliverable:** B1 ☑ · B2 ☑ this repo, public · B3 ☑ the player
  — http://localhost:8733/player/ (log §5) · BM ☑ the master (S7, log §6 … §10) · the
  clicks ☑ (log §11 … §14) · **B4 ☑ the stage set-ups (log §15)** · **► B5 next, at his
  word.**
  - ON THE SHELF, in git: `versions/seed-1b/` — the final draft, taken again with the
    buffer override's joins mended; `master.flac` (`safe`) is what the player plays. His
    verdict: "clicks are gone, keep it". (`seed-1` is off the shelf at his word.)
- **B4, in short (log §15; `docs/STAGE.md` is the page for him).** One machine begins
  "sound and picture"; the others "picture only" — they fetch no sound, run the picture on
  their own clocks and keep them to where the sound is (`player/sync.js`), nudged at most
  1.5 %, never a jump once the score moves. ENTER and ESCAPE on ANY machine begin and stop
  them all (his "a"). LEFT / RIGHT: a trim per machine. `H`: what a machine knows. The
  picture keeps 1920 × 1080, bars around. The small server (`tools/serve.py`, `/sync/…`)
  carries a few words; with it gone, every machine goes on alone.
  - **Checked on ONE machine, two pages:** the sound 0.14 s after ENTER on the other page
    · the screen within about 1 ms of the sound · the network pulled 4 min 40 s: 0.4 ms
    out on return · ESCAPE on either stops both.
  - **NOT tried — his:** two real machines, a house wifi, an iPad, a projector's delay,
    a real network pulled, Safari / Firefox. Windows will ask whether Python may be
    reached from the network.
- **► THE NEXT CONCRETE STEP: B5, a new seed in one step (S5)** — put its proposal to him
  first. It must hold three things found the hard way: the step ends with the MASTER, at
  the piece's dials · the make page paces its own timers (`tools/pace_timers.js` is the
  stop-gap) · a version's check counts the sounds that began late. Then a first batch of
  candidates; he listens (`player/?candidate=<folder>`); the kept ones go on the shelf.
- **MAKING A VERSION — read `CLAUDE.md`'s machine notes first (log §13).** A take was
  lost: made muted in the hidden pane, the browser held the page's timers back and 159
  sounds began up to a minute late; the version's own check passed it.
- **Done this session:**
  - the licence ☑ (log §2) — MIT for the program (`engine/`, `tools/`, `player/`);
    `LICENSE-PIECE.md`: the piece and its record, © 2026 elosine, all rights reserved.
    **A new top-level folder is named there the day it is made.**
  - public ☑ (log §3) — https://github.com/elosine/synthesi-alpha.
  - the push rule ☑ (log §4) — his: commit locally, "push now?" at session end.
    **Commits since the last push are local — in this repo AND in
    `live-electronics-engine` (three commits there, journal 263 … 265; its own rule is
    commit and push before the session ends).**
  - B3 ☑ · BM ☑ · the clicks ☑ · B4 ☑ — as above.
  - ONE FILE IN TWO REPOS, change both: `tools/master.py` · `engine/master.html` ·
    `engine/override-processor.js` · and, but for the file it reads, `tools/page_samples.py`.
    (`tools/serve.py` is NOT the engine's: the stage's words and the open connections are
    this repo's only.)
- **`Resume reads:`** `docs/PLAN.md` (the build order; S5) · `docs/RUNNING_LOG.md` §13
  (making a version) and §15 (the stage) · `engine/scenario.js` (`makeVersion`, the seed)
  · `tools/page_samples.py`, `tools/icy_render.py` (the samples a seed needs) ·
  `live-electronics-engine/docs/reference/ui-preferences.md` (before any interface work).
- **Pending him:**
  - **two real machines on the stage set-ups** (`docs/STAGE.md`) — and what `H` shows
    there;
  - his eyes on the player's picture, the fixed shape and its bars — he has listened
    through the player; he has not said how it looks;
  - the engine's LIVE bus: its "safety limiter" does not hold −1 dB — a real one there
    is its own item, his to ask for;
  - whether the score-drawing tool should travel here too (it did not);
  - the build order is the AI's — his to change.
- **Not proven:** how the player LOOKS · anything of B4 off this one machine · the
  limiter's speeds and the stage's numbers (8 ms, 1.5 %, 4 s, 0.25 s) are the AI's
  starting numbers · an iPad as the SOUND machine (233 MB unpacked); as a picture-only
  one it loads no sound.
- **To check a picture in the AI's pane:** hidden, it gives no frames — pace the page's
  own loops from a worker's timer, set before [begin] (log §5, `CLAUDE.md` machine notes).
  A background tab is slower still: front the one being measured.
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
