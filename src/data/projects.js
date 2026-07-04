// ─────────────────────────────────────────────────────────────────────
// PROJECTS — the one file to edit when you ship new work.
//
// Adding a project = append one object to the `projects` array below.
// It automatically appears as a node in the 3D scene, a card in the 2D
// grid, and a detail overlay at /projects/<slug>. No component edits.
//
// Field reference:
//   slug      string   URL-safe id, unique. Powers /projects/<slug>.
//   title     string   Project name.
//   tagline   string   One line shown under the title.
//   summary   string   1–3 sentence overview (grid + detail header).
//   year      string   Display year/period.
//   status    string   e.g. 'Live', 'In progress', 'Prototype'.
//   domain    string   Short category, e.g. 'Revenue forecasting'.
//   accent    'slate' | 'redline'   Node/detail highlight color.
//   methods   string[] Techniques/algorithms (chips).
//   stack     string[] Tools/languages (chips).
//   metrics   [{ value, label }]   Optional headline outcomes.
//   highlights string[]            Optional bullet points on the detail page.
//   links     [{ label, href }]    Optional repo/demo/write-up links.
// ─────────────────────────────────────────────────────────────────────
export const projects = [
  {
    slug: 'oncocast',
    title: 'OncoCast',
    tagline: 'Pharma revenue forecasting dashboard',
    summary:
      'A forecasting workbench that projects pharmaceutical product revenue and compares classical time-series methods side by side, so the model choice is a decision rather than a default.',
    year: '2024',
    status: 'Live',
    domain: 'Revenue forecasting',
    accent: 'slate',
    methods: ['Moving Average', 'Exponential Smoothing', 'Linear Regression'],
    stack: ['Python', 'pandas', 'Forecasting'],
    metrics: [
      { value: '3', label: 'forecast methods compared' },
      { value: '1', label: 'unified dashboard view' },
    ],
    highlights: [
      'Benchmarks Moving Average, Exponential Smoothing and Linear Regression on the same series for transparent comparison.',
      'Surfaces projected revenue alongside historicals so trend and seasonality are read at a glance.',
    ],
    // Add repo / live-demo links here when ready:
    links: [],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)
