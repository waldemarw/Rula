import { describe, expect, it } from 'vitest'
import { canonicalUrl, SITE_URL } from '../src/config'
import { routes } from '../src/router/routes'

/**
 * vite-ssg builds with `dirStyle: 'nested'`, so GitHub Pages serves every route
 * with a trailing slash and 301s the slash-less form. A canonical that points at
 * the redirecting URL splits Google's signals across both — which is exactly what
 * the 2026-08 Search Console export showed. These pin the slash rule down.
 */
describe('canonicalUrl', () => {
  it('leaves the site root as a bare slash', () => {
    expect(canonicalUrl('/')).toBe('https://rula.co.uk/')
    expect(canonicalUrl()).toBe('https://rula.co.uk/')
  })

  it('adds the trailing slash the host actually serves', () => {
    expect(canonicalUrl('/rula-worksheet')).toBe('https://rula.co.uk/rula-worksheet/')
    expect(canonicalUrl('/assessment/right')).toBe('https://rula.co.uk/assessment/right/')
  })

  it('is idempotent, so an already-slashed path is not doubled', () => {
    expect(canonicalUrl('/rula-scores/')).toBe('https://rula.co.uk/rula-scores/')
  })

  it('tolerates a missing leading slash', () => {
    expect(canonicalUrl('about')).toBe('https://rula.co.uk/about/')
  })

  it('never emits a URL that the host would redirect', () => {
    for (const path of ['/', '/about', '/contact/', 'rula-citation']) {
      const url = canonicalUrl(path)
      expect(url.startsWith(SITE_URL)).toBe(true)
      expect(url.endsWith('/')).toBe(true)
    }
  })

  it('covers every real route, so a new page cannot be missed', () => {
    const paths = routes.map((r) => r.path).filter((p) => !p.includes(':'))
    expect(paths).toContain('/rula-citation')
    for (const path of paths) {
      expect(canonicalUrl(path).endsWith('/')).toBe(true)
    }
  })
})
