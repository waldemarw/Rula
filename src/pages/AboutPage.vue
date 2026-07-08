<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { OG_IMAGE, SITE_URL } from '@/config'

useSeoMeta({
  title: 'What is RULA? | About Rapid Upper Limb Assessment',
  description:
    'Learn about the Rapid Upper Limb Assessment survey method developed by McAtamney and Corlett to investigate work-related upper limb disorders, and download the manual scoring sheet.',
  ogTitle: 'What is RULA? | About Rapid Upper Limb Assessment',
  ogDescription:
    'Learn about the Rapid Upper Limb Assessment survey method developed by McAtamney and Corlett to investigate work-related upper limb disorders.',
  ogType: 'article',
  ogUrl: `${SITE_URL}/about`,
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: `${SITE_URL}/about` }],
})
</script>

<template>
  <div class="container page">
    <h1>What is RULA?</h1>
    <p class="lead muted">
      RULA — Rapid Upper Limb Assessment — was developed by Lynn McAtamney and Nigel Corlett at
      the Institute for Occupational Ergonomics, University of Nottingham.
    </p>

    <div class="card" style="margin-block: 24px">
      <p>
        Rapid Upper Limb Assessment is a survey method developed for use in ergonomic
        investigations of workplaces where work-related upper limb disorders are reported. RULA
        is a screening tool that assesses biomechanical and postural loading on the whole body,
        with particular attention to the neck, trunk and upper limbs.
      </p>
      <p>
        Reliability studies have been conducted using RULA on groups of VDU users and sewing
        machine operators. A RULA assessment requires little time to complete, and the scoring
        generates an action list indicating the level of intervention required to reduce the
        risks of injury due to physical loading on the operator. RULA is intended to be used as
        part of a broader ergonomic study.
      </p>
      <p style="margin-bottom: 0">
        The assessment works in two parts: <strong>Part A</strong> scores the arm and wrist
        postures (Table A), and <strong>Part B</strong> scores the neck, trunk and legs (Table
        B). Muscle use and force/load scores are added to each, and the two totals combine in
        Table C to give a grand score from 1 to 7 with one of four action levels.
      </p>
    </div>

    <h2>How do I score?</h2>
    <p>
      Use the <RouterLink to="/">online assessment</RouterLink> for instant scoring, or
      <RouterLink to="/rula-worksheet">download the manual scoring worksheet (PDF)</RouterLink>
      to score by hand using the original tables.
    </p>

    <h2>Reference</h2>
    <p class="muted">
      McAtamney, L. and Corlett, E.N. "RULA: a survey method for the investigation of
      work-related upper limb disorders." <em>Applied Ergonomics</em> 1993, 24(2), 91–99.
    </p>
  </div>
</template>
