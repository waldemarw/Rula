<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { canonicalUrl, OG_IMAGE } from '@/config'

useSeoMeta({
  title: 'RULA Worksheet PDF — Free Download & Scoring Guide',
  description:
    'Download the RULA employee assessment worksheet as a free PDF, with a step-by-step guide to scoring it by hand. Looking for the RULA Excel spreadsheet? The free online tool does the same table lookups for you.',
  ogTitle: 'RULA Worksheet PDF — free download',
  ogDescription:
    'The original RULA scoring worksheet as a free PDF, with a step-by-step guide to completing it by hand.',
  ogType: 'article',
  ogUrl: canonicalUrl('/rula-worksheet'),
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl('/rula-worksheet') }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'RULA worksheet: free PDF download and how to score it by hand',
        url: canonicalUrl('/rula-worksheet'),
        about:
          'The Rapid Upper Limb Assessment (RULA) paper scoring worksheet, based on McAtamney & Corlett (1993).',
      }),
    },
  ],
})
</script>

<template>
  <div class="container page">
    <h1>The RULA worksheet</h1>
    <p class="lead muted">
      The classic single-page scoring sheet for a Rapid Upper Limb Assessment — download it as a
      free PDF, or let the <RouterLink to="/">online tool</RouterLink> do the table lookups for
      you.
    </p>

    <div class="card" style="margin-block: 24px">
      <p>
        The RULA worksheet condenses the whole assessment method — posture diagrams, adjustment
        boxes and the three scoring tables — onto one A4 page. It is the format most people
        recognise from training courses and textbooks, and it is still the quickest way to score
        an assessment with nothing but a pen and a clipboard.
      </p>
      <p style="margin-bottom: 0">
        <a class="btn btn--primary" href="/media/RULASheet.pdf" target="_blank" rel="noopener">
          Download the RULA worksheet (PDF)
        </a>
      </p>
    </div>

    <h2>How to complete the worksheet, step by step</h2>
    <p>
      The sheet is worked through in two halves. Scores for each posture come from the diagrams;
      the boxed numbers next to them are the adjustments.
    </p>

    <h3>Part A — arm and wrist analysis</h3>
    <ol>
      <li><strong>Upper arm</strong> — score the flexion/extension range, then adjust: +1 if the shoulder is raised, +1 if the upper arm is abducted, −1 if the arm is supported or the person is leaning.</li>
      <li><strong>Lower arm</strong> — score the elbow angle, +1 if the arm works across the midline of the body or out to the side.</li>
      <li><strong>Wrist</strong> — score flexion/extension, +1 if the wrist is bent away from the midline.</li>
      <li><strong>Wrist twist</strong> — 1 if the wrist stays mainly mid-range of twist, 2 at or near the end of range.</li>
      <li><strong>Table A</strong> — read the posture score from the four values above.</li>
      <li><strong>Muscle use</strong> — +1 if the posture is mainly static (held longer than 1 minute) or repeated more than 4 times per minute.</li>
      <li><strong>Force/load</strong> — 0 to 3 depending on the load and whether it is intermittent, static or repeated.</li>
      <li><strong>Wrist &amp; arm score</strong> — Table A + muscle use + force/load.</li>
    </ol>

    <h3>Part B — neck, trunk and leg analysis</h3>
    <ol start="9">
      <li><strong>Neck</strong> — score flexion/extension, +1 if the neck is twisted, +1 if side-bending.</li>
      <li><strong>Trunk</strong> — score flexion, +1 if the trunk is twisted, +1 if side-bending.</li>
      <li><strong>Legs</strong> — 1 if the legs and feet are supported and balanced, 2 if not.</li>
      <li><strong>Table B</strong> — read the posture score from the neck, trunk and leg values.</li>
      <li><strong>Muscle use and force/load</strong> — scored exactly as in Part A, for the neck, trunk and legs.</li>
      <li><strong>Grand score</strong> — combine the wrist &amp; arm score and the neck, trunk &amp; leg score in Table C to get the final RULA score of 1 to 7.</li>
    </ol>

    <h2>Reading the result: the four action levels</h2>
    <ul>
      <li><strong>Score 1–2 · Action level 1</strong> — the posture is acceptable if it is not maintained or repeated for long periods.</li>
      <li><strong>Score 3–4 · Action level 2</strong> — further investigation is needed and changes may be required.</li>
      <li><strong>Score 5–6 · Action level 3</strong> — investigation and changes are required soon.</li>
      <li><strong>Score 7 · Action level 4</strong> — investigation and changes are required immediately.</li>
    </ul>

    <h2>Worksheet or online tool?</h2>
    <p>
      The paper sheet is ideal on the workshop floor. The trade-off is the manual table lookups —
      three tables per assessment, and twice that if you score both arms — which is where
      transcription and arithmetic errors creep in. The
      <RouterLink to="/assessment/both">online assessment</RouterLink> uses the same postures,
      adjustments and tables, but does every lookup automatically, shows the running scores as you
      go, and produces a PDF summary of the completed assessment. If you are looking for a RULA
      Excel spreadsheet, the online tool covers the same need: the tables are built in and the
      arithmetic is done for you.
    </p>

    <h2>Reference</h2>
    <p class="muted">
      McAtamney, L. and Corlett, E.N. "RULA: a survey method for the investigation of
      work-related upper limb disorders." <em>Applied Ergonomics</em> 1993, 24(2), 91–99. Always
      refer to the original methodology to check the correct use of the scores. Writing this up?
      <RouterLink to="/rula-citation">Copy the reference</RouterLink> in APA, Harvard, Vancouver,
      BibTeX or RIS.
    </p>
  </div>
</template>
