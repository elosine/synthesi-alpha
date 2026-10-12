# Research journal

A running record of **why**, kept because the reasoning is the part that gets
lost. This work is expected to become one or more papers, and by then nobody
will remember why a threshold moved, why an approach was abandoned, or which of
two plausible explanations turned out to be the right one.

## What goes in

- The idea, and what prompted it
- What was tried, and the numbers it produced
- What was decided, and **why that rather than the alternative**
- **Dead ends, at the same weight as successes.** An approach that failed for a
  measurable reason is worth as much to a paper as one that worked, and it is
  the first thing to disappear from memory. Several of the most useful things
  learned here are negative results.
- Corrections. When a claim made earlier turns out to be wrong, the correction
  goes in the journal rather than quietly replacing the original.
- **A clip, whenever the entry is about a sound.**

## What does not

Current state, file layouts, how to run things. Those live in the plans and
READMEs, which are rewritten freely. **The journal is append-only**: entries are
not edited once written, because a record that gets tidied is no longer evidence
of how the thinking actually went.

Where an entry later proves wrong, a subsequent entry says so. The original
stays.

## Media

Entries about sound carry a clip, cut by

```
python tools/journal_clip.py <source.mp3> --name <date>-<slug>     --at 12 --for 15 --what "..." --how "..."
```

Fifteen seconds, mono, into [`media/`](media/), with a row recording what it is
and how it was derived. Both are required arguments: a clip whose derivation is
unrecorded proves nothing.

**Excerpts, not renders.** Fifteen seconds makes the point a whole render would
make at a hundredth of the size, and this has to stay readable on whatever
machine opens the repository in three years. Full renders live in `build/`
(disposable) and `keep/` (kept).

Clip the thing the entry is *about*. If an entry claims a change was audible,
the clip is what makes that checkable later. If it claims a change was
inaudible, clip both and say so.

## When entries get written

While the reason is still in front of you - at the end of any exchange that
produced a decision, a result, a rejection or a question worth remembering. Not
at the end of a session, by which time the reasoning has already blurred. The
practice is written into [`CLAUDE.md`](../../CLAUDE.md) so it does not depend on
being asked for.

## Relationship to the other logs

| | |
|---|---|
| [`docs/design/dictation-log.md`](../design/dictation-log.md) | Verbatim dictation, append-only. What was *said*. |
| **this journal** | Narrative of decisions and experiments, append-only. What was *thought and tried*. |
| `docs/plan/*` | Current intent. Rewritten freely. |
| commit messages | The change record, per change. |

## Entries

| | |
|---|---|
| [2026-10-12](2026-10-12.md) | §217–: P2f the overlays agreed — the cursors' bus, the overlay buttons, workshop 1 (crescendo and decrescendo: with the grain, against the grain) |
| [2026-10-11](2026-10-11.md) | §186: the return after the break — a survey of the repo, and the question of how the workshop and its pieces are organised |
| [2026-09-01](2026-09-01.md) | §131–185 (holds the 2026-09-02 entries): the attack studies — timbre as mechanism, the natural attack wins, gate alone — the Accented Long Tone Lab, the Stutter Lab, the break |
| [2026-08-30](2026-08-30.md) | §109–130: the sandbox under J's fingers, the endings and the bus, the library and its taxonomy, the Attack, Freeze and Assembly Labs |
| [2026-08-29](2026-08-29.md) | The sand score becomes a performance transport; playhead-based electronics dictated |
| [2026-08-28](2026-08-28.md) | The voice-building workflow: briefings, the Choosing Lab, specs and strips |
| [2026-08-27](2026-08-27.md) | Toolchain recovery, the onset and pulse detectors, retrieval, and two reframings that each simplified the work |
