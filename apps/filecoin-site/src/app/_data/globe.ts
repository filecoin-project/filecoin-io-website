// Storage provider locations on the homepage globe, as [longitude, latitude].
//
// Recovered from the Figma globe (node 393:2312): it was drawn by scripts/globe/simpleglobe.mjs
// with its defaults (orthographic, 780px, centred on 140°E 48°N), so inverting that projection
// at each icon's anchor gives the location back exactly. Each point is one icon, so cities that
// sat on top of each other are already merged, and only the half of the world visible in that
// view is covered.
//
// To show every provider, export filecoin-sp-cities.json (ProbeLab) into this shape, or extend
// GlobeMarker with city names and counts for tooltips.
export type GlobeMarker = [lon: number, lat: number]

export const PROVIDER_LOCATIONS: GlobeMarker[] = [
  [-73.566, 45.514],
  [-74.172, 40.889],
  [-77.503, 39.084],
  [-0.129, 51.511],
  [2.324, 48.821],
  [-82.968, 39.909],
  [8.706, 50.14],
  [-86.146, 39.79],
  [10.763, 59.92],
  [12.659, 50.53],
  [12.5, 41.898],
  [19.933, 50.056],
  [24.918, 60.171],
  [24.699, 48.918],
  [-96.791, 32.761],
  [-112.064, 43.51],
  [-122.759, 53.91],
  [-119.708, 45.846],
  [-123.096, 49.275],
  [-118.241, 34.064],
  [-122.155, 37.454],
  [76.757, 55.689],
  [87.602, 43.803],
  [125.328, 43.881],
  [111.644, 40.809],
  [101.765, 36.629],
  [116.394, 39.907],
  [108.923, 34.252],
  [113.653, 34.758],
  [126.969, 37.568],
  [120.374, 36.056],
  [104.063, 30.657],
  [138.186, 36.655],
  [106.548, 29.56],
  [129.033, 35.105],
  [139.693, 35.697],
  [118.784, 32.069],
  [121.451, 31.222],
  [120.16, 30.287],
  [112.969, 28.201],
  [105.84, 21.03],
  [113.258, 23.115],
  [118.082, 24.475],
  [121.572, 25.035],
  [100.494, 13.84],
  [106.629, 10.83],
  [120.98, 14.596],
  [103.851, 1.289],
  [106.852, -6.218],
  [151.202, -33.874],
  [144.972, -37.817],
]
