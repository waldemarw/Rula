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

- [x] Sitemap resubmitted in Google Search Console (2026-07-08)

Phase 1 complete.

## Phase 2 — Polish (next)

- [x] Persist in-progress sessions to localStorage (survive accidental refresh) —
      restored after reload with a "welcome back / start afresh" notice; 24h TTL,
      versioned key `rula-session`, stale ids dropped, 14 tests (2026-07-08)
- [x] Print output reviewed: instructional intro no longer prints, summary images
      load eagerly so PDFs are never missing posture pictures (2026-07-08).
      Verdict on whether print quality "disappoints" (→ html2pdf.js) stays open
      until checked on paper/PDF by a human
- [x] Posture images converted to WebP (580K → 212K, cwebp q75) and Lato 400/700
      woff2 preloaded in the prerendered head (2026-07-08)
- [x] Pruned unused legacy media: summary/*, soc-med, icons, arrows, old logos and
      the stray Osmond svg/ico — nothing in the deployed output references Osmond
      (2026-07-08)
- [x] A11y pass: option cards were already labelled native radios with visible
      focus (kept); step chips gained descriptive aria-labels incl. answered
      state; keyboard flow verified in-browser (2026-07-08)

Post-launch extras (2026-07-08):

- [x] Feedback prompting: "Was this tool useful?" nudge on the results page,
      "Give feedback" footer link, and `/contact?topic=feedback` deep-link that
      tailors the copy and tags the Web3Forms subject with "feedback" so
      prompt-driven messages are measurable in the inbox
- [x] CLS fix from Cloudflare RUM data: option-card image boxes now reserve the
      full image height (142px) so cards don't shift as posture images load

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
- Content/SEO: short guides — organic search is the existing asset to build on.
  GSC data (2026-07-08) confirmed the gaps: worksheet/sheet/pdf queries ranked
  16–20 with no page, "rula vs reba" ranked ~50, "rula score" 6.8.
  - [x] `/rula-worksheet` — PDF download + step-by-step hand-scoring guide,
        linked from footer and About, in sitemap (2026-07-08)
  - [x] `/rula-vs-reba` — comparison table + when-to-use guidance, seeds a
        future REBA tool (2026-07-08)
  - [x] `/rula-scores` — "What is a good RULA score?" guide: action levels,
        score anatomy, how to reduce a score; linked from the results page
        action-level key (2026-07-08)
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
- **Session persistence is store-internal, not a Pinia plugin** (2026-07-08):
  the save is read once at store creation (before any state change can clobber
  it) and applied by `restore()` from the page's `onMounted`, so prerendered
  HTML never hydration-mismatches. Key `rula-session` (naming follows
  `rula-theme`), versioned payload, 24 h TTL, stale step/option ids dropped and
  the step index clamped. Switching assessment mode still discards progress —
  persistence mirrors the existing in-memory semantics rather than changing them.
