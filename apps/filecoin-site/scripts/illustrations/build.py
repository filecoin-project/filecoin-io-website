#!/usr/bin/env python3
"""Turn the storage illustrations into animatable layers.

The sources in ./source are the Figma exports (720x560, text outlined) trimmed to their
foreground: the page wrapper, the canvas background and the dot field are dropped, because the
site draws the dot field as an SVG pattern (see StorageArt.tsx).

Each illustration is split into named parts (a card, a chip, a set of connector dots...). Every
part becomes its own small <svg>, positioned in percentages of the 720x560 stage, so the site can
animate parts with transform/opacity/clip-path on separate layers instead of repainting one big
SVG. Element geometry is copied as is, with coordinates rounded to 0.01px.

Usage: python3 scripts/illustrations/build.py
Writes src/app/_components/sections/home/storage-art/parts/*.tsx. Standard library only.
"""

from __future__ import annotations

import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).resolve().parent / "source"
OUT = ROOT / "src/app/_components/sections/home/storage-art/parts"
NS = "{http://www.w3.org/2000/svg}"
STAGE_W, STAGE_H = 720, 560

# Part maps. Parts are matched in order, first match wins: by element id, or by the centre of
# the element's bounding box falling inside a region (x0, y0, x1, y1), or with `contain` by the
# whole box lying inside it (for a mark centred on its card). `split` lists groups whose children
# are matched one by one (connector dots, timeline dots). Every element must match. `shift` moves
# the whole scene down that many stage units, to centre it on the 720x560 stage.
ARTS = {
    "data-storage": {
        "source": "01-data-storage.svg",
        "export": "DATA_STORAGE_PARTS",
        "split": ["Group_20"],
        "parts": [
            ("connectors-in", {"region": (140, 120, 580, 200)}),
            ("connectors-out", {"region": (140, 350, 580, 420)}),
            ("chip-datasets", {"region": (55, 80, 250, 128)}),
            ("chip-training", {"region": (262, 80, 458, 128)}),
            ("chip-video", {"region": (470, 80, 666, 128)}),
            ("core-logo", {"ids": ["filecoin-logo"]}),
            ("core", {"region": (275, 190, 445, 360)}),
            ("toggle-knob", {"ids": ["Vector_2678"]}),
            ("toggle-track", {"ids": ["Vector_2677"]}),
            ("card-retrieve", {"region": (85, 408, 348, 480)}),
            ("card-paid", {"region": (372, 408, 636, 480)}),
        ],
    },
    "backup-archives": {
        "source": "02-backup-archives.svg",
        "export": "BACKUP_ARCHIVES_PARTS",
        "split": ["Group_20", "proof-timeline"],
        "parts": [
            ("card-back", {"ids": ["Vector_2581"]}),
            ("card-middle", {"ids": ["Vector_2582"]}),
            ("today-halo", {"ids": ["Vector_2576"]}),
            ("today-core", {"ids": ["Vector_2577"]}),
            ("link-upper", {"region": (350, 290, 370, 326)}),
            ("link-lower", {"region": (350, 356, 370, 400)}),
            ("card-front", {"region": (176, 140, 544, 292)}),
            ("proof", {"region": (280, 324, 440, 360)}),
            ("timeline-past", {"region": (58, 410, 357, 422)}),
            ("timeline-future", {"region": (363, 410, 662, 422)}),
            ("label-start", {"region": (58, 434, 100, 452)}),
            ("label-today", {"region": (330, 434, 390, 452)}),
            ("label-end", {"region": (620, 434, 662, 452)}),
        ],
    },
    "agent-storage": {
        "source": "03-agent-storage.svg",
        "export": "AGENT_STORAGE_PARTS",
        "split": ["Group_20"],
        "parts": [
            ("links-in", {"region": (175, 195, 247, 365)}),
            ("links-out", {"region": (310, 270, 350, 290)}),
            ("chip-terminal", {"region": (45, 176, 180, 224)}),
            ("chip-editor", {"region": (45, 256, 180, 304)}),
            ("chip-browser", {"region": (45, 336, 180, 384)}),
            ("agent-mark", {"ids": ["agent-mark"]}),
            ("hub", {"region": (244, 244, 316, 316)}),
            ("log", {"ids": ["Vector_2568"], "region": (350, 126, 675, 181)}),
            ("row-1-dot", {"ids": ["Vector_2573"]}),
            ("row-1", {"region": (350, 181, 675, 229)}),
            ("row-2", {"region": (350, 229, 675, 277)}),
            ("row-3", {"region": (350, 277, 675, 325)}),
            ("row-4", {"region": (350, 325, 675, 373)}),
            ("row-5", {"region": (350, 373, 675, 425)}),
        ],
    },
    # The two below are trimmed from newer exports with trim.py, so their text is named by id.
    "enterprise-storage": {
        "source": "04-enterprise-storage.svg",
        "export": "ENTERPRISE_STORAGE_PARTS",
        "split": ["dots"],
        "parts": [
            ("links-in", {"region": (209, 175, 280, 385)}),
            ("link-out", {"region": (361, 270, 398, 290)}),
            ("tool-sdk", {"region": (35, 155, 215, 212)}),
            ("tool-cli", {"region": (35, 251, 215, 308)}),
            ("tool-app", {"region": (35, 347, 215, 404)}),
            ("hub-mark", {"region": (294, 254, 346, 306), "contain": True}),
            ("hub", {"region": (275, 235, 365, 325)}),
            ("caption", {"ids": ["t-encrypted-client-side"]}),
            ("toggle-knob", {"region": (644, 210, 664, 230), "contain": True}),
            ("toggle-track", {"region": (630, 208, 666, 232), "contain": True}),
            ("row-backup", {"region": (400, 252, 680, 286), "contain": True}),
            ("row-reports", {"region": (400, 286, 680, 322), "contain": True}),
            ("row-access", {"region": (400, 322, 680, 368), "contain": True}),
            ("bucket", {"region": (398, 186, 682, 372)}),
        ],
    },
    "ipfs": {
        "source": "05-ipfs-storage.svg",
        "export": "IPFS_PARTS",
        "split": ["dots"],
        "shift": 21,
        "parts": [
            ("links-in", {"region": (120, 137, 600, 198)}),
            ("link-down", {"region": (350, 328, 370, 378)}),
            ("chip-cid", {"region": (30, 60, 248, 140)}),
            ("chip-ipns", {"region": (250, 60, 472, 140)}),
            ("chip-gateway", {"region": (474, 60, 690, 140)}),
            ("hub-mark", {"region": (334, 214, 386, 266), "contain": True}),
            ("hub", {"region": (255, 195, 465, 335)}),
            ("proof-mark", {"region": (243, 390, 287, 434), "contain": True}),
            ("proof", {"region": (225, 376, 495, 450)}),
        ],
    },
}

