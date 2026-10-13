"""A candidate, KEPT: from build/versions/ onto the shelf (docs/PLAN.md S5; log §20).

    python tools/shelve.py seed-3 --what "a few words on what it is" --verdict "his words"

"Only a version he has heard and kept goes onto the shelf" — so this is run at his word, with his
words. It copies the candidate's folder to versions/<name>/, checks the copy against what was made,
adds its row to versions/shelf.json (the list the player opens on) and its line to the table in
versions/README.md, and clears the candidate. It does not commit: that is a second look.

It refuses: a name already on the shelf (a made version is never written over) · a candidate that
is not whole · a candidate whose own check counts sounds that began late (a spoiled take).
"""
import argparse
import filecmp
import json
import pathlib
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CANDIDATES, SHELF = ROOT / "build" / "versions", ROOT / "versions"

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Put a kept candidate on the shelf.")
    ap.add_argument("name")
    ap.add_argument("--what", required=True, help="a few words on what it is")
    ap.add_argument("--verdict", required=True, help="the composer's words on hearing it")
    ap.add_argument("--keep-candidate", action="store_true", help="leave the copy in build/versions/ too")
    a = ap.parse_args()
    src, dst = CANDIDATES / a.name, SHELF / a.name
    if not (src / "version.json").exists() or not (src / "sound.flac").exists() or not (src / "picture.json").exists():
        raise SystemExit(f"{src} is not a whole candidate (version.json, sound.flac, picture.json)")
    if dst.exists():
        raise SystemExit(f"{dst} is on the shelf already — a made version is never written over")
    facts = json.loads((src / "version.json").read_text(encoding="utf-8"))
    late = (facts.get("check") or {}).get("soundsLate")
    if late:
        raise SystemExit(f"{a.name} is a SPOILED take: {late} sounds began late. It is not shelved.")
    if facts.get("partial"):
        raise SystemExit(f"{a.name} is not the whole piece (a short pass: {facts['partial']}). It is not shelved.")
    shutil.copytree(src, dst)
    names = sorted(p.name for p in src.iterdir())
    same, differ, errs = filecmp.cmpfiles(src, dst, names, shallow=False)
    if differ or errs or len(same) != len(names):
        raise SystemExit(f"the copy is not what was made: {differ or errs}")
    mastered = (dst / "master.flac").exists()
    shelf = SHELF / "shelf.json"
    s = json.loads(shelf.read_text(encoding="utf-8"))
    row = {"folder": a.name, "what": a.what, "verdict": a.verdict}
    if mastered:
        row["plays"] = "master.flac"
    s["versions"].append(row)
    shelf.write_text(json.dumps(s, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    # the table in the shelf's README: a line after the last version's
    readme = SHELF / "README.md"
    lines = readme.read_text(encoding="utf-8").split("\n")
    rows = [i for i, l in enumerate(lines) if l.startswith("| `seed-")]
    t = facts["sound"]["seconds"]
    line = (f"| `{a.name}` | {facts.get('made', '')} | {int(t // 60)} min {t % 60:04.1f} s | {a.what} — the composer's "
            f"word: {a.verdict}" + ("; mastered" if mastered else "") + " |")
    if rows:
        lines.insert(rows[-1] + 1, line)
        readme.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    if not a.keep_candidate:
        shutil.rmtree(src)
    print(f"on the shelf: versions/{a.name}/ ({len(names)} files, each the same as made)"
          + (" · the player plays its master" if mastered else " · NO master: the player plays the sound as made")
          + ("" if a.keep_candidate else " · the candidate's copy is cleared"))
    print("not committed — look, then: git add versions && git commit")
