# RULA — Rapid Upper Limb Assessment

A free online ergonomic screening tool that assesses biomechanical and postural loading on the
whole body, with particular attention to the neck, trunk and upper limbs.

Based on the original methodology by McAtamney, L. and Corlett, E.N.
(Applied Ergonomics 1993, 24(2), 91–99).

**Live site:** [rula.co.uk](https://rula.co.uk)

## Stack

Vue 3 (`<script setup>` + TypeScript) · Pinia (setup stores) · vue-router ·
[vite-ssg](https://github.com/antfu-collective/vite-ssg) for static pre-rendering (SEO) ·
Vitest · deployed to GitHub Pages via Actions.

## Commands

| Command             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server with HMR                          |
| `npm run test`      | Vitest in watch mode                         |
| `npm run test:run`  | Test suite once (CI gate)                    |
| `npm run typecheck` | `vue-tsc --noEmit`                           |
| `npm run build`     | Static-generate the site into `dist/`        |
| `npm run preview`   | Serve the built `dist/`                      |

**Node 22.12 or newer is required for `npm run build`** — vite-ssg's prerender pulls in
a dependency that `require()`s an ES module, which older Node refuses. Dev, tests and
typecheck are all fine on Node 20; only the build fails, and it fails loudly.

## URLs and canonicals

vite-ssg builds with `dirStyle: 'nested'`, so every route is emitted as
`<route>/index.html` and GitHub Pages 301s the slash-less URL to the slash form.
Canonicals, `og:url` and JSON-LD `url` must therefore end in a slash — build them with
`canonicalUrl()` from `src/config.ts` rather than interpolating `SITE_URL` by hand, and
add new routes to `public/sitemap.xml` in the same form. `tests/canonical-url.spec.ts`
enforces this. Getting it wrong makes Google index both forms and split the ranking
signals between them.

## Architecture

- `src/assessments/` — the assessment framework. Each tool lives in its own folder
  (`rula/` today; REBA/ROSA/… can be added later) and registers in `registry.ts`.
  - `rula/tables.ts` — the original RULA lookup tables, ported verbatim.
  - `rula/scoring.ts` — pure scoring engine (no framework imports, reusable server-side).
  - `rula/questions.ts` — question/option definitions including the score values.
- `src/stores/rulaSession.ts` — Pinia setup store holding one assessment session.
- `src/pages/` + `src/router/routes.ts` — one prerendered route per page;
  `/assessment/{right,left,both}` share `AssessmentPage.vue`.
- `legacy/` — the original 2019 static site, kept as the **authoritative scoring fixture**.
  Do not edit; the parity tests load `legacy/js/rula-tables.js` directly.

## Scoring parity

The whole value of the tool is that scores match the published RULA method exactly.
This is protected by tests:

- `tests/rula-tables-parity.spec.ts` — TS tables ≡ legacy JS tables, key for key.
- `tests/rula-scoring.spec.ts` — golden cases, action-level boundaries, and exhaustive
  totality over every reachable input combination.
- `tests/rula-questions.spec.ts` — locks the option/adjustment values and step order.
- `tests/rula-session.spec.ts` — store wiring, including the per-arm force/load rule
  in both-sides mode.

CI runs the suite before every deploy. **Never change `tables.ts`, option values, or
engine arithmetic without understanding why a parity test failed.**

## Contact form

The contact page posts to [Web3Forms](https://web3forms.com). Setup: create a (free)
access key for the inbox address, then set it as the `WEB3FORMS_ACCESS_KEY` repository
secret (used at build time) and in `.env` locally (`VITE_WEB3FORMS_ACCESS_KEY`).
Until the key is configured the page shows a "form being set up" notice.

## Deployment

Pushes to `main` build and deploy to GitHub Pages (`.github/workflows/deploy.yml`).
Tests and typecheck gate the deploy. The custom domain (rula.co.uk) is served via
`public/CNAME`; old `.html` URLs redirect through stub pages in `public/`.

See `ROADMAP.md` for what's planned next.