JSX_ATTRS = {
    "fill-opacity": "fillOpacity",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "stroke-miterlimit": "strokeMiterlimit",
    "stroke-opacity": "strokeOpacity",
    "stroke-dasharray": "strokeDasharray",
}
NUMBER = re.compile(r"-?\d*\.\d+(?:e-?\d+)?|-?\d+(?:e-?\d+)?")


def round_numbers(value: str) -> str:
    def fmt(match: re.Match[str]) -> str:
        text = f"{float(match.group(0)):.2f}".rstrip("0").rstrip(".")
        return "0" if text in ("-0", "") else text

    return NUMBER.sub(fmt, value)


ARGS = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7, "Z": 0}


def path_bbox(d: str) -> tuple[float, float, float, float] | None:
    """Bounding box of a path's points, control points included (so never too small).

    Absolute and relative commands both work (the Figma exports are absolute; icon paths in the
    newer exports are relative). An arc counts its end point grown by its radii.
    """
    xs: list[float] = []
    ys: list[float] = []
    x = y = sx = sy = 0.0
    for cmd, args in re.findall(r"([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)", d):
        nums = [float(n) for n in NUMBER.findall(args)]
        op, rel = cmd.upper(), cmd.islower()
        if op == "Z":
            x, y = sx, sy
            continue
        step = ARGS[op]
        for i in range(0, len(nums) - step + 1, step):
            chunk = nums[i : i + step]
            if op == "H":
                x = chunk[0] + (x if rel else 0)
                points = [(x, y)]
            elif op == "V":
                y = chunk[0] + (y if rel else 0)
                points = [(x, y)]
            elif op == "A":
                rx, ry = abs(chunk[0]), abs(chunk[1])
                ex, ey = chunk[5] + (x if rel else 0), chunk[6] + (y if rel else 0)
                points = [(x - rx, y - ry), (x + rx, y + ry), (ex - rx, ey - ry), (ex + rx, ey + ry)]
                x, y = ex, ey
            else:
                points = [(chunk[j] + (x if rel else 0), chunk[j + 1] + (y if rel else 0)) for j in range(0, step, 2)]
                x, y = points[-1]
            for px, py in points:
                xs.append(px)
                ys.append(py)
            if op == "M" and i == 0:
                sx, sy = x, y
            if op == "M":
                op = "L"  # extra pairs after a move are lines
    return (min(xs), min(ys), max(xs), max(ys)) if xs and ys else None


