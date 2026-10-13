# On stage — the set-ups, and what to bring

*The plan's S4, built as B4 (`docs/RUNNING_LOG.md` §15). Current state; rewritten freely.*

## The rule

- **One machine has the sound, always.** It shows the picture too.
- Every other machine shows **the picture only**, and keeps it to the sound.
- **ENTER on any machine begins them all. ESCAPE on any machine stops them all.**
- **If the network goes, nothing stops.** Every machine carries on by itself.

## The three set-ups

| | the sound | the other machines |
|---|---|---|
| **one** | one laptop: sound, projection, your view | — |
| **two** (the common one) | the venue's machine: sound and projection | your laptop or iPad on stage: your view |
| **three** | a laptop at the desk: sound | a video machine: projection · an iPad on stage: your view |

They are one arrangement, on one, two or three machines.

## The kit

**You bring**

- your laptop, with this repo on it. It holds the piece and runs the small server.
- for set-up two or three, if the house network cannot be used: your own router, or a
  phone's hotspot.

**The venue gives**

- a network that all the machines are on — wired or wifi.
- for set-ups two and three: machines with a current browser. **Nothing is installed on
  them.**

## To set up

1. On your laptop: `python tools/serve.py`
2. Find your laptop's address on the network: `ipconfig`, the line "IPv4 Address" —
   something like `192.168.1.23`.
3. On every OTHER machine open `http://<that address>:8733/player/`
   On your own laptop: http://localhost:8733/player/
4. On each machine click the version.
5. On ONE machine: [begin — sound and picture]. On the others: [begin — picture only].
6. Press F11 on each for the full screen.
7. ENTER on any machine.

Things that bite:

- **Windows asks, the first time, whether Python may be reached from the network.**
  Allow it, for private networks. If the other machines cannot open the address, this is
  the first place to look.
- **Turn off sleep and the screensaver on every screen.** A page opened from another
  machine cannot keep a screen awake by itself.
- **The sound machine fetches the sound once, at [begin]** — 35 MB from your laptop. Do
  it before the audience is in. After ENTER nothing is fetched.
- A machine that says "ANOTHER MACHINE HAS THE SOUND": it is right — begin it with the
  picture only. (Click the sound button a second time to take the sound there instead.)

## The trim — a screen whose picture comes late

A projector or a television delays its picture, and nothing in software can know by how
much. On THAT machine:

- RIGHT — the picture 10 ms earlier · LEFT — 10 ms later · with SHIFT: 1 ms
- it is kept on the machine, and shown for a moment when it changes.

## What a machine knows — H

`H` shows, in a corner: sound or picture only · the version · the trim · the network
(how many machines, how well its clock is known) · on a picture-only machine, how far
it stood from the sound at the sound's last word, and what it did about it.

## If the network is gone

- **During the piece:** nothing to do. `H` says "THE NETWORK IS GONE — going on alone".
- **Before the start:** press ENTER on each machine by hand, as near together as you
  can. Close, not exact; the sound is never touched.
- **With no small server at all** (the files opened from a share): every machine is by
  itself, begun and stopped by hand.

## How it keeps together, in four lines

- The sound machine says, every two seconds, where its sound IS.
- A picture-only machine runs its picture on its own clock and compares.
- Inside what the clocks can be wrong by, it does nothing. Past that it runs up to 1.5 %
  fast or slow until it is back — never a jump, once the score is moving.
- **The sound is never corrected.**

## What has been measured — and what has not

Measured on ONE machine, two pages of one browser, through the small server
(`docs/RUNNING_LOG.md` §15):

| | |
|---|---|
| ENTER on the picture-only page → the sound begins | 0.14 s later |
| the picture-only page, from the sound, once in step | within about 1 ms |
| its network pulled for 4 min 40 s | it went on alone; 0.4 ms out when the network came back |
| a jump once the score is moving | none |
| ESCAPE on either page | both stop, 3 ms apart |

**Not measured — yours, with the machines:** two real machines · a house wifi · an
iPad · a projector's delay · pulling a real network. Two machines' clocks drift apart
more than one machine's two clocks do: expect some 10 to 20 ms over the ten minutes with
the network gone, and nothing you can see with it there. `H` on the picture-only machine
shows the figure, live.
