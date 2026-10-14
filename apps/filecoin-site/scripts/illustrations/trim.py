#!/usr/bin/env python3
"""Trim a raw illustration export into a source for build.py.

The newer exports (04-enterprise-storage, 05-ipfs-storage) come with what the site draws itself
or does not need: a content-credentials <metadata> block, the #141414 background, the dot field,
and a soft drop shadow (#111 at 4-5%, which does not show on the dark stage). This drops those and
keeps the foreground as is, with two changes so build.py can map it into parts:

- Each outlined text path's <title> becomes its id ("t-" + the title, slugged), so the part map
  can name text by what it says.
- Each connector group (<g fill=...> of small dots) gets an id ("dots", "dots-2", ...) and hands
  its fill down to every dot, so build.py can split it dot by dot.

Usage: python3 scripts/illustrations/trim.py RAW.svg scripts/illustrations/source/NN-name.svg
Standard library only.
"""

from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

SVG = "http://www.w3.org/2000/svg"
NS = f"{{{SVG}}}"
INHERITED = ("fill", "fill-opacity")


def slug(text: str) -> str:
    return "t-" + (re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "text")


def trim(raw: Path, out: Path) -> None:
    ET.register_namespace("", SVG)
    root = ET.parse(raw).getroot()
    for key in list(root.attrib):
        if key not in ("width", "height", "viewBox", "fill"):
            del root.attrib[key]

    for child in list(root):
        tag = child.tag.replace(NS, "")
        if tag in ("metadata", "defs") or child.get("id") in ("background", "dot-field"):
            root.remove(child)

    used: set[str] = set()
    dot_groups = 0
    for el in root.iter():
        el.attrib.pop("filter", None)
        title = el.find(f"{NS}title")
        if title is not None:
            name = base = slug(title.text or "")
            n = 2
            while name in used:
                name, n = f"{base}-{n}", n + 1
            used.add(name)
            el.set("id", name)
            el.remove(title)

    for child in root:
        if child.tag == f"{NS}g" and child.get("fill") and not child.get("transform"):
            kids = list(child)
            if kids and all(k.tag in (f"{NS}rect", f"{NS}path", f"{NS}circle") for k in kids):
                dot_groups += 1
                child.set("id", "dots" if dot_groups == 1 else f"dots-{dot_groups}")
                for key in INHERITED:
                    value = child.attrib.pop(key, None)
                    if value is not None:
                        for kid in kids:
                            kid.attrib.setdefault(key, value)

    ET.indent(root, space="  ")
    out.write_text(ET.tostring(root, encoding="unicode") + "\n")
    print(f"{out.name}: {sum(1 for _ in root.iter()) - 1} elements, {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    trim(Path(sys.argv[1]), Path(sys.argv[2]))