def transform_matrix(value: str) -> tuple[float, float, float, float, float, float]:
    """The affine matrix (a, b, c, d, e, f) of an SVG transform list."""
    a, b, c, d, e, f = 1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    for name, args in re.findall(r"(\w+)\s*\(([^)]*)\)", value):
        n = [float(v) for v in NUMBER.findall(args)]
        if name == "translate":
            m = (1, 0, 0, 1, n[0], n[1] if len(n) > 1 else 0)
        elif name == "scale":
            m = (n[0], 0, 0, n[1] if len(n) > 1 else n[0], 0, 0)
        elif name == "rotate":
            t = math.radians(n[0])
            cos, sin = math.cos(t), math.sin(t)
            cx, cy = (n[1], n[2]) if len(n) == 3 else (0, 0)
            m = (cos, sin, -sin, cos, cx - cos * cx + sin * cy, cy - sin * cx - cos * cy)
        elif name == "matrix":
            m = tuple(n[:6])
        else:
            sys.exit(f"unsupported transform: {name}")
        a, b, c, d, e, f = (
            a * m[0] + c * m[1],
            b * m[0] + d * m[1],
            a * m[2] + c * m[3],
            b * m[2] + d * m[3],
            a * m[4] + c * m[5] + e,
            b * m[4] + d * m[5] + f,
        )
    return a, b, c, d, e, f


def bbox(el: ET.Element) -> tuple[float, float, float, float] | None:
    tag = el.tag.replace(NS, "")
    if tag == "path":
        box = path_bbox(el.get("d", ""))
    elif tag == "rect":
        x, y = float(el.get("x", 0)), float(el.get("y", 0))
        box = (x, y, x + float(el.get("width", 0)), y + float(el.get("height", 0)))
    elif tag == "circle":
        cx, cy, r = (float(el.get(k, 0)) for k in ("cx", "cy", "r"))
        box = (cx - r, cy - r, cx + r, cy + r)
    elif tag == "ellipse":
        cx, cy, rx, ry = (float(el.get(k, 0)) for k in ("cx", "cy", "rx", "ry"))
        box = (cx - rx, cy - ry, cx + rx, cy + ry)
    else:
        boxes = [b for b in (bbox(c) for c in el) if b]
        box = (
            (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))
            if boxes
            else None
        )
    if box and el.get("stroke") and el.get("stroke") != "none":
        half = float(el.get("stroke-width", 1)) / 2
        box = (box[0] - half, box[1] - half, box[2] + half, box[3] + half)
    if box and el.get("transform"):
        a, b, c, d, e, f = transform_matrix(el.get("transform", ""))
        corners = [(a * x + c * y + e, b * x + d * y + f) for x in (box[0], box[2]) for y in (box[1], box[3])]
        box = (min(p[0] for p in corners), min(p[1] for p in corners), max(p[0] for p in corners), max(p[1] for p in corners))
    return box


