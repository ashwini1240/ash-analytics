// Shared design tokens used by both the CSS layer and the Three.js scene,
// so the immersive and 2D experiences stay visually in sync.
//
// "Blueprint" direction: a bright architect's-paper world. Data is drawn
// like ink on drafting paper — thin ink linework, a drafting-slate for
// structure, and a single redline reserved for the one thing that matters
// at each station.
export const theme = {
  // Paper grounds
  bg: '#e7eae8', // cool architect's paper (canvas background)
  bgDeep: '#dfe6e6', // used where a slightly deeper paper is needed
  haze: '#dbe4e6', // cool blue-grey the distance fades into (fog target)
  sheet: '#f4f6f4', // a clean drawing sheet (panels / plates)

  // Ink + structure
  ink: '#191b1e', // primary linework / text
  inkSoft: '#3a4144', // secondary ink
  line: '#ccd3cd', // faint grid cell lines
  lineBright: '#a7b8c1', // stronger grid section lines (slate-tinted)
  text: '#191b1e',
  textMuted: '#5e6560',
  textDim: '#8a918b',

  // Accents: drafting slate for structure, redline reserved for emphasis.
  slate: '#46607a',
  slateSoft: '#8ea0b2',
  redline: '#d8402e',
  redlineSoft: '#e79a90',
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
