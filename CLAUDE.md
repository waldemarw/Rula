# CLAUDE.md

Free online RULA (Rapid Upper Limb Assessment) tool at rula.co.uk.
Vue 3 + TypeScript + Pinia + vite-ssg, tested with Vitest, deployed to GitHub Pages.

## Hard rules

- **Scoring parity is sacred.** Scores must match the original published RULA method
  (and the legacy site) exactly. `legacy/` is the authoritative fixture — never edit it.
  If a test in `tests/` fails after a change to `src/assessments/rula/`, the change is
  wrong until proven otherwise.
- **No Osmond Ergonomics references, no personal attribution** anywhere on the site
  (the original sponsor company is dissolved; the owner wants the site neutral).
- **Pinia stores: composition (setup) style only** — `defineStore('x', () => {...})`.
- Components: `<script setup lang="ts">`.

## Layout

- `src/assessments/types.ts` + `registry.ts` — generic framework; future assessments
  (REBA, ROSA…) get their own folder beside `rula/` and a registry entry.
- `src/assessments/rula/` — tables (verbatim port), pure scoring engine, question defs.
  The engine must stay framework-free (future server-side reuse).
- `src/stores/rulaSession.ts` — one in-progress assessment session.
- `src/pages/AssessmentPage.vue` — drives all three variants via route `meta.mode`.
- SEO: every page sets title/canonical/OG via `@unhead/vue`; routes are prerendered
  by vite-ssg at build. Old `.html` URLs redirect via stubs in `public/`.
- Dark mode: `<html data-theme>` set by an inline script in `index.html` before paint;
  `ThemeToggle.vue` is deliberately stateless (CSS swaps the icon).

## Workflow

- `npm run dev` / `test` / `test:run` / `typecheck` / `build` / `preview`.
- Preview servers for the Claude preview panel are in `.claude/launch.json`
  (`rula-dev`, `rula-preview`).
- CI (`.github/workflows/deploy.yml`): test + typecheck gate the Pages deploy on `main`.
- Contact form needs the `WEB3FORMS_ACCESS_KEY` repo secret at build time.

`ROADMAP.md` tracks phases and the decisions log — keep both current.
