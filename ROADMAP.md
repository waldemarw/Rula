# Roadmap

Goal: relaunch rula.co.uk on the new Vue stack within ~1 week of casual work, keep its
search ranking, then grow it into something monetisable.

## Phase 1 — Relaunch (this week)

Done (on the `vue-rewrite` branch):

- [x] Vue 3 + TS + Pinia + vite-ssg scaffold, all routes prerendered for SEO
- [x] Scoring engine ported with exact parity, guarded by 37 Vitest tests
- [x] Assessment flow for right / left / both sides (single data-driven page)
- [x] Live "progress so far" score panel
- [x] Results with action levels, full answer summary, print-based Save as PDF
- [x] Dark mode toggle (no-flash bootstrap, persisted)
- [x] Contact page wired for Web3Forms (key pending)
- [x] All Osmond Ergonomics references and personal attribution removed
- [x] SEO: per-page titles/canonicals/OG, JSON-LD, sitemap, robots, redirect stubs
      for the old `.html` URLs
- [x] CI: tests + typecheck gate the GitHub Pages deploy

Launch (completed 2026-06-12):

- [x] Web3Forms access key created → repo secret `WEB3FORMS_ACCESS_KEY`
- [x] All three assessment variants verified by hand
- [x] Print/PDF output checked
- [x] Merged `vue-rewrite` → `main`; first Pages deploy succeeded
- [x] Post-deploy spot-checks: new site live at rula.co.uk, old URLs redirect
      with canonicals, sitemap serving, no Osmond references in output

Remaining:

- [ ] Resubmit sitemap in Google Search Console; watch coverage for a week

## Phase 2 — Polish (next)

- [ ] Persist in-progress sessions to localStorage (survive accidental refresh)
- [ ] Nicer PDF: dedicated print layout — or evaluate client-side pdf generation
      if print quality disappoints (legacy used html2pdf.js)
- [ ] Lighthouse pass (image sizes — posture JPGs could be WebP; preload fonts)
- [ ] Optimise/prune unused legacy media in `public/media` (summary/* is unused)
- [ ] A11y pass: keyboard-only run-through, screen reader labels on option cards

## Phase 3 — Backend & accounts (later)

Pure-TS engine is deliberately framework-free so it can run server-side.

- [ ] Cloudflare is the natural home (DNS + analytics already there): Pages/Workers
      + D1 or KV for storage, free tier
- [ ] Accounts (email magic link?) → save assessment history, re-open past scores
- [ ] Server-rendered/branded PDF reports
- [ ] The contact form can move from Web3Forms to a Worker at that point

## Phase 4 — Growth & monetisation ideas (not committed)

- More assessments via `src/assessments/` registry: **REBA** (whole body) is the
  obvious sibling; ROSA (office), NIOSH lifting equation
- Content/SEO: short guides ("what is a good RULA score?", "RULA vs REBA") —
  organic search is the existing asset to build on
- Monetisation candidates, roughly in order of fit:
  1. Free single assessments; paid accounts for history/team features
  2. Pro PDF reports (logo, multiple assessments, trends) for consultants
  3. Team/organisation dashboards (assessor seats)
  4. API access for integration into H&S tooling
  5. (Last resort: ads — would cheapen a health tool)

## Decisions log

- **vite-ssg over Nuxt**: plain Vue + explicit router, matches existing knowledge;
  SSG gives SEO parity with the old static site on GitHub Pages.
- **Print-stylesheet PDF first**: zero dependencies and crisp output; html2pdf.js
  (what legacy used) can be added later if needed.
- **Web3Forms for contact**: static-site-friendly, free tier, key is public-safe;
  swap for a Worker when the backend lands.
- **Legacy site kept in `legacy/`**: it is the scoring fixture for parity tests and
  the reference for any "how did it behave before?" question. Never edit it.
- **URL scheme changed** (`/assessment.html` → `/assessment/right` etc.) with
  meta-refresh + canonical redirect stubs; domain authority carries the rest.
- **Dark mode defaults to the system preference** (`prefers-color-scheme`), with
  the toggle's explicit choice persisted as an override — the standard
  three-state pattern. A light-only default was considered and rejected
  (2026-06-12): OS-level preference is the user's stated choice.
