#!/usr/bin/env python3
"""Annotate README entries with a ⭐ star badge for notable repos (>=10 stars).
Non-destructive: only appends a badge to existing entry lines; never deletes entries.
Idempotent: strips any existing ' ⭐N' / ' `⭐N`' badge before re-adding.
"""
import re, sys, pathlib

STARS_FILE = pathlib.Path.home() / "awesome-deepseek-harness" / ".stars-snapshot.tsv"
THRESHOLD = 10

# load stars: full_name -> stars
stars = {}
for line in STARS_FILE.read_text().splitlines():
    parts = line.split("\t")
    if len(parts) >= 2 and parts[1].isdigit():
        stars[parts[0].lower()] = int(parts[1])

badge_re = re.compile(r"\s*`?⭐[\d,]+`?")           # existing badge to strip
entry_re = re.compile(r"^(- \[)([^\]]+)(\]\()(https://github\.com/([A-Za-z0-9._-]+/[A-Za-z0-9._-]+))")

def process(path):
    p = pathlib.Path(path)
    out = []
    changed = 0
    for line in p.read_text().splitlines():
        m = entry_re.match(line)
        if m:
            repo = m.group(5).lower()
            st = stars.get(repo)
            # strip any existing badge first (idempotent)
            line = badge_re.sub("", line)
            if st is not None and st >= THRESHOLD:
                # append badge at end of the line
                line = line.rstrip() + f"  `⭐{st}`"
                changed += 1
        out.append(line)
    p.write_text("\n".join(out) + "\n")
    return changed

if __name__ == "__main__":
    for f in ["README.md", "README.zh-CN.md"]:
        fp = pathlib.Path.home() / "awesome-deepseek-harness" / f
        n = process(fp)
        print(f"{f}: badged {n} entries")
