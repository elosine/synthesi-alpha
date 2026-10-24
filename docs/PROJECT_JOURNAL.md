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

### 2026-10-24 — THE CUT FOR TENOR 2027, kept (log §30 … §39; worked from `paperSubmissions`, its running order step 6)

- **On the shelf:** `versions/seed-1-cut630-icy45/` — 6:19 of sound. The stands 11.32 … 16.55 s
  (43.55 % of seed-1b's) · every icy sound −6 dB (`levelDb` on the icy presets, as it plays) · the
  icy reads of pages 4 and 5 begun later to end on the next page's stop (`endBy`); page 12 as it was.
  `scenario-1.json` NOW MAKES THIS CUT — seed-1b's settings are in git history (before `b8d146d`).
- **Next, in `jwy_audioEngineering`:** the piano recorded over it. Its tools default to `seed-1b` —
  name this version to them.
- **Pushed** 2026-10-24, his word ("Yes, push synthesi-alpha now.").

### OPEN — (2026-10-14) — B1 … B5 are built, the shelf holds four versions. B6 is ON HOLD, his word (log §29).

*For an AI that has not seen the conversation. After `/postclear`: play this back, then
STOP and ask (the rule at the head of §2).*

- **The task:** build the standalone piece by `docs/PLAN.md`'s build order. **Its state:**
  B1 ☑ make a version · B2 ☑ this repo, public · B3 ☑ the player · BM ☑ the master ·
  the clicks ☑ mended · B4 ☑ the stage set-ups (his try: "ok works", "works") · B5 ☑ a
  new seed in one step · **⏸ B6 the repo finished — ON HOLD (his, log §29)** · B7 the video.
- **The latest deliverable:** the shelf — `versions/seed-1b/` (the final draft, the
  override mended: "clicks are gone, keep it") and `versions/seed-2/`, `seed-3/`,
  `seed-4/` ("keep all three"). The player plays each one's master:
  http://localhost:8733/player/ . Pushed: `82f0560` here, `3da7d96` in
  `live-electronics-engine`; GitHub's `main` is the local one in both.
- **► THE NEXT CONCRETE STEP: none here until his word.** B6 is held: how the piece
  reaches performers waits on how all his performance scores will be served — worked out
  in his other repo; "it probably has to be rebuilt". He chose "b" (Hetzner in) first,
  then held it. The structure so far: `docs/PLAN.md` B6 (who gets it · how, as it stands ·
  the website's part · what is open). B7 (the video) is not begun.
- **If B6 is taken up as it was planned — its three steps, as instructions** (build →
  verify → write down → commit; one at a time):
  1. *The front page.* Read `README.md` top to bottom; run every command and open every
     address in it as written; mend what is not true. It must say, in a few lines each:
     to play it · to make a version · what each folder is · where it came from.
  2. *The pointers.* `live-electronics-engine` (its `README.md`, its `CLAUDE.md`) must
     point at this repo; `composition-system/INDEX.md` has NO line for the piece — add
     one. Both are other repos: say so to him before committing there, and ask each
     one's push rule if it is not written in it.
  3. *The fresh-clone test* (the plan's test of done). `git clone
     https://github.com/elosine/synthesi-alpha` into an EMPTY scratch folder. The clone's
     server needs its own port — `tools/serve.py` has 8733 fixed: give it a port as its
     first word, default 8733. In the clone, on the other port: the player (`?alone`)
     loads a version, picture and sound · `/samples?seed=5` makes a seed's samples · a
     short version is made (`engine/perform.html?make`, [begin],
     `rig.scenario.makeVersion({ page: 12, wait: 4, name: 'clone-check' })`: 0 sounds
     late, mastered). Nothing may come from outside the clone. Mind: his git checks text
     out with CRLF — the clone is the first place the files have it. Write the numbers
     in the log; remove the clone.
- **`Resume reads:`** `docs/PLAN.md` — the build order (B6's hold) ·
  `docs/RUNNING_LOG.md` §24 … §29.
  *(Everything else the next step needs is in this block and in `CLAUDE.md`.)*
- **Decisions pending him:**
  - **B6: held** — when he takes it up: is "download once, the laptop runs it" the way;
    what a performer downloads (PLAN.md B6);
  - the words on what each of seeds 2, 3, 4 IS are the AI's (the loudest · the shortest
    · the sparest) — his to replace (`versions/shelf.json`, `versions/README.md`);
  - two real machines on the stage, said plainly — he has said "works", not with what;
    the trim and `H` on a tablet, if he wants them there;
  - his eyes on the player's picture, the fixed shape and its bars;
  - the engine's LIVE bus: its "safety limiter" does not hold −1 dB — his to ask for;
  - whether the score-drawing tool should travel here (it did not);
  - the build order is the AI's — his to change.
- **Three things that bit this session — do not learn them again:**
  - **THE STAGE IS ONE ROOM.** Any page that opens the player on this server is on it —
    his laptop, his tablet, another agent's pages have all been there. For any check of
    the player use `player/?alone`; leave the pane OFF the player when done;
    http://localhost:8733/sync/who shows who is there. Starting the server again cuts
    the others' wire for a moment.
  - **MAKING A VERSION** — `CLAUDE.md`, machine notes: commit first · the address with
    its seed · [begin] · `rig.engine.out.gain.value = 0` · `rig.scenario.makeVersion()` ·
    one at a time, about eleven minutes. `check.soundsLate` must be 0.
  - **THE PUSH RULE** (his, log §4): commit locally; "push now?" at session end. He
    pushed once in mid-session at his own word ("comitt push"); that was that push.
- **ONE FILE IN TWO REPOS, change both:** `tools/master.py` · `engine/master.html` ·
  `engine/override-processor.js`. No longer the same, by B4 and B5: `engine/scenario.js`,
  `engine/perform.html`, the two sample tools (their `override` must still match the
  unit's), `tools/serve.py`.
- **Not proven:** how any of it LOOKS (the AI's pane does not draw) · a real tablet's own
  browser · the one step run by HIS hand in his own browser · anything on a second
  machine by measurement · an iPad as the SOUND machine (233 MB unpacked).
- **Deliberately uncommitted** (`git status --short` is empty in both repos; what
  follows is outside git on purpose):
  - `build/masters/` (306 MB) — the mastering candidates of `seed-1` and `seed-1b` his
    ear chose from; kept in case he wants to compare. Safe to remove at his word.
  - `build/seeds/seed-2/`, `seed-3/`, `seed-4/` (22 MB) — those seeds' samples; made
    again from the seed by the server whenever wanted.
  - `build/versions/previews/` (41 MB) — the three full-length mp3s sent to him.
  - `build/click-previews/` (6 MB) — the before/after files of the clicks, and the
    scripts that found them (`how/`).
  - `.claude/settings.local.json` — this machine's own settings; not the repo's.
  - The small server may still be running on 8733 (started by this session).

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
