# The first scenario — plan

*The top line was confirmed by J on 2026-10-11 ("top line is good" —
journal §193). It is built by his planning method: a step is laid out
when it is reached — its goal, then its sub-steps — and written here
the moment it is agreed. The IDs are stable. The reasoning is in the
lab journal, `docs/journal/2026-10-11.md` §187–§194.*

*From P2 on, a step's goal and its sub-steps are put to him together
(his word, 2026-10-11, §194).*

## His names

- **Electronics main** — "the main electronics core, what we have
  currently with the graphics and everything": v-alpha's sound and its
  scrolling score.
- **The interactive lane** — the performer's own belt, above the
  graphics: mic openings and whatever else he interacts with.
- **The elegant pause** — a stop that fades or rings out. *Deferred.*
- **Layer one · layer two · layer three** (§195) — electronics main ·
  the independent cursors over it (scrolling cursors and impact
  cursors) · the interactive electronics on the interactive lane.

## The scenario

He hits START. Electronics main plays about three containers by
itself and stops on a section end. Coloured cursors then travel over
what is showing — one kind plays a part at another speed, looped or
backward; the other is an impact, one small snippet with its own
animation. On the interactive lane a mic opening passes his centre
cursor; he plays one impulse; after a gap, a part of electronics main
on screen answers in kind.

**The first scenario is the first section only** (§195): three
containers and a stop; layer two runs; layer three runs, "either at
the same time or at different pauses"; then everything is reassessed
before the seed rolls the whole piece.

## The plan

**P1. Electronics main starts and stops** (START, a few seconds' wait,
about three containers, a stop on a section end; a rule that can run
the whole piece)

Result when done: He presses START. After a few seconds electronics
main begins by itself, plays about three sections, and stops on a
section end, sound and score together. The stop comes from a rule with
a seed: how long the wait, how many sections, where it stops. The same
rule can carry on through the whole piece (play, stop, wait, play),
always onward from where it stopped, and the same seed gives the same
run every time. He has heard what a plain stop sounds like at the loud
seams, and a light reverb is ready to soften it if his ear asks for
it. *(Goal agreed 2026-10-11 — "Yes, that's the goal", §194.)*

Scope, his (§195): the architecture is built whole — the seed "will
roll the whole piece when to start and stop" — but the run-through is
**the first section only**: three containers, a stop. Nothing restarts
yet. When and how electronics main restarts is decided at the
reassessment (P5), after the whole first scenario has been heard.

*(Sub-steps agreed 2026-10-11 — "Yes, but ...", §195.)*

**☑ P1 DONE 2026-10-11 (§196 … §198). Built and checked by numbers;
his verdict, in three hearings: EVERY STOP IS FADE + REVERB — the
sound fades over the last 120 ms into the section end, the light
reverb rings (`"stop": "fade + reverb"`). The click he heard on the
first takes was an engine fault, found and fixed (§197).**

- ☑ Write the rule as a small seeded file, shaped so the same seed can
  later roll every start and stop of the piece. For now it rolls one
  run: the wait before the start, and how many sections.
  → `voices/v-alpha/scenario/scenario-1.json`
- ☑ Starting numbers, for his ear to move: a 3 s wait · three sections.
- ☑ Make the page run it from START: wait, play, stop exactly on the
  section end — and hold there. → ENTER; `engine/scenario.js`
- ☑ One key stops everything. → ESC
- ☑ The score stops with the sound and holds still. *(by the position;
  the picture itself not seen by the AI)*
- ☑ Add go to a set, go to a time, and mouse-wheel scroll (from the
  alongside list; the loud-seam test needs them). The wheel by the
  rules in `docs/reference/ui-preferences.md`. → G; the wheel *(real
  wheel untried by the AI)*
