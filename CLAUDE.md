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

**State of the piece (keep this line current):** **► The repo is
PUBLIC and pushed — `github.com/elosine/synthesi-alpha` (2026-10-12).
The licence is in. Version 1 is on the shelf. Next: B3, the player.
`docs/PROJECT_JOURNAL.md` §2 is the cold-start block.**

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
is published.** **The push rule has been asked and not yet answered:**
until he says, commit locally and ask "push now?" at session end.

**The licence** (his, log §2).

- `LICENSE` — MIT — covers the program only: `engine/`, `tools/`.
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
| `engine/perform.html` | THE WORKSHOP — plays the piece live; `?make` records a version |
| `engine/scenario.js` | the scenario runner: the form, the pages, `makeVersion()` |
| `engine/voices.js` · `patterns.js` | what the cursors play, and his sequences sounded again |
| `engine/playhead-*.js` · `override-processor.js` | the granular reader; the buffer override |
| `engine/version.js` · `version-recorder.js` | a version's sound, taken sample for sample |
| `tools/serve.py` | the server — port **8733** |
| `tools/icy_render.py` · `page_samples.py` | make the pre-processed samples of pages 8 … 12 from the seed |
| `voices/v-alpha/` | the recording (FLAC, lossless) · the map · the scenario · the sequences · the samples |
| `picture/` | the drawn score, as built — the tool that drew it stays in the engine repo |
| `versions/` | the shelf |

## Machine notes

Windows. Python 3 with `numpy` and `soundfile`; `ffmpeg` on the path.

- A Bash command over about 8 KB fails with a false "matching quote"
  error: long text goes to a scratch file first.
- A script with backticks OR backslashes goes to a file, never into a
  here-document — doubled backslashes arrive single (engine journal
  §260).
- The AI's browser pane does not draw. A picture is checked there by
  structure and numbers only; how it LOOKS is his to see.
- The engine's own server is port 8732; this repo's is 8733. Both can
  run.
