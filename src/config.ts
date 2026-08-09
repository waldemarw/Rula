export const SITE_URL = 'https://rula.co.uk'
export const SITE_NAME = 'RULA — Rapid Upper Limb Assessment'
export const OG_IMAGE = `${SITE_URL}/media/manikin_logo.png`

/**
 * Absolute URL for a route, in the trailing-slash form the host actually serves.
 *
 * vite-ssg builds with `dirStyle: 'nested'`, so `/rula-worksheet` is emitted as
 * `rula-worksheet/index.html` and GitHub Pages 301s the slash-less URL to it.
 * Canonicals, og:url and JSON-LD must therefore end in a slash — otherwise every
 * page declares a canonical that redirects, and Google indexes both forms.
 */
export function canonicalUrl(path = '/'): string {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/|\/$/g, '')}/`
  return `${SITE_URL}${clean}`
}

/**
 * Where the "chip in" links point — the domain is the site's only running cost,
 * hosting is free. Set to '' to remove the support links entirely. Deliberately
 * a plain external link rather than an embedded widget: no script, no cookies,
 * so the site stays consent-banner-free.
 */
export const SUPPORT_URL = 'https://ko-fi.com/rulacouk'
