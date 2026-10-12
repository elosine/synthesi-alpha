# PROTOCOL DEVIATIONS — where this start left the protocol

*(The new-piece protocol's 10.2. Kept DURING the start: one line at the moment of the deviation, never
reconstructed after. Read line by line at the end of the start (10.0); each lesson then goes back into the
protocol as a dated entry under the step it touches. A deviation is not a fault — it is how the protocol learns.)*

**The protocol version this piece runs:** v1 — step 2 only (The repo and its kit).

**Why so many lines.** The protocol was written for the START of a piece that is about to be composed. This
repo is the other end: a piece already finished in a sandbox (`live-electronics-engine`), given a home of its
own so that it can be performed and re-made. The composer chose a LEAN kit (2026-10-12, engine journal §261:
"a is good"). Every line below is that choice, or a thing the protocol did not foresee.

| Date | Step | What the protocol said | What was done | Why |
|---|---|---|---|---|
| 2026-10-12 | whole | a start: a new piece, nothing composed | the repo made at the END — the piece is finished; this is its extraction from the sandbox | the piece was composed in `live-electronics-engine`; the composer asked for "a repo that's focused on just this piece" (engine journal §248) |
| 2026-10-12 | 2.1 | the profile decides which of containers 3 … 8 run | none of 3 … 8 run; the engine's playing parts are copied instead (the plan's S6) | not a piece of the notated lineage: no sampler instrument, no calibration, no notation stack |
| 2026-10-12 | 2.3 | the names: the session default, the piece chain, the package name, the Reaper guard, two ports, the loopMIDI prefix | only the folder (`synthesi-alpha`), the title (*Sýnthesi Alpha*) and ONE port, 8733 | no Reaper, no MIDI, no package; one small server. 8733 sits beside the engine's 8732 — it is NOT one of the lineage's port pairs |
| 2026-10-12 | 2.3 | "Composition #N in the lineage" | no number given | the lineage numbers the notated pieces; whether this one takes a number is his to say |
| 2026-10-12 | 2.4 | the method docs carried whole: AI_METHODOLOGY · SESSION_HYGIENE · PLANNING_METHOD · HOW_WE_WORK · SESSION_PROTOCOL · MORPH_NOTES · the checkpoint and postclear commands | NONE carried | his choice of the lean kit. His user-level CLAUDE.md and skills carry how he reads, the planning method and the session commands; `CLAUDE.md` here points to them and keeps the one rule that binds every claim |
| 2026-10-12 | 2.4 | LICENSE carried | NOT carried — no licence in the repo yet | the lineage's is MIT, written for code and scores. This repo holds the piece's RECORDING and finished versions and is to be public: which licence covers a sound recording is his to say, and is asked before the first push |
| 2026-10-12 | 2.5 | the record docs from skeletons: CLAUDE · README · PROJECT_JOURNAL · PLAN · PLANNER · RUNNING_LOG · COMPOSITION_NOTES · NITS · SWEEP_LIST · PERFORMANCE_NOTES | CLAUDE · README · PROJECT_JOURNAL (three sections, not seven) · PLAN · RUNNING_LOG · this register. NOT made: PLANNER, COMPOSITION_NOTES, NITS, SWEEP_LIST, PERFORMANCE_NOTES | the lean kit. Nothing is being composed, so there is no outline, sketch pad or sweep. PROJECT_JOURNAL was kept, though he did not name it, because the session skills read its §2 |
| 2026-10-12 | 2.5 | "PLAN (its § 0 = this protocol, for the profile)" | `docs/PLAN.md` is the standalone plan (S1 … S6, B1 … B7), carried from the engine, where it was agreed step by step (engine journal §248 … §259) | the plan existed before the repo did |
| 2026-10-12 | 2.5 | the skeleton `CLAUDE.md`, checked heading by heading against the LAST piece's | written fresh and short; checked against the SANDBOX's (`live-electronics-engine/CLAUDE.md`), heading by heading: the lab journal · keep what he likes (here: the shelf) · always include the link · every preview a real file · commit and push (here: commit; push not asked) · UI builds (pointed to, not copied) · machine notes | the last piece of the lineage is a notated one; the standing practices this piece lived by are the sandbox's |
| 2026-10-12 | 2.5 | RUNNING_LOG "§1: the composer's first message in the new repo, quoted whole" | §1 quotes the words that brought the repo about, said in the engine's session | there was no first message here: the repo was made from a session in the sandbox |
| 2026-10-12 | 2.6 | the planning repo: the piece in "pieces in play", at his word | not touched | not asked |
| 2026-10-12 | 2.2 | the push rule ASKED, per repo | not asked yet; no remote; nothing pushed | the repo is to be public at his word (engine journal §258); it is made and tried on his machine first |
| 2026-10-12 | 2.4 | LICENSE carried | carried NOW, and split in two (log §2): `LICENSE` — the lineage's MIT, for the program only (`engine/`, `tools/`) · `LICENSE-PIECE.md` — the piece and its record (`voices/`, `versions/`, `picture/`, `docs/`), © 2026 elosine, all rights reserved | his, session 2: "whatever is the common one for this type of code, MIT?" — then "a", MIT for the code and the piece stays his. A licence given cannot be taken back; "all rights reserved" can be opened later |
| 2026-10-12 | 2.2 | the push rule ASKED, per repo | the repo made PUBLIC on GitHub and `main` pushed (log §3); the push RULE asked the same hour, his answer not yet in — until it is: commit locally, "push now?" at session end | his, session 2: "yes public". The one push is what making it public means; a standing rule is a separate word |
| 2026-10-12 | 2.2 | the push rule ASKED, per repo | asked and answered (log §4): commit locally; "push now?" at session end | his "a" — the repo is public, so he looks before anything goes out. No deviation left on 2.2 |
| 2026-10-12 | S6 of the plan (not the protocol) | "the picture and the tool that draws it" copied over | the picture copied as BUILT files (`picture/`); the tool is NOT copied | `tools/score_valpha.py` reads the engine's corpus modules and two generated event files in its `build/` folder — it is rooted in the sandbox. The score is the same for every version, so the piece does not need to draw it again |
