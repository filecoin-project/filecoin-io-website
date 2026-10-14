#!/usr/bin/env python3
"""Write the globe's land outlines for the site.

Reads Natural Earth 1:110m land (public domain, scripts/globe/ne_110m_land.geojson) and writes
public/assets/data/land-110m.json: one GeoJSON GeometryCollection, properties dropped, coordinates
rounded to 0.01 degrees (about 1 km, well under a pixel on the homepage globe). Ring order is
kept as is, since d3-geo reads it to tell land from sea.

Usage: python3 scripts/globe/build-land.py
"""

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parents[1] / "public/assets/data/land-110m.json"


def round_coords(value):
    if isinstance(value[0], (int, float)):
        return [round(value[0], 2), round(value[1], 2)]
    return [round_coords(v) for v in value]


def main() -> None:
    land = json.loads((HERE / "ne_110m_land.geojson").read_text())
    geometries = [
        {"type": f["geometry"]["type"], "coordinates": round_coords(f["geometry"]["coordinates"])}
        for f in land["features"]
    ]
    data = json.dumps({"type": "GeometryCollection", "geometries": geometries}, separators=(",", ":"))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(data)
    print(f"{OUT.relative_to(HERE.parents[1])}: {len(geometries)} geometries, {len(data) // 1024} KB")


if __name__ == "__main__":
    main()
