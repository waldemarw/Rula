<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { canonicalUrl, OG_IMAGE } from '@/config'

useSeoMeta({
  title: 'RULA vs REBA — Differences, Scores & When to Use Each',
  description:
    'RULA scores the neck, trunk and upper limbs on 1–7; REBA covers the whole body including load handling on 1–15. The practical differences between the two methods, and how to pick the right one.',
  ogTitle: 'RULA vs REBA — differences and when to use each',
  ogDescription:
    'A practical comparison of the RULA and REBA observational assessment methods and when to use each.',
  ogType: 'article',
  ogUrl: canonicalUrl('/rula-vs-reba'),
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl('/rula-vs-reba') }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'RULA vs REBA: which ergonomic assessment should you use?',
        url: canonicalUrl('/rula-vs-reba'),
        about:
          'Comparison of the Rapid Upper Limb Assessment (McAtamney & Corlett, 1993) and the Rapid Entire Body Assessment (Hignett & McAtamney, 2000).',
      }),
    },
  ],
})
</script>

<template>
  <div class="container page">
    <h1>RULA vs REBA — which should you use?</h1>
    <p class="lead muted">
      Two closely related observational methods, one decision: score the upper limbs in detail,
      or score the whole body. Here is how they differ in practice.
    </p>

    <div class="card" style="margin-block: 24px">
      <p>
        <strong>RULA</strong> (Rapid Upper Limb Assessment, McAtamney &amp; Corlett 1993) was
        designed for investigating work-related upper limb disorders: it looks closely at the
        arm, wrist, neck and trunk of a mainly stationary — often seated — worker.
        <strong>REBA</strong> (Rapid Entire Body Assessment, Hignett &amp; McAtamney 2000) grew
        out of the same scoring approach but covers the entire body, and adds factors for the
        load being handled, the quality of the grip and whether the posture is static or
        rapidly changing.
      </p>
      <p style="margin-bottom: 0">
        The rule of thumb: <strong>task anchored at a bench or screen → RULA; task involving the
        whole body, lifting or unpredictable postures → REBA.</strong>
      </p>
    </div>

    <h2>The differences at a glance</h2>
    <div style="overflow-x: auto">
      <table class="compare-table">
        <thead>
          <tr>
            <th></th>
            <th>RULA</th>
            <th>REBA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Published</th>
            <td>McAtamney &amp; Corlett, 1993</td>
            <td>Hignett &amp; McAtamney, 2000</td>
          </tr>
          <tr>
            <th>Body focus</th>
            <td>Neck, trunk and upper limbs; legs scored only as supported or not</td>
            <td>Whole body, with fuller leg scoring (weight bearing, knee angle)</td>
          </tr>
          <tr>
            <th>Final score</th>
            <td>1–7</td>
            <td>1–15</td>
          </tr>
          <tr>
            <th>Action levels</th>
            <td>4 levels</td>
            <td>5 risk levels (negligible → very high)</td>
          </tr>
          <tr>
            <th>Load / force</th>
            <td>Force and muscle-use scores for arm/wrist and neck/trunk/legs</td>
            <td>Load score plus a <em>coupling</em> score for grip quality</td>
          </tr>
          <tr>
            <th>Typical tasks</th>
            <td>Display screen work, assembly, sewing, laboratory and bench work</td>
            <td>Patient handling, manual handling, warehousing, construction</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>When RULA is the better fit</h2>
    <p>
      Choose RULA when the risk you are screening for sits in the neck, shoulders, arms and
      wrists — the classic picture for display screen users and repetitive bench or line work.
      Because it concentrates its scoring resolution on the upper limb, RULA discriminates
      between wrist and arm postures more finely than REBA, and it scores each arm separately
      (the <RouterLink to="/assessment/both">online tool</RouterLink> can score both sides in
      one pass).
    </p>

    <h2>When REBA is the better fit</h2>
    <p>
      Choose REBA when the whole body is doing the work: lifting, carrying, pushing, bending and
      kneeling, or postures that change unpredictably — it was originally developed with
      healthcare tasks in mind. Its coupling score also matters whenever grip quality affects
      the risk, which RULA does not capture.
    </p>

    <h2>Can you use both?</h2>
    <p>
      Yes — they are complementary screens, not competitors. Many assessors run RULA on the
      workstation tasks and REBA on the manual handling tasks within the same investigation.
      Both are single-posture snapshots intended as part of a broader ergonomic study, not a
      complete risk assessment on their own.
    </p>

    <p>
      This site currently scores <strong>RULA</strong> —
      <RouterLink to="/">start an assessment</RouterLink> for an instant score and action level,
      or read <RouterLink to="/rula-scores">what your RULA score means</RouterLink>. You can
      also <RouterLink to="/rula-worksheet">download the paper worksheet</RouterLink>.
    </p>

    <h2>References</h2>
    <p class="muted">
      McAtamney, L. and Corlett, E.N. "RULA: a survey method for the investigation of
      work-related upper limb disorders." <em>Applied Ergonomics</em> 1993, 24(2), 91–99.<br />
      Hignett, S. and McAtamney, L. "Rapid Entire Body Assessment (REBA)."
      <em>Applied Ergonomics</em> 2000, 31(2), 201–205.
    </p>
  </div>
</template>