- ☑ The quick test: the six loudest seams, each heard stopped plain,
  then with the light reverb (the page's own reverb, set light).
  → http://localhost:8732/engine/perform.html?seamtest=1 — now three
  buttons a row: plain · reverb · fade + reverb
- ☑ His verdict on the test sets how a stop behaves by default.
  → "Let's do the reverb for all of them" — `"stop": "reverb"` in the
  scenario file (§197)
- ☑ Added by his ear (§197): reverb alone, or fade + reverb ("we
  might need a fade and a reverb")? → "b, fade + reverb" (§198). *(That
  the click is gone to his ear: not said by him, not claimed.)*
- Carried forward, his to decide whenever: the picture rests 0.2 s
  before the seam line when the sound stops on it (§196 — the page's
  cursor lag, the parked playback-sync item).
- ☑ REQUIRED CHECK, by numbers: the stop lands on its seam — the first
  run's, and each of the six test stops. → 13 stops, each 0.000 ms
  from its seam (§196)
- ☑ Journal it, with a clip of a loud stop plain and one with the
  reverb. → §196; `docs/journal/media/2026-10-11-seam28-*.mp3`

**► P2. The moving cursors** (the scrolling cursor and the impact, in
layers; a rule that makes up their behaviours)

*In two halves, at his word (§199): first what the cursors play, then
the cursors.*

**☑ P2a · What the cursors play** (a scan finds short phrases and
impacts in every section; a sampler on the page lets him hear them,
plain and transformed; their starts and ends shaped)

Result when done: A scan has gone through every section and picked
what is worth replaying: two or three short phrases each, about half a
second to a second and a half, and the attacks for the impacts. He has
heard the first section's picks on the page: the phrases plain, one
after another, each shown on the score; a few of them slow, fast and
reversed; a few impacts. Each phrase starts and ends cleanly, and he
has said which picks are right and which are not. *(Goal and sub-steps
agreed 2026-10-11 — "good", §200.)*

**☑ P2a DONE 2026-10-11 (§200 … §202).** Built, checked by numbers,
and heard: his verdicts on the picks; the reads are plain and reverse;
a phrase ends with a fade and the lighter reverb; an impact has the
louder start and one loudness.

- ☑ Scan every section offline for phrases of 0.4 to 1.6 s: start on
  an attack, end in a dip. → `python tools/replay_scan.py`
- ☑ Rank them and keep the best two or three per section. → 68
  phrases; **short of the promise**: 7 sections have three, 12 two, 23
  one, 9 none (§200). Left as found until he has heard the rule.
- ☑ Impacts: his 35 accepted attacks first; the same scan fills the
  sections that have none. → 35 of his · 35 proposed · 12 sections
  still without
- ☑ One data file, per section, with the numbers behind each pick.
  → `voices/v-alpha/score/replay-index.json`
- ☑ Starts: a fade-in only where the scan says the attack is not
  clear. Report the count to him. → 42 of 68 clear, no envelope; 26
  get a 40 ms fade-in (2 of the first section's 8)
- ☑ Ends: a fade into the end; the light reverb as a second version.
  → an 80 ms fade; the panel's switch `fade` / `fade + reverb`
- ☑ The sampler on the page: the first section's phrases plain, then a
  few slow, fast and reversed, then a few impacts. Rows to click to
  hear one again. → http://localhost:8732/engine/perform.html?sampler=1
- ☑ Slow, fast and reversed matched in loudness to the plain one, by
  measurement. → makeup 8 · 7.5 · 10 dB; within 1 dB (reverse ±2)
- ☑ The sampler also as mp3s, sent to him. → previews/first-scenario/
- ☑ His verdicts by name; the picks and the ranking adjusted. → "all
  of them are good"; out: set 3 · phrase b and set 4 · scan attack b;
  the reads are PLAIN and REVERSE (slow and fast set aside); a phrase
  ends with fade + reverb, the reverb lighter (send 0.35). Kept in
  `voices/v-alpha/score/replay-verdicts.json`, which the scan reads.
  The ranking itself is unchanged: one rejection, the lowest-ranked
  pick, is not yet evidence (§201).
- ☑ Added by him (§201): one more try at a more impactful attack, on
  set 3 · attack a2 — five versions. → "close the trial, lets do the
  louder start" (§202): every impact gets +4 dB over its first 40 ms.
- ☑ Added by him (§202): "have a way to normalize the attacks". →
  each impact brought to the median loudness of his stored attacks
  (`gainDb` in the replay index; the panel's switch as they are /
  normalized): the first section's eight span 0.5 dB, from 9.3.
- ☑ Is the phrase reverb now light enough? → "reverb is good" (§202)
- Carried forward, told to him and unanswered: the scan finds fewer
  phrases than promised (24 sections one, 9 none); only sets 0 … 4
  have been heard.
- ☑ REQUIRED CHECK: every phrase starts on its attack and ends where
  the data says. → all 0.000 ms on the page; the attack 21 … 66 ms
  after the start in the data (§200)
- ☑ Journal it, with clips. → §200

**☑ P2b · Playing them in** (his MIDI keyboard plays the section's
attacks and phrases; what he plays is recorded as patterns and played
back; each sound shown on the score)

*REVISED by him 2026-10-11 (§203): the behaviours are PLAYED IN and
recorded, not made up by a seeded rule. §198/§202's "rule that makes
up their behaviours" is held — a later rule may deal out and order
what he recorded.*

Result when done: He plays the first section's material from his MIDI
keyboard. Low keys strike its attacks, a different one each hit; other
keys each play one phrase, forward or reversed; notes can overlap.
What he plays can be recorded as a pattern, stored under an automatic
name, and played back exactly as he played it. *(Agreed 2026-10-11,
§204 — with his changes: NO picture while playing in, "this is just
collecting data ... mostly about rhythm"; the velocity is kept in the
pattern and NOT used for loudness.)*

**☑ P2b DONE 2026-10-11 (§204 · §205).** Built, checked by numbers,
and used: he played in and stored seven patterns, pt1 … pt7 (289 hits,
195 s).

- ☑ The page hears his MIDI keyboard; the computer keys as a stand-in.
  → http://localhost:8732/engine/perform.html?playin=1 *(MIDI itself
  untested: the AI's pane refused the permission; the computer keys
  and the keys' entry point were)*
- ☑ Attacks: the low octave, a shuffled deck of this section's,
  overlapping freely, louder start, normalized. → C2 … B2, any key
- ☑ Phrases: one key each, plain and reversed, up to four at once,
  each ending with its fade and the lighter reverb. → white keys from
  C3 (plain) and from C4 (reversed); a fifth phrase takes the voice
  that would finish soonest
- ☑ The key map shown on the page.
- ☑ Record: one key starts and stops it. The pattern keeps each hit's
  time, sound and loudness. → C6, or the computer's 1
- ☑ Store with an automatic name; a list of stored patterns to click
  and replay. → `voices/v-alpha/library/patterns/pt1.json` …
- ☑ His first patterns: attack patterns, and patterns of phrases. →
  "Okay, the patterns are stored." pt1 … pt7 in
  `voices/v-alpha/library/patterns/` — mixed (pt1 · pt2 · pt3),
  attacks at speed (pt4 · pt6), phrases alone (pt5), sparse (pt7).
  MIDI worked: the files hold his keyboard's velocities (§205).
- ☑ REQUIRED CHECK: a recorded pattern replays the same sounds at the
  same times; the delay measured and told to him. → 15 of 15, phrases
  0.0 … 2.3 ms early, never late; key to sound about 50 ms (§204)
- ☑ Takes sent to him, and the journal. → §204

**► P2c · The transition** (electronics main moves on by itself;
section one's patterns give way to section two's; a second section
programmed)

*Added by him 2026-10-11 (§203) — the head of P5 pulled forward. His
order: play in → test → the transition → test → "program a second
sequence".*

Result when done: The first scenario plays as one passage from START.
Electronics main runs its three sections and stops. His patterns play
over the still score, and each sound shows where it comes from: a
coloured cursor travelling its phrase, a burst at its attack. After a
wait, electronics main moves on by itself and the patterns keep
playing. A sound is called only while its place is on screen, so
section one thins out as it scrolls away and section two's material
takes over as it arrives. It stops again on the next section end.
*(Agreed 2026-10-11 — "good, go ahead and build", §207.)*

**☑ BUILT 2026-10-11 (§207) AND SEEN (§208): "that looks quite good
... The transitions look really good. The cursors look great. The
impulses are good."** Two things carried out of it, below. ☑ = built
and checked by numbers · ► = his.

- ☑ Put his patterns into the scenario file. → `"sections"`: section
  one = pt1 … pt7 in the order stored, one after another, from the
  stop (`lead` 0)
- ☑ Roll electronics main for two runs, with a wait between them. →
  `runs` 2, `betweenWait` 15 s: sets 0–2, stop at 9.18 s; sets 3–5,
  stop at 18.88 s
- ☑ The picture, drawn over the score: a coloured cursor on a sounding
  phrase, moving as it is read; a burst at an attack. Colours from
  *Approaching*'s palette. → an overlay; the ten hues of its composer
  score *(whether that is the palette he meant: not known)*
- ☑ The rule: a sound is called only while its place is on screen. →
  an attack is a point, a phrase its WHOLE span
- ► Section two's material: hear its picks on the sampler, then play
  in its patterns. → the same two pages with `&sets=3-7`; then its
  pattern names go into `"sections"`
- ☑ Everything from one START; ESC stops it all.
- ☑ REQUIRED CHECK: no sound is called whose place is off screen; the
  same seed gives the same passage. → 61 hits: none called off
  screen, none skipped on screen; both stops 0.000 ms from their
  seams (§207)
- ☑ A take sent to him, and the journal. → §207
- ► His to weigh (§207): at the first stop the screen shows 1.36 …
  16.60 s, so set 0 · phrase a and set 0 · phrase b have already
  scrolled off — 26 of his 289 hits are silent by the rule.

- **The rule, adopted by him (§204): a sound lives while its place is
  on screen — the scroll itself is the crossfade.** Section one's
  patterns keep playing when the score moves on, their cursors riding
  it; a sound stops being called once its place has left the screen;
  section two's patterns may begin as soon as their places are on it.
- Moved here from P2b at his word (§204): **the picture** — a coloured
  cursor over a sounding phrase, a burst at an attack. The rule is
  about places on the score, so this step is where they must be seen.
- Already narrowed by his ear (§201): a cursor reads PLAIN or in
  REVERSE — not slow, not fast. The loop and the back-and-forth are
  made of those two.

**► NEXT — the order agreed by him 2026-10-11 (§210: "a good for
order"): P2d, then P2e, then P2f; each laid out (goal and sub-steps
together) when reached:**

**☑ P2d · The notation animates under the cursors** (the score's own
animation, locally, under a sounding phrase and at an attack; two
sounds on one place: THE LATEST WINS — his decision, §210)

Result when done: When a cursor reads a phrase, the notation of that
phrase moves as it does when electronics main plays it, in step with
the cursor, forward or reversed. When an attack is struck, its spot
bursts with its own animation. Where two sounds use the same place,
the notation follows the one that began last. The rest of the score
stays still. *(Built at his word 2026-10-11, §211.)*

**☑ P2d DONE 2026-10-11 (§211 · §212): "animation looks good."**

- ☑ Bring the per-cursor animation from the lanes view into the
  full-screen view. → `makeLens(a, b)` in engine/perform.html
- ☑ A sounding phrase: its notation animated to its cursor, reversed
  when read in reverse.
- ☑ An attack: its spot animated for the length of the attack.
- ☑ Two sounds on one place: the latest wins. → the later lens lies
  over the earlier
- ☑ It rides the score when the score scrolls.
- ☑ The coloured cursor, band and burst stay on top.
- ► REQUIRED CHECK: the stretch that animates is the stretch that
  sounds, and the picture stays smooth with several at once. → the
  first by construction and two screenshots; THE SMOOTHNESS NOT
  MEASURED (the AI's pane draws one frame a second) — cost: 7.8 ms
  to make a lens, 0.29 ms a frame to paint one. His eye.
- ☑ Screenshots, and the journal. → §211
- ► Seen, his to judge: a lens has a hard vertical edge where the
  still score's marks overhang it (§211).

**☑ P2e · The form by page** (at 1920 × 1080 one screen is 15.24 s of
score and the strip is twelve screens: twelve stops, one in the middle
of each — 9.18 · 22.39 · 37.18 · 54.35 · 68.83 · 82.42 · 100.06 ·
113.67 · 130.96 · 143.16 · 161.79 · 174.35 s; a run becomes a screen,
not "about three containers"; the wait at a stop: 45 s WITH JITTER, "so each formal container isn't
the same length" — his decision, §210; about twelve minutes in all)

Result when done: From START, electronics main moves through the whole
score in twelve screens. It plays one screen's worth, stops on the
section end nearest that screen's middle, waits about 45 seconds (a
little different each time), and goes on to the end. Each stop is a
section, and its material is what its screen shows. *(Goal and
sub-steps agreed 2026-10-11 — "good, checkpoint first then build after
clear", §213.)*

**☑ BUILT 2026-10-11 (§214), checked by numbers; not yet seen or
heard by him.** ☑ = built and checked · ► = his.

- ☑ The rule: a run is one screen; the stop is the section end nearest
  the screen's middle. → `"run": "page"` in the scenario file;
  `rollLayer1`. *(Stated exactly, §214: the section end whose PICTURE —
  0.2 s behind the sound — is nearest the middle.)*
- ☑ The twelve stops: 9.18 · 22.39 · 37.18 · 54.35 · 68.83 · 82.42 ·
  100.06 · 113.67 · 130.96 · 143.16 · 161.79 · 174.35 s. → computed by
  the tool, the same twelve
- ☑ The wait: 45 seconds, plus or minus 20 percent, drawn from the
  seed. → `betweenWait` `{"range": [36, 54]}`; seed 1 gives 36.05 …
  53.91 s, 12 min 25 s in all. *(The ± 20 % is the AI's number.)*
  **Changed by him, §215 — "closer to 9-10 min": the wait is now
  32 s ± 6, `{"range": [26, 38]}`; seed 1 gives 9 min 42 s.**
- ☑ The screen's shape is fixed at 1920 × 1080 for the form and for "on
  screen", whatever window it is shown in. → `"form"` in the scenario
  file; `halfSpan` = 7.62 s
- ☑ Twelve sections written into the scenario file, each with the
  phrases and accents its screen shows. → `python tools/page_form.py`;
  page 1 keeps pt1 … pt7
- ☑ After the twelfth stop, the score plays out to its end. → to the
  end of the sound, 182.13 s
- ☑ The sampler and the play-in take a page number. →
  `perform.html?sampler=1&page=N` · `?playin=1&page=N`; on a page with
  more than seven phrases (page 12 has nine) the plain row runs C3 …
  D4 and the reversed row begins at F4
- ☑ START from any page, so he can work on one without playing from the
  top. → `perform.html?page=N`, ENTER: the run into page N, then on
- ☑ REQUIRED CHECK: the twelve stops land on their section ends; the
  same seed gives the same waits. → all twelve 0.000 ms; the roll
  identical twice from seed 1 (§214)
- ☑ The journal. → §214
- ► His to weigh (§214): page 6's screen holds ONE phrase and ONE
  accent of the scan's picks; nine picks are on no page's screen
  (0a · 0b · 15a · 15b · 20a · 25b · 26a · a12 · m26a).

**► P2f · The overlays** ("each section ... some processing overlays ...
probably its own effect": a crescendo or decrescendo through a phrase ·
a tremolo over all the cursors' sound · his `icy` slow-down · `icy`
with the read accelerating and decelerating (added §209) · his
buffer override, workshopped toward "accelerating into a blur"; FM
DROPPED by him, §210; under his fingers while he plays in where possible)

Result when done: Each of the five overlays exists and has been tuned
by his ear in its own workshop: a crescendo or decrescendo through a
phrase; a tremolo over everything the cursors play, its speed moving
in patterns; his icy slow-down; icy with the read speeding up and
slowing down; and the buffer override, going from distinct impulses
into a blur. On the play-in page he switches one on and hears it under
his fingers. The pattern he records keeps it. A page can carry its own
overlay, and from START it sounds that way. Electronics main itself is
untouched. *(Goal and sub-steps agreed 2026-10-12 — "yes thats the
goal, a is good", §217. The order of the workshops is his choice a:
easiest first.)*

**☑ P2f's BUILDING IS DONE 2026-10-12 (§217 … §228): five workshops
closed, thirteen overlays — `cresc` · `trem rush` · `trem waves` · `chop
accel` · `icy 10x` · `icy 10x short` · `icy 17x` · `icy 15x short` · `icy
accel` · `icy decel` · `icy accel long` · `icy decel long` · `override
wave`.** ☑ = built and checked by numbers · ► = his.

- ☑ One bus for everything the cursors play, so an overlay can sit over
  all of it. → `cursorBus`, engine/voices.js
- ☑ On the play-in page: a row of overlay buttons — named presets, one
  on at a time, "off" among them. → `perform.html?playin=1&page=N`;
  the presets are the scenario file's `"overlays"`
- ☑ A recorded pattern keeps the overlay it was played with. → hit by
  hit, so switching in mid-take replays as played
- ☑ A page names its overlay in the scenario file; START uses it. Laying
  one over afterwards means changing that name. → `"overlay": "cresc"`
  in the page's section; `"off"` = none; no name = as played
- ► Workshop 1 · crescendo / decrescendo. → BUILT: `cresc` 24 dB ·
  `cresc molto` 48 dB · `decresc` 24 dB · `decresc molto` 48 dB, on the
  play-in page and as mp3s (previews/first-scenario/swells-*.mp3). The
  screen (§217): 12 dB only holds a phrase level; the bend of the line
  is inaudible by the numbers. **His verdict: which become buttons.**
  → **"lets go with regular cres as the overlay" (§218): `cresc`,
  24 dB, is the one; the row is off · cresc.** Open, put to him: on a
  crescendo page do the ATTACKS get their own crescendo too (his
  sentence — "phrases and attacks each with their own crescendo") or
  stay strikes (as built)? → **"just leave the attacks" (§219): the
  phrases swell, the attacks stay strikes. ☑ WORKSHOP 1 CLOSED.**
- ► Workshop 2 · tremolo — steady, and quickening in patterns.
  → BUILT (§219), on the bus: `trem` 8 Hz · `trem accel` 4 → 24 Hz over
  8 s · `trem rush` the same over 3 s · `trem waves` up and back down ·
  `chop accel` a square to silence — on the play-in page and as mp3s
  (previews/first-scenario/tremolo-*.mp3, his pt1 under each). Within
  0.6 dB of the untouched take. The screen: under 6 Hz the LFO is heard
  across the hits, not inside them; at every speed it also re-deals
  which hits speak. **His verdict: which become buttons.** → **"the
  last three, the rush, waves, and [accel]" (§220): `trem rush` · `trem
  waves` · `chop accel`. ☑ WORKSHOP 2 CLOSED.**
- ► Workshop 3 · icy, from *Approaching*'s numbers. → BUILT (§220):
  his ten grain windows in the page; icy on each phrase — `icy 4x` ·
  `icy 10x` · `icy 30x` (his numbers: 0.6 s, 17 grains, expodec, rand
  0.2) · `icy 10x short` (0.15 s windows) · `icy 10x long` (1.2 s) — on
  the play-in page and as mp3s (previews/first-scenario/icy-*.mp3).
  Level within about 1 dB of the untouched phrase. At his 30× one
  phrase lasts about 25 s. **His verdict: which become buttons — and
  how long a slowed phrase may last.** → **(§221) four: `icy 10x` ·
  `icy 10x short` · `icy 17x` · `icy 15x short` (grains 0.21 s, his
  number). ☑ WORKSHOP 3 CLOSED.**
- ► Workshop 4 · icy accelerating and decelerating, pitch held.
  → BUILT (§221): a preset's speed as [from, to] — `icy accel` (20× →
  2× slower) · `icy decel` (2× → 20×) · `icy accel long` (50× → 4×) ·
  `icy decel long` (4× → 50×), on the play-in page and as mp3s
  (previews/first-scenario/icy-moving-*.mp3). Within 0.6 dB of the
  untouched phrase once each phrase's dwell is taken out. The cursor
  now follows the read itself. **His verdict: which become buttons.**
  → **"lets keep all 4" (§222); all wet — the stretch alone, as built.
  ☑ WORKSHOP 4 CLOSED.**
- ► Workshop 5 · the buffer override — a new small unit in the page. His
  three shapes side by side: accelerating into a blur · straight into
  a blur · distinct impulses shifting into a fuzz.
  → FIRST ROUND BUILT (§222): engine/override-processor.js on the
  cursors' bus — his clone's way of working with what it lacked, the
  repeat's RATE on a curve. `blur accel` (8 → 120 repeats a second
  over 8 s) · `blur accel long` (over 16 s) · `blur` (120, steady) ·
  `blur low` (48) · `blur shift` (8 for 5 s, to 120 in 0.8 s, 4 s
  there) — on the play-in page and as mp3s
  (previews/first-scenario/override-*.mp3, his pt1 under each). Within
  2.1 dB of the untouched take. **His ear: which are near, and what to
  turn — the rates, the time, the forced buffer (0.25 s).**
  → "I think I need to turn the dials themselves" (§223): THE OVERRIDE
  LAB — http://localhost:8732/engine/override-lab.html — three long
  phrases looping, the dials (the plugin's own, §224: divisor · start,
  divisor · end, forced buffer, smoothing, dry / wet — plus time · hold
  · stay), the curve drawn, store → ov1 …
  (voices/v-alpha/library/overrides/). **► his hands: the settings he
  stores become the override's buttons.**
  → **HIS (§228): divisor 4.8 → 8, size 0.48 → 0.2 s (10 → 40 repeats
  a second), on a WAVE — up, a hold at the top, down, a hold at the
  bottom (4 · 2 · 4 · 2 s, the AI's times). One overlay, `override
  wave`; the steady states along it are effect presets ov2 … ov6 in
  the library. ☑ WORKSHOP 5 CLOSED.**
- Every workshop the same way: a few named candidates, as mp3s and on
  the page → his verdict → the keepers become the buttons.
- The picture follows a changed read: a slowed phrase's cursor and
  notation move at the slowed speed.
- REQUIRED CHECK: an overlay on or off stays at one loudness
  (measured); a pattern recorded with an overlay replays the same.
  → workshop 1 (§217): 34 of 40 within 1.3 dB of the untouched phrase
  (each phrase has its own makeup); 6 held under by the +18 dB cap, on
  the two phrases that are nearly all attack. A 5-hit pattern replayed
  with the same overlays at the same times.
- The journal, with clips.

His readings, confirmed with the goal (§216): one overlay to a page,
one on at a time · which overlay goes on which page is chosen in the
work list (P2g), not here · the crescendo and icy change how a PHRASE
is read; the tremolo and the override sit over the bus and take the
accents too · electronics main is not processed.

**P2g · The work list** (named by him, §212: when all the new building
is done — "figure out the form first. Do the effects workshops. And
anything else we need to settle" — one procedure run for every page:
its phrases and accents identified, played on the MIDI keyboard into
sequences, "with fx when possible")

**► BEGUN 2026-10-12 at his word (§229): "let's take the sections in
order and then we'll design sequences for each one."** Not laid out as
a list first — run page by page, each page's sequences PLAYED IN or
DESIGNED as it asks (the designed sequence is built at the first page
that needs it: see Held). For a played-in page: its overlay named in
its section → its picks heard on the sampler (`?sampler=1&page=N`) →
sequences played in with the overlay on (`?playin=1&page=N`; what is
stored there belongs to the page by itself) → heard from START
(`?page=N`).

| page | stop | overlay | sequences | state |
|---|---|---|---|---|
| 1 | 9.18 s | — | pt1 … pt7, played in | ☑ done |
| 2 | 22.39 s | `cresc` | pt8 … pt13, played in (§230: 115 hits, 123 s) | ☑ played in — ► his ear from START (`?page=2`) |
| 3 | 37.18 s | `trem waves` (his, by playing: all six takes) | pt14 … pt19, played in (§232: 87 hits, 105 s) | ☑ played in — ► his ear from START (`?page=3`) |
| 4 | 54.35 s | the four STRAIGHTFORWARD icys only (his correction, §237) | DESIGNED (P2h, §234 · §235 · §237): whole containers accreting, every other one backward — seed 1 now deals three | ☑ built — ► his ear again (the deck changed after his "ok good") |
| 5 | 68.83 s | the four icys that CHANGE SPEED only (§237) | DESIGNED (§236 · §237 · §239): backward first, entries at 10 · 15 · 20 · 25 % …, jitter ± 2; EVERY container that shows — sets 20 · 21 · 22 · 23, the cut ones as much as shows; six reads; voices of its own | ☑ built — ► his eye and ear (`?page=5`) |
| 6 | 82.42 s | `override wave`, ONE TURN across the page (start → top → plateau → start) | DESIGNED (§240): the three containers that show, ONE AT A TIME, backward · forward · backward …, by a roll; read as they are | ☑ built — ► his eye and ear (`?page=6`) |
| 7 | 100.06 s | stream 1 `trem rush` · stream 2 `cresc` | HIS SEQUENCES REUSED (§241): his rhythms on page 7's sounds, dealt by the seed to fill the page, TWO AT ONCE — seed 1: pt9 · pt15 and pt17 · pt3 | ☑ done — "That's what I wanted" (§242); a stand-in for a phrase key is always a phrase |
| 8 | 113.67 s | stream 1 `trem waves` · stream 2 `trem rush`, over ICY SAMPLES | his sequences, two at once (§242) — the page's containers PRE-PROCESSED through rolled icys (`python tools/icy_render.py 8`); the cursors and accents read the icy version at the place they sit; seed 1: pt5 · pt2 and pt7 · pt6 | ☑ built — ► his eye and ear (`?page=8`) |
| 9 | 130.96 s | two streams, both `cresc`, over OVERRIDE samples | his sequences (§243); the containers pre-processed with the buffer override, one turn across each | ☑ built — ► his eye and ear (`?page=9`) |
| 10 | 143.16 s | THREE streams: `cresc` · `trem rush` · `cresc` | his sequences (§243); half the containers through the icys that change speed, half as they are | ☑ built — ► his eye and ear (`?page=10`) |
| 11 | 161.79 s | three streams: `trem waves` · `cresc` · `chop accel` | his sequences (§243); half the containers icy, half override | ☑ built — ► his eye and ear (`?page=11`) |
| 12 | 174.35 s | an ACCRETION of whole processed containers + two streams, `trem waves` · `trem rush` | (§243) all the containers icy, half of them through the override as well — "in layers" | ☑ built — ► his eye and ear (`?page=12`) |

**☑ THE FINAL DRAFT (§246): "Okay, this is good ... let's say this as
the final draft." Git tag `v-alpha-final-draft`; seed 1; 9 min 42 s.**

**All twelve pages are made (§243) — and KEPT: "form is good lets
keep" (§245).** The buffer override is 3 dB up at the effect (his, §245;
live and in the samples). The notation under a sound animates as WHOLE
MARKS, no rectangle (his a, §245). The samples of pages 8 … 12:
`python tools/icy_render.py 8` · `python tools/page_samples.py 9` (… 12).

What he plays with wins (§231): a hit keeps its overlay, a pattern its
tremolo switches; the page's overlay is what the play-in opens with and
what anything played in bare is given.

**► P2h · The icy page** (whole containers read icy, entering over one
another a little sooner each time, by the seed — the first DESIGNED
sequence; his rule, §233)

Result when done: On the icy page, when electronics main stops, nothing
dry sounds. One of the page's whole containers, drawn by the seed,
begins to be read icy — its icy dealt from a shuffled deck of his
eight. Its coloured cursor crawls across the container at the speed of
the read, the notation moving under it. At about 40 % of its way a
second container enters over it; at about 30 % of that one's, a third;
then about 20 %. Each a little sooner, each with some jitter, up to
four at once. The same seed gives the same accretion every time.
*(Goal and sub-steps agreed 2026-10-12 — "yes thats the goal, a is
good, go ahead and build", §234.)*

**☑ BUILT 2026-10-12 (§234), checked by numbers; waits on his eye and
ear:** http://localhost:8732/engine/perform.html?page=4 — [begin], ENTER.

- ☑ Make a whole container something a cursor can read. →
  `containerOf`, engine/scenario.js
- ☑ Give these reads four voices of their own, so the next page's
  phrases do not cut them. → +256 MB in the tab
- ☑ Write the design into the page's section of the scenario file. →
  `"design"`: accrete · enter 0.4, 0.3, 0.2, 0.1 · jitter 0.05 · the
  eight icys · four at once; `"containers"` written by the form tool
- ☑ The seed rolls it: the order of the containers, the icy for each,
  each entry's moment. → `rollDesign`; seed 1: set 17 · icy decel
  long, set 19 · icy 10x at 16.6 s, set 16 · icy 10x short at 24.5 s,
  set 18 · icy 15x short at 30.2 s
- ☑ The deck: his eight icys shuffled; shuffled again when all are dealt.
- ☑ Name page 4 the icy page.
- ► Check the cursor and notation on a read this slow. → NOT SEEN (the
  AI's pane does not draw); built on §221's cursor-follows-the-read.
  His eye.
- ☑ Check it is fully wet. → electronics main at zero through the 38 s
- ☑ When the score moves on, the icys PLAY OUT to their own ends, over
  the next page — his choice a (§234): the decretion, by itself. → the
  last ends 29 s after the move. With four sounding the next WAITS for
  one to end; nothing is cut.
- ☑ REQUIRED CHECK: same seed, same accretion; each entry where the rule
  says; never more than four. → identical twice; 37.9 · 26.9 · 20.1 %;
  four at most
- ☑ A take sent; the journal. → previews/first-scenario/icy-page-4.mp3;
  §234
- ► His to weigh (§234): four icys together are about 5 dB over
  electronics main; when the score moves on under them the peaks touch
  the limiter.
- ☑ **Seen and heard by him (§235): "ok good" — and his change: every
  other entry reads its container BACKWARD** (`"reverse": "every
  other"` in the design): set 17 forward, set 19 backward, set 16
  forward, set 18 backward. **☑ P2h DONE.**

His readings, confirmed with the goal (§233): page 4 is the icy page ·
the deck is all eight icys · jitter ± 5 points · after 20 % further
entries come at 10 % · reads are forward · rendering and playing back
is for later, at the performance-rig stage.

> **P3 … P7 are NOT v-alpha's (his decision, §249, 2026-10-12):** "for
> V alpha ... this is it ... there's no open mic or interactive
> electronics." v-alpha is the final draft — layers one and two. These
> five stay written here, never laid out, for a later piece ("V beta")
> made from this engine.

**P3. The interactive lane** (its own belt with mic openings; his
impulse stood in for by a sample from *Approaching*)

- *to be laid out when we discuss it.*

**P4. The call and response** (after a gap, a part of electronics main
on screen answers)

- *to be laid out when we discuss it.*

**P5. The form** (when the three happen, alone or together, across the
piece; all of it from one START)

- *to be laid out when we discuss it.*
- It opens with **the reassessment** (his, §195): with the whole first
  scenario heard — "see if there's things we have to add and whatnot
  and how that algorithm, the initial one, should run. When it
  restarts or it waits for some of those other things to finish before
  it restarts". Only then is the whole piece rolled, continuing from
  section one.

**P6. The live mic** (set-up, one impulse caught)

- *to be laid out when we discuss it.*

**P7. The recording patch** (the piece's own mic openings in a row;
his playing sampled, the samples reused in the finished score)

- *to be laid out when we discuss it.*

## Alongside — slotted in as the work goes

- The score page, from the composer score of his other pieces:
  mouse-wheel scroll back and forth · go to a time · go to a set
  (there are 51). No zoom yet. (§189)

## Deferred

- **The elegant pause** — for now a stop is a plain stop on a section
  end (§192). The numbers for it are already measured: the quietest
  instant near each seam, in §192's table.

## Held — not dropped ("you can hold on to everything")

- **The icy section is programmed, not played in** (his note, §221):
  "the animated cursor will follow the buffer read. And I'd like to
  play whole sections, but then have them accrete, have them overlay
  each other at a certain pace. Maybe until there's four sections
  playing and then decrete, but we'll have to figure that out. So
  instead of me playing in this sequence, we'll program a sequence for
  that section." The cursor following the read is built (§221); the
  rest is to be laid out when it is reached. **The four moving icy
  too** (§222): "same note from last series, we'll program a specific
  sequence for these and have the cursor follow the speed, all wet so
  none of the original sound".
- **The override is played over a container, not a sequence** (his
  note, §228): "this will be like the icy, where we play these instead
  of a sequence, we just play these over a full container or ... a
  phrase, numbered phrase. And we also do it over reverse ones too. And
  then maybe we stack some of them ... there'll be a separate sequence
  pass, some of which I'll play and some of which we'll just design."
  With the two icy notes above it is one need: a DESIGNED sequence —
  long things, forward or reversed, entering over one another — beside
  the played one. Nothing builds it yet.
- **As little live processing as possible** (his note, §221): "since
  we'll mostly have the data from this sequence ... we can just render
  those and then play the recorded versions back and have the
  animations correspond ... expensive effects will need to render like
  this one and then cheaper effects like maybe the tremolo, we can have
  all that live." For "the stage to sort out the actual live
  performance rig". Checked (§221): attacks are plain playback; a plain
  phrase is the granular reader giving back the file; a reversed phrase
  and icy are real processes — those are the renders.

- **How the patterns are sequenced** — "having ... the sequences
  running continuously is maybe not ideal ... Sometimes play those,
  sometimes not, or have a timing sequence of the actual patterns ...
  maybe we wait on that until we have a few more sections" (§208).
  §210: it "might be okay" to let them play on as the pages shift;
  if not, two ideas held — "programmed in breaks", or "a rough density
  curve" over the whole piece, drawn in or laid over.
- **Which of his patterns play, and when** — the 26 silent hits are no
  matter (§212): the patterns are "the fund of phrases and don't even
  need to be in order".
- **The algorithms between him and the electronics** — flocking · the
  three body problem · anticipation–reaction (§190).
- **The effects of *Approaching*** — the 32-effect chain, his petals of
  resonance and `icy`; and a way to generate presets and preview them
  (§188). The SuperCollider engine comes in when a step needs an
  effect; nothing is ported before that.
- **A listener for whole rhythms** — the mic's attacks turned into a
  rhythm, after the scattered strikes (§188 finding 2, §189).
- **The main score's other scrolling behaviours** — rewind, a second
  or third belt (§190).
- **The studio assistant** — gain staging, mic set-up, a phone link to
  the recording room; built as a need shows (§189).
- **The gesture library's open items** — his ear on the Stutter Lab,
  stutters into the Assembly Lab, and the rest of running-order 6b ·
  6c (paused 2026-10-11).