def to_jsx(el: ET.Element, indent: int) -> str:
    tag = el.tag.replace(NS, "")
    attrs = []
    for key, value in el.attrib.items():
        if key == "id":
            continue
        name = JSX_ATTRS.get(key, key)
        attrs.append(f'{name}="{round_numbers(value) if key not in ("fill", "stroke", "transform") else value}"')
    pad = " " * indent
    open_tag = f"<{tag}{' ' if attrs else ''}{' '.join(attrs)}"
    children = list(el)
    if not children:
        return f"{pad}{open_tag} />"
    inner = "\n".join(to_jsx(c, indent + 2) for c in children)
    return f"{pad}{open_tag}>\n{inner}\n{pad}</{tag}>"


def build(key: str, spec: dict) -> str:
    root = ET.parse(SOURCE / spec["source"]).getroot()
    elements: list[ET.Element] = []
    for child in root:
        if child.get("id") in spec["split"]:
            elements += list(child)
        else:
            elements.append(child)

    assigned: dict[str, list[tuple[int, ET.Element]]] = {name: [] for name, _ in spec["parts"]}
    for index, el in enumerate(elements):
        box = bbox(el)
        cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
        for name, rule in spec["parts"]:
            if el.get("id") in rule.get("ids", ()):
                break
            region = rule.get("region")
            if region and rule.get("contain"):
                if region[0] <= box[0] and box[2] <= region[2] and region[1] <= box[1] and box[3] <= region[3]:
                    break
            elif region and region[0] <= cx <= region[2] and region[1] <= cy <= region[3]:
                break
        else:
            sys.exit(f"{key}: element {el.get('id')} at ({cx:.0f}, {cy:.0f}) matches no part")
        assigned[name].append((index, el))

    empty = [name for name, items in assigned.items() if not items]
    if empty:
        sys.exit(f"{key}: parts with no elements: {', '.join(empty)}")

    # Paint order follows the source: a part sits where its first element sat.
    order = sorted(assigned, key=lambda name: assigned[name][0][0])
    dy = spec.get("shift", 0)
    blocks = []
    for name in order:
        boxes = [bbox(el) for _, el in assigned[name]]
        x0 = max(0.0, min(b[0] for b in boxes) - 1)
        y0 = max(0.0, min(b[1] for b in boxes) - 1 + dy)
        x1 = min(STAGE_W, max(b[2] for b in boxes) + 1)
        y1 = min(STAGE_H, max(b[3] for b in boxes) + 1 + dy)
        box = [round(v * 2) / 2 for v in (x0, y0, x1 - x0, y1 - y0)]
        if dy:
            inner = "\n".join(to_jsx(el, 10) for _, el in assigned[name])
            body = f'        <g transform="translate(0 {dy:g})">\n{inner}\n        </g>'
        else:
            body = "\n".join(to_jsx(el, 8) for _, el in assigned[name])
        blocks.append(
            f'  {{\n    name: "{name}",\n    box: [{", ".join(f"{v:g}" for v in box)}],\n'
            f"    body: (\n      <>\n{body}\n      </>\n    ),\n  }},"
        )

    return (
        f"// Generated by scripts/illustrations/build.py from scripts/illustrations/source/{spec['source']}.\n"
        "// Do not edit by hand: change the source or the part map in build.py and run it again.\n"
        'import type { ArtPart } from "../types";\n\n'
        f"export const {spec['export']}: ArtPart[] = [\n" + "\n".join(blocks) + "\n];\n"
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for key, spec in ARTS.items():
        code = build(key, spec)
        (OUT / f"{key}.tsx").write_text(code)
        print(f"{key}: {code.count('name: ')} parts, {len(code) // 1024} KB")


if __name__ == "__main__":
    main()
