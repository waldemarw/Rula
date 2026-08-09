<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { canonicalUrl, OG_IMAGE } from '@/config'

const DOI = '10.1016/0003-6870(93)90080-S'

/** One entry per citation style. `text` is what lands on the clipboard. */
const citations = [
  {
    id: 'apa',
    label: 'APA (7th edition)',
    text: `McAtamney, L., & Corlett, E. N. (1993). RULA: A survey method for the investigation of work-related upper limb disorders. Applied Ergonomics, 24(2), 91–99. https://doi.org/${DOI}`,
  },
  {
    id: 'harvard',
    label: 'Harvard',
    text: `McAtamney, L. and Corlett, E.N. (1993) 'RULA: a survey method for the investigation of work-related upper limb disorders', Applied Ergonomics, 24(2), pp. 91–99. doi: ${DOI}.`,
  },
  {
    id: 'vancouver',
    label: 'Vancouver',
    text: `McAtamney L, Corlett EN. RULA: a survey method for the investigation of work-related upper limb disorders. Appl Ergon. 1993;24(2):91-9. doi:${DOI}`,
  },
  {
    id: 'mla',
    label: 'MLA (9th edition)',
    text: `McAtamney, Lynn, and E. Nigel Corlett. "RULA: A Survey Method for the Investigation of Work-Related Upper Limb Disorders." Applied Ergonomics, vol. 24, no. 2, 1993, pp. 91–99.`,
  },
  {
    id: 'bibtex',
    label: 'BibTeX',
    text: `@article{mcatamney1993rula,
  title   = {RULA: a survey method for the investigation of work-related upper limb disorders},
  author  = {McAtamney, Lynn and Corlett, E. Nigel},
  journal = {Applied Ergonomics},
  volume  = {24},
  number  = {2},
  pages   = {91--99},
  year    = {1993},
  doi     = {${DOI}}
}`,
  },
  {
    id: 'ris',
    label: 'RIS (EndNote, Mendeley, Zotero)',
    text: `TY  - JOUR
AU  - McAtamney, Lynn
AU  - Corlett, E. Nigel
TI  - RULA: a survey method for the investigation of work-related upper limb disorders
JO  - Applied Ergonomics
VL  - 24
IS  - 2
SP  - 91
EP  - 99
PY  - 1993
DO  - ${DOI}
ER  -`,
  },
]

/** "Accessed" has to be the reader's date, not the build date — filling it during
    prerender would hydration-mismatch the moment the build got a day old. Set
    after mount; the prerendered HTML carries a readable placeholder instead, so
    the block still makes sense to a crawler or with JS off. (The year is safe to
    prerender — SiteFooter already does the same.) */
const accessed = ref('')
onMounted(() => {
  accessed.value = new Date().toISOString().slice(0, 10)
})

const siteCitation = computed(
  () =>
    `rula.co.uk (${new Date().getFullYear()}) RULA — Rapid Upper Limb Assessment ` +
    `[online tool]. Available at: https://rula.co.uk/ ` +
    `(Accessed: ${accessed.value || '[the date you accessed it]'}).`,
)

const copied = ref('')

async function copy(id: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = id
    setTimeout(() => {
      if (copied.value === id) copied.value = ''
    }, 2000)
  } catch {
    // Clipboard blocked (insecure context, or permission denied) — the text is
    // selectable on the page anyway, so there is nothing useful to report.
  }
}

