# synthesi-alpha — Sýnthesi Alpha

**Title: Sýnthesi Alpha** (the composer's, 2026-10-12 — engine journal §257, §259)

A piece for a player and fixed electronics, with an animated score. Ten
minutes. Finished as a composition on 2026-10-12 (the engine's git tag
`v-alpha-final-draft`). This repo makes it a thing that can be carried
to a venue and played, and re-made from a new seed.

**THE PROFILE** (the new-piece protocol's 2.1):

- the kind of start: **from a sandbox** — `live-electronics-engine`
- the layers taken: neither of the notated lineage's (no sampler
  instrument, no notation stack) — the engine's own playing parts,
  copied
- the score type: the engine's animated scrolling score, as built files
- the protocol version run: v1 —
  `composition-system/protocol/NEW_PIECE_PROTOCOL.md`, step 2 only, as
  a LEAN kit (his choice, engine journal §261). Every departure is a
  line in `docs/PROTOCOL_DEVIATIONS.md`.

**State of the piece (keep this line current):** **► THE STAGE
SET-UPS ARE BUILT (B4, log §15): one machine has the sound, the
others the picture only and keep to it; ENTER and ESCAPE on any
machine; a trim; the fixed 1920 × 1080 shape — checked on ONE machine,
two pages. TWO REAL MACHINES ARE HIS TO TRY (`docs/STAGE.md`). The
kept version is `seed-1b`: http://localhost:8733/player/ . The repo
is public (`github.com/elosine/synthesi-alpha`). Next, at his word:
B5, a new seed in one step. `docs/PROJECT_JOURNAL.md` §2 is the
cold-start block.**

## READ FIRST — how to work here

- **How he reads, how he is asked, how a reply is shaped:** his
  user-level `~/.claude/CLAUDE.md`. It governs. In short: a one-line
  TL;DR, bullets, short lines, one idea a chunk; questions as plain
  lettered options in the chat, never a picker; one step at a time; do
  the thing asked, not the thing around it.
- **A confidence claim must be verified in the running app.** What has
  not been checked is said as not checked.
- **The plan is `docs/PLAN.md`** — six decided steps (S1 … S6) and a
  build order (B1 … B7). A step is built on his word, one chunk at a
  time: build, verify, write it down, commit.

## Standing practice

**Keep the lab journal — `docs/RUNNING_LOG.md` — without being asked.**
Written as the work happens, at the end of any exchange that produced
a decision, a result, a rejection, a measurement or a point of theory.
Each entry: what prompted it, in his words, quoted; what was tried, in
order; the numbers; what was rejected and why; what was decided and
why that. Append-only; a correction is a new entry. The rules in full
are at the head of that file.

**The state lives in `docs/PROJECT_JOURNAL.md` §2** — the chat is never
the record.

**Versions.**

- A version is made by the workshop (`engine/perform.html?make`) into
  `build/versions/` — a candidate, not in git.
- **Only a version he has heard and kept goes onto the shelf**
  (`versions/`) and into git. Git never forgets: nothing is committed
  there to be thrown out later.
- A made version is never written over.
- **The recording is the version; the seed is its label.**

**Always include the link.** Every reply that concerns a page carries
its `http://localhost:8733/…` link.

**Every preview is also a real sound file, sent to him.**

**Git.** The repo is PUBLIC — `github.com/elosine/synthesi-alpha` —
made and pushed at his word (2026-10-12, log §3). **Everything pushed
is published.** **The push rule (his, 2026-10-12, log §4):** commit
locally; ask "push now?" at session end. No push in between.

**The licence** (his, log §2).

- `LICENSE` — MIT — covers the program only: `engine/`, `tools/`,
  `player/`.
- `LICENSE-PIECE.md` — the piece and its record (`voices/`,
  `versions/`, `picture/`, `docs/`) are © 2026 elosine, all rights
  reserved.
- **A new top-level folder is named in `LICENSE-PIECE.md` the day it
  is made** — on the program's side or the piece's. Unnamed, it falls
  on the piece's side.

## Orient from docs, not from scanning

- **What now:** `docs/PROJECT_JOURNAL.md` §2 Resume Here.
- **The plan:** `docs/PLAN.md`.
- **The lab journal:** `docs/RUNNING_LOG.md`.
- **How the piece was made:** `docs/history/` — a frozen copy of the
  engine's journal (§1 … §261), the plan it was built by, and its
  clips. Never edited here.
- **What the pieces share:** `composition-system/INDEX.md`.
- **His interface preferences — read before building or changing any
  user interface:**
  `live-electronics-engine/docs/reference/ui-preferences.md`. Not
  copied here: it is a living list and has one home.

## The parts

| | |
|---|---|
| `player/index.html` · `player.js` | THE PLAYER — plays a kept version: the sound file, and the picture drawn from `picture.json`. No engine inside. `?candidate=<folder>` adds a version made and not yet kept (`build/versions/`) · `?alone` keeps the page off the stage's wire — **use it for any check of the player while something else is on the stage** |
| `player/record.js` | how a picture record is read — pure, no page; the one place that says what the record means |
| `player/sync.js` | THE STAGE — several machines kept together: a machine's clock against the small server's, and a picture-only machine's clock kept to the sound (`makeFollower`) |
| `docs/STAGE.md` | on stage: the set-ups, the kit, the steps, what was measured |
| `engine/perform.html` | THE WORKSHOP — plays the piece live; `?make` records a version; `&seed=N` — from that seed |
| `engine/scenario.js` | the scenario runner: the form, the pages, `makeVersion()` |
| `engine/voices.js` · `patterns.js` | what the cursors play, and his sequences sounded again |
| `engine/playhead-*.js` · `override-processor.js` | the granular reader; the buffer override |
| `engine/version.js` · `version-recorder.js` | a version's sound, taken sample for sample |
| `tools/serve.py` | the server — port **8733**; and the stage's few words, `/sync/…`. It keeps connections open and listens on both kinds of address — both matter to how well a clock is known (log §15) |
| `tools/icy_render.py` · `page_samples.py` | make the pre-processed samples of pages 8 … 12 from the seed. `<page> <seed>`: another seed's, apart, in `build/seeds/` |
| `tools/shelve.py` | a kept candidate → the shelf, at his word: `python tools/shelve.py seed-N --what … --verdict …` |
| `tools/pace_timers.js` | a hidden page's timers paced from a worker — for checks of pages other than the make page, which has it built in (machine notes, below) |
| `tools/master.py` | THE MASTERING STAGE — a version's finished sound in, its master out. `--selftest` · `--candidates` · `--keep`. The same file is in `live-electronics-engine` — keep the two the same |
| `engine/master.html` | the listening page — a version's candidate masters, side by side |
| `voices/v-alpha/master.json` | the piece's mastering dials, and the candidates put to his ear |
| `voices/v-alpha/` | the recording (FLAC, lossless) · the map · the scenario · the sequences · the samples |
| `picture/` | the drawn score, as built — the tool that drew it stays in the engine repo |
| `versions/` | the shelf — `shelf.json` is the list the player opens on |

## Machine notes

Windows. Python 3 with `numpy` and `soundfile`; `ffmpeg` on the path.

- A Bash command over about 8 KB fails with a false "matching quote"
  error: long text goes to a scratch file first.
- A script with backticks OR backslashes goes to a file, never into a
  here-document — doubled backslashes arrive single (engine journal
  §260).
- The AI's browser pane does not draw. A picture is checked there by
  structure and numbers only; how it LOOKS is his to see.
- **When the pane is hidden it gives no frames at all** (log §5): a
  page's frame loop stands still, and the workshop's live picture with
  it. To check one there, pace the page's own loops from a worker's
  timer — set before [begin]. A background tab is the same.
- **A check in the pane plays its sound out of his speakers.**
- **Leave the pane OFF the player's page when a check is done** (log §16):
  a page left there is a machine on the stage's wire, and it got in his
  way.
- **MAKING A VERSION in the AI's pane** (log §13: a take was lost; §20:
  mended). The piece's sounds are called from a page timer, and a page
  that is hidden AND silent has its timers held back, to one a minute.
  The make page now paces its own timers from a worker, and a version's
  check counts the sounds that began late (`check.soundsLate` — 0, or
  the take is spoiled). So:
  - commit first — the version names the commit that made it;
  - `engine/perform.html?make&seed=N` · [begin] ·
    `rig.engine.out.gain.value = 0` (his speakers; the recorder takes
    the sound before it) · `rig.scenario.makeVersion()`;
  - one at a time, about eleven minutes each;
  - `tools/pace_timers.js` is still the way to pace a page that is NOT
    the make page (the player, in a check).
- The engine's own server is port 8732; this repo's is 8733. Both can
  run.
