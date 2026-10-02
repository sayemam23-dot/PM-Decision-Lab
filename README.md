# PM Decision Lab

An interactive project management simulation. Play the Project Manager, make decisions on a fictional software project, and see how every choice trades off schedule, budget, scope, quality, morale, stakeholder satisfaction and risk. Frontend only; no backend, database or accounts.

> Educational simulation, not a professional project-management assessment.

<p align="center">
  <a href="https://pmdecisionsimulator.netlify.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Project-blue?style=for-the-badge" alt="Live Demo">
  </a>
</p>

## Features
- Interactive PM simulation with 4 fictional projects and 12 scenarios
- Dynamic project metrics with animated changes
- Decision consequences with a short explanation after every choice
- Learning Mode that explains the PM concept behind each scenario
- Analytics: project health over time, biggest positive/negative impact, most affected metric
- Decision history timeline and a concepts summary
- LocalStorage persistence (active run, preferences, completed runs), safe against corrupted data
- Responsive, keyboard accessible, respects `prefers-reduced-motion`

## Tech Stack
React 18, Vite 5, plain CSS, Recharts

## Architecture
```
src/
├── components/ui.jsx     MetricCard, ProgressBar, ProjectHeader, DecisionButton, ImpactPanel, DecisionTimeline, ChartPanel
├── pages/                Landing, Setup, Play, Results, About
├── data/                 projects.js, scenarios.js, concepts.js  (all content, no UI)
├── utils/                engine.js (pure simulation logic), storage.js, useCountUp.js
└── styles/styles.css
```

## How It Works
Each option in `data/scenarios.js` has an effects array `[schedule, budget, scope, quality, morale, stakeholders, risk]`. `engine.js` applies it with `applyEffects`, clamps each metric to 0–100, and records the result in the history. Project Health is the average of the six positive metrics and `100 − risk`. Outcome text and insights are derived from the final state and the history. To add a scenario, add an object to `scenarios.js`; no UI change is needed.

## Running Locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Deployment (GitHub Pages)
1. Push this repo to GitHub (default branch `main`).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and publishes the site.
`vite.config.js` uses `base: './'`, so it works for any repository name.
Update the GitHub link in `src/pages/Landing.jsx`.

## Future Improvements
Multiplayer and team-based scenarios, more project types, AI-generated scenarios, advanced analytics, real-world case simulations.