useSeoMeta({
  title: 'How to Cite RULA — McAtamney & Corlett (1993) Reference',
  description:
    'The RULA reference in APA, Harvard, Vancouver, MLA, BibTeX and RIS: McAtamney, L. and Corlett, E.N. (1993) Applied Ergonomics 24(2), 91–99, doi 10.1016/0003-6870(93)90080-S. Copy it in one click.',
  ogTitle: 'How to cite RULA — McAtamney & Corlett (1993)',
  ogDescription:
    'The original RULA paper reference in APA, Harvard, Vancouver, MLA, BibTeX and RIS formats, with the DOI.',
  ogType: 'article',
  ogUrl: canonicalUrl('/rula-citation'),
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl('/rula-citation') }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline:
          'RULA: a survey method for the investigation of work-related upper limb disorders',
        author: [
          { '@type': 'Person', name: 'Lynn McAtamney' },
          { '@type': 'Person', name: 'E. Nigel Corlett' },
        ],
        datePublished: '1993',
        isPartOf: {
          '@type': 'PublicationIssue',
          issueNumber: '2',
          isPartOf: { '@type': 'Periodical', name: 'Applied Ergonomics', volume: '24' },
        },
        pageStart: '91',
        pageEnd: '99',
        identifier: `https://doi.org/${DOI}`,
        sameAs: `https://doi.org/${DOI}`,
      }),
    },
  ],
})
</script>

<template>
  <div class="container page">
    <h1>How to cite RULA</h1>
    <p class="lead muted">
      RULA was published by Lynn McAtamney and E. Nigel Corlett in <em>Applied Ergonomics</em> in
      1993. That paper is the citation you want — not this website. Pick your style below and
      copy it.
    </p>

    <div class="card" style="margin-block: 24px">
      <dl class="cite-facts">
        <div><dt>Authors</dt><dd>McAtamney, L. and Corlett, E.N.</dd></div>
        <div>
          <dt>Title</dt>
          <dd>RULA: a survey method for the investigation of work-related upper limb disorders</dd>
        </div>
        <div><dt>Journal</dt><dd>Applied Ergonomics, 1993, volume 24, issue 2, pages 91–99</dd></div>
        <div>
          <dt>DOI</dt>
          <dd>
            <a :href="`https://doi.org/${DOI}`" target="_blank" rel="noopener">{{ DOI }}</a>
          </dd>
        </div>
        <div>
          <dt>PMID</dt>
          <dd>
            <a href="https://pubmed.ncbi.nlm.nih.gov/15676903/" target="_blank" rel="noopener">
              15676903
            </a>
          </dd>
        </div>
      </dl>
    </div>

    <h2>Ready-made references</h2>

    <div v-for="citation in citations" :key="citation.id" class="cite-block">
      <div class="cite-block__head">
        <h3>{{ citation.label }}</h3>
        <button type="button" class="btn btn--outline btn--sm" @click="copy(citation.id, citation.text)">
          {{ copied === citation.id ? 'Copied' : 'Copy' }}
        </button>
      </div>
      <pre><code>{{ citation.text }}</code></pre>
    </div>

    <h2>Citing this website as well</h2>
    <p>
      You normally only need the 1993 paper. If your work depends on the fact that the assessment
      was scored with this particular tool — for example when reporting how the scores in a study
      were produced — you can add the site as a secondary reference:
    </p>
    <div class="cite-block">
      <div class="cite-block__head">
        <h3>This tool</h3>
        <button type="button" class="btn btn--outline btn--sm" @click="copy('site', siteCitation)">
          {{ copied === 'site' ? 'Copied' : 'Copy' }}
        </button>
      </div>
      <pre><code>{{ siteCitation }}</code></pre>
    </div>

    <h2>Reading the paper</h2>
    <p>
      The full text is published by Elsevier and is not hosted here. It is available through
      <a :href="`https://doi.org/${DOI}`" target="_blank" rel="noopener">its DOI</a>, and most
      universities provide access through their library. The
      <RouterLink to="/about">about page</RouterLink> summarises the method, the
      <RouterLink to="/rula-worksheet">worksheet page</RouterLink> has the scoring sheet as a free
      PDF, and <RouterLink to="/rula-scores">what a RULA score means</RouterLink> covers
      interpreting the result.
    </p>

    <h2>A note on REBA</h2>
    <p>
      If you are citing REBA rather than RULA, the paper you want is Hignett, S. and McAtamney, L.
      (2000) 'Rapid Entire Body Assessment (REBA)', <em>Applied Ergonomics</em>, 31(2), pp.
      201–205. The two methods are compared on the
      <RouterLink to="/rula-vs-reba">RULA vs REBA page</RouterLink>.
    </p>
  </div>
</template>
