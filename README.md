# Ashwini Kumar Singh — Portfolio

An immersive, data-themed portfolio for a pharma commercial-analytics
professional. Built on Vite + React + Three.js.

## Two experiences, one dataset

- **Immersive (3D):** a scroll-driven flight through a dark "data
  observatory" — forecast surface, floating outcome metrics, a 3D territory
  heat-field, and project nodes you can open. Built with
  `@react-three/fiber` + `@react-three/drei`.
- **Reader (2D):** a clean, fast, fully accessible layout with identical
  content. Served automatically on mobile, weak GPUs, when WebGL is
  unavailable, or when a visitor prefers reduced motion. Either view is one
  click away via the header toggle.

Both are driven by the same data files, so there is no duplicated content.

## Add a project (the common edit)

Append one object to the `projects` array in
[`src/data/projects.js`](src/data/projects.js). It automatically becomes a
node in the 3D scene, a card in the 2D grid, and a detail page at
`/projects/<slug>`. The field reference is documented at the top of that file.

## Edit your details

- Identity, résumé link and social links: [`src/data/profile.js`](src/data/profile.js)
  - ⚠️ Replace the two `REPLACE_ME` placeholders with your real **LinkedIn**
    and **GitHub** URLs.
- Headline metrics: `src/data/metrics.js`
- Experience & education: `src/data/experience.js`
- Skills: `src/data/skills.js`
- Colors / station layout: `src/theme.js`

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint
```

## Deploy

Configured for SPA hosting on **Netlify** (`public/_redirects`) or **Vercel**
(`vercel.json`) — deep links like `/projects/oncocast` resolve correctly.
Build command `npm run build`, publish directory `dist`.

## Project structure

```
src/
  data/        content — the single source of truth (edit these)
  hooks/       useRenderMode — 3D vs 2D capability detection + toggle
  components/  TopBar, ProjectOverlay, icons
  fallback/    the accessible 2D experience
  immersive/   the Three.js scene (one file per station) + camera rig
  theme.js     shared design tokens (CSS ↔ 3D)
```
