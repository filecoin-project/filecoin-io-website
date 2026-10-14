#!/usr/bin/env python3
"""
Builds the product pages' card illustrations (On Demand Storage, Agents, IPFS Pinning, Archival
Storage).

Reads the Figma SVG exports in scripts/illustrations/source/cards/ and writes one React component
per card to src/app/_components/sections/product/card-art/. Each card's top-level layers are
grouped into named parts (see CARDS below) so they can animate on their own: `enter` is the
entrance (keyframes in globals.css, under `.ia`), `delay` is in ms, `draw` strokes the part's
lines in, and `flow` adds a travelling highlight along them.

    python3 scripts/illustrations/build_cards.py
"""
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "scripts/illustrations/source/cards"
OUT = ROOT / "src/app/_components/sections/product/card-art"
NS = "{http://www.w3.org/2000/svg}"

# name, layer indexes (top-level children of the card group), entrance, delay, extras
CARDS = {
    "addressed-by-content": {
        "component": "AddressedByContentArt",
        "parts": [
            ("link", [0], "fade", 300, {"draw": True, "flow": 1000}),
            ("tile", [1, 2], "scale", 0, {}),
            ("icon", [3], "scale", 120, {}),
            ("pill", [4, 5, 6, 7], "rise", 450, {}),
        ],
    },
    "replicated-across-providers": {
        "component": "ReplicatedAcrossProvidersArt",
        "parts": [
            ("branches", [0], "fade", 300, {"draw": True, "flow": 1100}),
            ("branch-off", [1], "fade", 420, {}),
            ("tile", [2, 3], "scale", 0, {}),
            ("icon", [4], "scale", 120, {}),
            ("server-1", [5, 6, 7], "rise", 500, {}),
            ("server-2", [8, 9, 10], "rise", 580, {}),
            ("server-3", [11], "fade", 700, {"loop": "fade-out"}),
            ("dot-1", [12], "scale", 760, {"loop": "pulse"}),
            ("dot-2", [13], "scale", 830, {"loop": "pulse"}),
            ("dot-3", [14], "fade", 900, {}),
        ],
    },
    "intact-by-design": {
        "component": "IntactByDesignArt",
        "parts": [
            ("bracket", [0], "fade", 350, {"draw": True}),
            ("dash", [1], "fade", 950, {}),
            ("row-stored", [2, 3, 4, 5], "left", 0, {}),
            ("row-retrieved", [6, 7, 8, 9], "left", 100, {}),
            ("row-changed", [10], "fade", 800, {}),
            ("check", [11, 12, 13], "scale", 550, {}),
            ("cross", [14], "scale", 1050, {}),
        ],
    },
    # Agents page. A chat: the request, the agent's reply with the published link, then who can see it.
    "publish-artifacts": {
        "component": "PublishArtifactsArt",
        "parts": [
            ("prompt", [0, 1], "rise", 0, {}),
            ("avatar", [2, 3], "scale", 320, {}),
            ("avatar-mark", [13], "scale", 400, {"loop": "twinkle"}),
            ("reply", [4, 5], "rise", 440, {}),
            ("link", [6, 7, 8, 9, 10], "rise", 600, {}),
            ("note", [11, 12], "fade", 820, {}),
        ],
    },
    # Agent A hands a session to agent B along the connector. (The source has agent B's inner tile
    # added back by hand: the Figma export dropped it, though the frame shows it.)
    "share-sessions": {
        "component": "ShareSessionsArt",
        "parts": [
            ("link", [0], "fade", 320, {"draw": True, "flow": 1200}),
            ("agent-a", [1, 2, 5, 7], "scale", 0, {}),
            ("agent-a-mark", [14], "scale", 100, {"loop": "twinkle"}),
            ("agent-b", [3, 4, 8], "scale", 160, {}),
            ("agent-b-mark", [6], "scale", 260, {"loop": "twinkle"}),
            ("session", [9, 10, 11, 12], "rise", 560, {}),
            ("meta", [13], "fade", 760, {}),
        ],
    },
    # IPFS Pinning page. A terminal: the command types itself out, then the result and the CID.
    "pin-from-your-terminal": {
        "component": "PinFromYourTerminalArt",
        "parts": [
            ("window", [0, 1, 2, 3, 4, 5, 6], "rise", 0, {}),
            ("prompt-sign", [7], "fade", 260, {}),
            ("command", [8], "type", 320, {}),
            ("output", [9], "fade", 1050, {}),
            ("pinned", [10, 11], "left", 1200, {}),
            ("cid", [12, 13, 14, 15, 16], "rise", 1380, {}),
        ],
    },
    # Pins move from the current service to Filecoin, row by row, keeping their CIDs.
    "pin-migrate-from-another-service": {
        "component": "PinMigrateFromAnotherServiceArt",
        "parts": [
            ("link", [0, 1], "fade", 300, {}),
            ("source", [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "rise", 0, {}),
            ("target", [13, 14, 15, 16, 17], "rise", 160, {}),
            ("row-1", [18, 19, 20], "left", 620, {}),
            ("row-2", [21, 22, 23], "left", 760, {}),
            ("row-3", [24, 25, 26], "left", 900, {}),
            ("arrow", [27], "scale", 380, {}),
            ("arrow-glyph", [28], "scale", 440, {"loop": "nudge"}),
            ("caption", [29], "fade", 1100, {}),
        ],
    },
    # Ask an agent to pin: it runs the Filecoin skill's command and replies with the CID. (The
    # agent's sparkle is added back to the source by hand: Figma keeps it outside the export.)
    "pin-with-your-agents": {
        "component": "PinWithYourAgentsArt",
        "parts": [
            ("prompt", [0, 1], "rise", 0, {}),
            ("avatar", [2, 3], "scale", 320, {}),
            ("avatar-mark", [4], "scale", 400, {"loop": "twinkle"}),
            ("reply", [5, 6, 7, 8], "rise", 440, {}),
            ("command-row", [9, 10], "fade", 640, {}),
            ("command", [11], "type", 700, {}),
            ("command-check", [12], "scale", 1300, {}),
            ("answer", [13], "fade", 1400, {}),
            ("cid", [14, 15, 16, 17, 18], "rise", 1500, {}),
        ],
    },
    # Archival Storage page. Backups drop onto the pile one after another; the newest is stamped
    # "Archived".
    "backups-and-records": {
        "component": "BackupsAndRecordsArt",
        "parts": [
            ("back", [0, 1, 2, 3], "drop", 0, {}),
            ("middle", [4, 5, 6, 7], "drop", 150, {}),
            ("front", [8, 9, 11, 12], "drop", 300, {}),
            ("front-icon", [10], "scale", 520, {}),
            ("badge", [13, 14, 15], "stamp", 900, {}),
        ],
    },
    # A footage library fills in clip by clip; the first clip's play button keeps breathing.
    "media-archives": {
        "component": "MediaArchivesArt",
        "parts": [
            ("window", [0, 1, 2, 3, 4, 5], "rise", 0, {}),
            ("clip-1", [6, 9, 10], "scale", 280, {}),
            ("play", [7, 8], "scale", 420, {"loop": "breathe"}),
            ("clip-2", [11, 12, 13, 14], "scale", 360, {}),
            ("clip-3", [15, 16, 17, 18], "scale", 440, {}),
            ("clip-4", [19, 20, 21, 22], "scale", 520, {}),
            ("clip-5", [23, 24, 25, 26], "scale", 600, {}),
            ("clip-6", [27, 28, 29, 30], "scale", 680, {}),
            ("footer", [31, 32], "fade", 800, {}),
        ],
    },
    # A training run's loss curve draws in, checkpoints land along it, and the latest one is
    # labelled.
    "datasets-and-models": {
        "component": "DatasetsAndModelsArt",
        "parts": [
            ("window", [0, 1, 2, 3, 4, 5], "rise", 0, {}),
            ("grid", [6, 7, 8, 9], "fade", 250, {}),
            ("curve", [10], "fade", 350, {"draw": True}),
            ("guide", [11], "fade", 1150, {}),
            ("point-1", [12], "scale", 550, {}),
            ("point-2", [13], "scale", 700, {}),
            ("point-3", [14], "scale", 850, {}),
            ("halo", [15], "scale", 1000, {"loop": "pulse"}),
            ("latest", [16], "scale", 1000, {}),
            ("tooltip", [17, 18], "rise", 1200, {}),
            ("footer", [19, 20], "fade", 500, {}),
        ],
    },
    # A timeline of what the agent did, newest first, sealed with a tamper-evident badge.
    "keep-a-record": {
        "component": "KeepARecordArt",
        "parts": [
            ("line", [0], "fade", 150, {"draw": True}),
            ("line-tail", [1], "fade", 900, {}),
            ("halo", [2], "scale", 300, {"loop": "pulse"}),
            ("dot-1", [3], "scale", 300, {}),
            ("dot-2", [4], "scale", 440, {}),
            ("dot-3", [5], "scale", 580, {}),
            ("dot-4", [6], "scale", 720, {}),
            ("entry-1", [7, 8, 9, 10], "left", 300, {}),
            ("entry-2", [11], "left", 440, {}),
            ("entry-3", [12], "left", 580, {}),
            ("entry-4", [13], "left", 720, {}),
            ("badge", [14, 15, 16], "rise", 950, {}),
        ],
    },
}

ATTRS = {
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "stroke-opacity": "strokeOpacity",
    "stroke-dasharray": "strokeDasharray",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "fill-opacity": "fillOpacity",
}


def attrs(el, extra=""):
    out = []
    for key, value in el.attrib.items():
        if key == "id":
            continue
        out.append(f'{ATTRS.get(key, key)}="{value}"')
    return (" " + " ".join(out) if out else "") + extra


def jsx(el, indent, draw=False):
    tag = el.tag.replace(NS, "")
    pad = "  " * indent
    if tag == "g":
        inner = "\n".join(jsx(child, indent + 1, draw) for child in el)
        return f"{pad}<g{attrs(el)}>\n{inner}\n{pad}</g>"
    # Connector strokes get a normalised length so CSS can draw them in.
    extra = ' pathLength={1} className="ia-draw"' if draw and el.get("stroke") and not el.get("stroke-dasharray") else ""
    return f"{pad}<{tag}{attrs(el, extra)} />"


def flow_copy(el, indent):
    """The same strokes at full strength, shown only as a short travelling dash."""
    pad = "  " * indent
    paths = [p for p in el.iter(f"{NS}path") if p.get("stroke")]
    lines = []
    for p in paths:
        keep = {k: v for k, v in p.attrib.items() if k in ("d", "stroke", "stroke-width", "stroke-linecap")}
        a = " ".join(f'{ATTRS.get(k, k)}="{v}"' for k, v in keep.items())
        lines.append(f'{pad}<path {a} pathLength={{1}} className="ia-flow" />')
    return "\n".join(lines)


def build(name, config):
    tree = ET.parse(SOURCE / f"{name}.svg")
    svg = tree.getroot()
    card = next(iter(svg))  # the one group Figma wraps the card in
    layers = list(card)
    used = sorted(i for part in config["parts"] for i in part[1])
    if used != list(range(len(layers))):
        raise SystemExit(f"{name}: parts must use each of the {len(layers)} layers exactly once, got {used}")
    body = []
    for part, indexes, enter, delay, extra in config["parts"]:
        loop = f' data-loop="{extra["loop"]}"' if "loop" in extra else ""
        children = "\n".join(jsx(layers[i], 4, extra.get("draw", False)) for i in indexes)
        body.append(
            f'      <g data-part="{part}" data-enter="{enter}"{loop} style={{{{ "--d": "{delay}ms" }} as CSSProperties}}>\n'
            f"{children}\n      </g>"
        )
        if "flow" in extra:
            flows = "\n".join(flow_copy(layers[i], 4) for i in indexes)
            body.append(
                f'      <g data-part="{part}-flow" aria-hidden="true" style={{{{ "--d": "{extra["flow"]}ms" }} as CSSProperties}}>\n'
                f"{flows}\n      </g>"
            )
    width, height = svg.get("width"), svg.get("height")
    source = f"""// Generated by scripts/illustrations/build_cards.py from scripts/illustrations/source/cards/{name}.svg.
// Edit the part map in that script, not this file.
import type {{ CSSProperties }} from "react";

export default function {config["component"]}({{ className }}: {{ className?: string }}) {{
  return (
    <svg
      className={{className}}
      width="{width}"
      height="{height}"
      viewBox="{svg.get("viewBox")}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
{chr(10).join(body)}
    </svg>
  );
}}
"""
    (OUT / f"{config['component']}.tsx").write_text(source)
    print(f"{config['component']}.tsx: {len(config['parts'])} parts")


def write_index():
    """A registry so pages can name an illustration in their data (`art: "share-sessions"`)."""
    imports = "\n".join(f'import {c["component"]} from "./{c["component"]}";' for c in CARDS.values())
    entries = "\n".join(f'  "{name}": {c["component"]},' for name, c in CARDS.items())
    (OUT / "index.ts").write_text(
        f"""// Generated by scripts/illustrations/build_cards.py.
{imports}

export const CARD_ART = {{
{entries}
}} as const;

export type CardArtName = keyof typeof CARD_ART;
"""
    )


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, config in CARDS.items():
        build(name, config)
    write_index()
