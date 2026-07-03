// Shared design tokens used by both the CSS layer and the Three.js scene,
// so the immersive and 2D experiences stay visually in sync.
export const theme = {
  // Dark "data observatory" palette
  bg: '#060a14',
  bgDeep: '#04060d',
  panel: '#0d1424',
  line: '#12233a', // dim structural lines / grid
  lineBright: '#1d3a57',
  text: '#e7eef7',
  textMuted: '#8a99ad',
  // Restrained two-accent system: cyan is the primary "signal",
  // amber marks emphasis / results.
  cyan: '#39e0d4',
  cyanDim: '#1c7d78',
  amber: '#f5b13d',
  amberDim: '#9a6f22',
}

// Station layout along -Z. The camera flies forward ("into the data")
// as the visitor scrolls. Keeping these in one place makes the guided
// path easy to reason about and reorder.
export const stationZ = {
  hero: 0,
  forecast: -22,
  metrics: -44,
  territory: -64,
  projects: -86,
  contact: -106,
}
