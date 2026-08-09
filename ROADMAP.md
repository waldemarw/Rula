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

## Phase 4 — Growth & monetisation

Analysis done 2026-08-09 against the GSC export (2026-06-11 → 2026-08-07) and 30
days of Cloudflare data. **Verdict: the £30/yr domain cost is reachable, but every
route lands in the same £20–50/yr band, so the choice is about cost and character,
not revenue.** Traffic has to grow ~8–15× before anything paid is worth building.

What the data says:

- **The audience mostly cannot pay.** Traffic is predominantly students and
  academics in Mexico, Brazil, Indonesia, Thailand, India, Turkey. Real queries in
  the export: `yg geratis`, `apakah ini gratis`, `quero grátis`, `gratuit`,
  `無料でできる？`, `any free app`, `ergonomics software download free`.
- **~a quarter of impressions are brand collision.** US: 4,843 impressions at
  0.33% CTR, driven by `rula therapists`, `does rula accept medi-cal`,
  `rula.com login` — that is Rula Health (rula.com), a funded US telehealth firm.
  Not winnable. Discount US impressions in any projection.
- **The addressable slice is ~20–25 professional visits/month** (UK/US/AU/DE/CA/IE
  clicks, minus the student share). That is the whole paid market today.
- **Zero feedback replies was the expected outcome**, not a verdict on the tool:
  ~3,700 visits against an "email a stranger" ask converts well under 0.1%.
- Traffic dipped June→August (10.3 → 7.1 clicks/day). Read as academic
  seasonality; re-check in November before drawing conclusions.

Decided sequence:

1. **Free wins (done 2026-08-09)** — see below.
2. **REBA as a second free assessment** — the registry was built for it, and the
   site already draws ~200 impressions/58d on `rula reba` / `reba calculator free`
   at positions 21–34 with no REBA tool at all. Largest single growth lever.
3. **Re-measure in November**, then decide on paid extras. If built: quick
   assessment + score + basic PDF stay free forever; charge only for a branded
   multi-workstation report and saved history — the same line Ergoniza
   (UPV) draws. Must go through a merchant of record (Lemon Squeezy/Paddle):
   a UK seller owes destination VAT on the *first* EU consumer sale, no threshold.
4. **Single sponsor credit** — plausible at £100–250/yr once traffic is 5–10×;
   unsellable now.

Content/SEO pages (organic search is the existing asset):

- [x] `/rula-worksheet` — PDF download + step-by-step hand-scoring guide (2026-07-08)
- [x] `/rula-vs-reba` — comparison table + when-to-use guidance (2026-07-08)
- [x] `/rula-scores` — action levels, score anatomy, how to reduce a score (2026-07-08)
- [x] `/rula-citation` — APA/Harvard/Vancouver/MLA/BibTeX/RIS + DOI, one-click copy.
      Targets ~220 impressions/58d of citation queries that converted almost
      nothing (2026-08-09)

Free wins shipped 2026-08-09:

- [x] **Canonical/trailing-slash fix.** `dirStyle: 'nested'` means Pages serves
      `/rula-worksheet/` and 301s the slash-less form, but every canonical, ogUrl
      and JSON-LD url pointed at the redirecting URL — so Google indexed both and
      split the signals (`/rula-worksheet` 836 impressions *and* `/rula-worksheet/`
      254; same for both assessment sides). New `canonicalUrl()` in `src/config.ts`
      is the single source of the slash rule, covered by `tests/canonical-url.spec.ts`.
      Sitemap and the four `public/*.html` redirect stubs updated to match.
- [x] **Retargeted titles/descriptions** on the three content pages, which were
      pulling 3,072 impressions for 16 clicks. Treated as an experiment — read the
      before/after CTR in GSC around late September. Before:
      `/rula-scores` 0.22% @ 5.84 · `/rula-vs-reba` 0.67% @ 9.35 ·
      `/rula-worksheet` 0.60% @ 5.84.
- [x] **One-click feedback** on the results page replaces the "go to the contact
      page and write a message" ask. Two buttons, optional one-line note, posted
      via the existing Web3Forms key (free tier: 250/month, ample here). Sends the
      verdict and note only — no answers, no score, no personal details — so the
      details-step privacy promise stays true without qualification.
- [x] **Tip jar, dormant.** `SUPPORT_URL` in `src/config.ts` is empty, so nothing
      asking for money renders. Set it to a Ko-fi URL to switch on a footer link
      and a quiet line on the results page (after the score, never before).

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
- **No display ads** (2026-08-09): they would clear the £30/yr bar — an estimated
  £20–45/yr on this country mix — but the cost is wrong. AdSense means a GDPR
  consent banner on a site that currently sets no cookies at all (Cloudflare Web
  Analytics is cookieless), which also undoes the CLS work; the $100 payout
  threshold is ~2 years away at that rate; and approval is doubtful on ~9 thin
  pages. A tip jar earns the same order of money for none of that. Affiliate links
  were rejected too: 3% on furniture needs ~£1,000 of tracked sales for £30, and
  the audience is assessing other people's workstations, not buying chairs.
- **Canonicals carry a trailing slash** (2026-08-09): the served form wins.
  `canonicalUrl()` is the only place that knows the rule, so new pages inherit it;
  `routes.ts` keeps slash-less paths because vue-router handles both client-side.
- **Session persistence is store-internal, not a Pinia plugin** (2026-07-08):
  the save is read once at store creation (before any state change can clobber
  it) and applied by `restore()` from the page's `onMounted`, so prerendered
  HTML never hydration-mismatches. Key `rula-session` (naming follows
  `rula-theme`), versioned payload, 24 h TTL, stale step/option ids dropped and
  the step index clamped. Switching assessment mode still discards progress —
  persistence mirrors the existing in-memory semantics rather than changing them.
