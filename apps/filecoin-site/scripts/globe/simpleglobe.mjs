// Simple globe of Filecoin storage provider locations.
// Vector land on an orthographic globe, one small "mini server" icon per location.
//
//   npm i d3-geo   then   node simpleglobe.mjs [--theme dark] [--bg "#141414"] [--lat 48] [--lon 140] [--out globe.svg] [--size 780] [--x 0.66]
//
// Data: filecoin-sp-cities.json (ProbeLab, geolocated storage providers).
// Land: Natural Earth 1:110m land (public domain).
import fs from "fs";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i > 0 ? process.argv[i + 1] : d;
};
const W = 1600, H = 1000;
const LAT = +arg("lat", 48), LON = +arg("lon", 140);
const SIZE = +arg("size", 780), CX = W * +arg("x", 0.66), CY = H * +arg("y", 0.52);
const OUT = arg("out", process.argv.includes("dark") ? "filecoin-globe-simple-dark.svg" : "filecoin-globe-simple.svg");
const ICON = +arg("icon", 1); // icon scale

const THEME = arg("theme", "light");
const C = THEME === "dark" ? {
  // inverted for a #141414 page: land sits lighter than ocean, minis turn aluminium
  bg: arg("bg", "#141414"),
  ocean: "#1F1F1F", land: "#2E2E2E", landStroke: "#3F3F3F",
  grid: "#242424", rim: "#3A3A3A",
  top: "#D6D6D3", edge: "#7A7A77", front: "#9C9C99", hi: ".55", led: "#34C759",
  shadeLo: ".0", shadeMid: ".12", shadeHi: ".3", shadeTint: "#000", floor: ".35", iconShadow: ".45", drop: ".6",
} : {
  bg: arg("bg", "#FFFFFF"),
  ocean: "#E7E7E4", land: "#FFFFFF", landStroke: "#C9C9C6",
  grid: "#E2E2DF", rim: "#BDBDB9",
  top: "#3C3C3C", edge: "#161616", front: "#161616", hi: ".12", led: "#34C759",
  shadeLo: "0", shadeMid: ".03", shadeHi: ".12", shadeTint: "#000", floor: ".06", iconShadow: ".14", drop: ".25",
};

const land = JSON.parse(fs.readFileSync(arg("land", "ne_110m_land.geojson"), "utf8"));
const cities = JSON.parse(fs.readFileSync(arg("data", "filecoin-sp-cities.json"), "utf8"));

const proj = geoOrthographic().scale(SIZE / 2).translate([CX, CY]).rotate([-LON, -LAT]).clipAngle(90).precision(0.3);
const path = geoPath(proj);
const r1 = (s) => s.replace(/(\d+\.\d)\d+/g, "$1"); // trim coordinates to 0.1px

// visible locations, merged when icons would sit on top of each other
const center = [LON, LAT];
const pts = cities
  .filter((c) => geoDistance([c.lon, c.lat], center) < Math.PI / 2 - 0.004)
  .map((c) => ({ ...c, xy: proj([c.lon, c.lat]) }))
  .sort((a, b) => b.providers - a.providers);
const MERGE = 9 * ICON;
const spots = [];
for (const p of pts) {
  const s = spots.find((s) => Math.hypot(s.xy[0] - p.xy[0], s.xy[1] - p.xy[1]) < MERGE);
  if (s) { s.cities.push(p.city); s.providers += p.providers; }
  else spots.push({ xy: p.xy, cities: [p.city], providers: p.providers });
}
spots.sort((a, b) => a.xy[1] - b.xy[1]); // back to front
const hidden = cities.filter((c) => geoDistance([c.lon, c.lat], center) >= Math.PI / 2 - 0.004).map((c) => c.city);

// mini server icon, 24 x 14 units, anchored at its base centre
const icon = `<symbol id="mini" viewBox="-13 -14 26 18" overflow="visible">
<ellipse cx="0" cy="1.6" rx="12.5" ry="2.4" fill="#000" opacity="${C.iconShadow}"/>
<rect x="-11" y="-6" width="22" height="7" rx="3" fill="${C.front}" stroke="${C.edge}" stroke-width=".7"/>
<rect x="-11" y="-13" width="22" height="11" rx="3.4" fill="${C.top}" stroke="${C.edge}" stroke-width=".7"/>
<rect x="-9.6" y="-11.8" width="19.2" height="2.2" rx="1.1" fill="#fff" opacity="${C.hi}"/>
<circle cx="7.6" cy="-0.6" r="1.05" fill="${C.led}"/>
</symbol>`;

const sphere = r1(path({ type: "Sphere" }));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
<!-- Filecoin storage providers: ${pts.length} of ${cities.length} cities visible in this view (${spots.length} icons). Source: ProbeLab. Land: Natural Earth. -->
<defs>
<radialGradient id="shade" cx="38%" cy="32%" r="75%">
<stop offset="0" stop-color="${C.shadeTint}" stop-opacity="${C.shadeLo}"/>
<stop offset=".75" stop-color="${C.shadeTint}" stop-opacity="${C.shadeMid}"/>
<stop offset="1" stop-color="${C.shadeTint}" stop-opacity="${C.shadeHi}"/>
</radialGradient>
<filter id="lift" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation=".8" flood-opacity="${C.drop}"/></filter>
${icon}
</defs>
<rect width="100%" height="100%" fill="${C.bg}"/>
<ellipse cx="${CX}" cy="${CY + SIZE * 0.53}" rx="${SIZE * 0.36}" ry="${SIZE * 0.035}" fill="#000" opacity="${C.floor}"/>
<path d="${sphere}" fill="${C.ocean}"/>
<path d="${r1(path(geoGraticule10()))}" fill="none" stroke="${C.grid}" stroke-width=".8"/>
<path d="${r1(path(land))}" fill="${C.land}" stroke="${C.landStroke}" stroke-width=".9" stroke-linejoin="round"/>
<path d="${sphere}" fill="url(#shade)"/>
<path d="${sphere}" fill="none" stroke="${C.rim}" stroke-width="1.2"/>
<g filter="url(#lift)">
${spots.map((s) => `<use href="#mini" x="${(s.xy[0] - 13 * ICON).toFixed(1)}" y="${(s.xy[1] - 14 * ICON).toFixed(1)}" width="${26 * ICON}" height="${18 * ICON}"><title>${s.cities.join(", ")}: ${s.providers} provider${s.providers > 1 ? "s" : ""}</title></use>`).join("\n")}
</g>
</svg>`;
fs.writeFileSync(OUT, svg);
console.log(`wrote ${OUT}: ${pts.length}/${cities.length} cities visible, ${spots.length} icons, ${(svg.length / 1024).toFixed(0)} KB; hidden: ${hidden.join(", ") || "none"}`);
