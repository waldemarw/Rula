<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { assessments } from '@/assessments/registry'
import { canonicalUrl, OG_IMAGE } from '@/config'

const rula = assessments[0]

useSeoMeta({
  title: 'RULA — Rapid Upper Limb Assessment | Free Online Ergonomic Tool',
  description:
    'Free online RULA assessment. Score biomechanical and postural loading on the neck, trunk and upper limbs in minutes, with instant action levels and a PDF summary. Based on McAtamney & Corlett (1993).',
  ogTitle: 'RULA — Rapid Upper Limb Assessment | Free Online Tool',
  ogDescription:
    'A free online ergonomic screening tool that assesses biomechanical and postural loading on the whole body, with particular attention to the neck, trunk and upper limbs.',
  ogType: 'website',
  ogUrl: canonicalUrl('/'),
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl('/') }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'RULA — Rapid Upper Limb Assessment',
        url: canonicalUrl('/'),
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any (web-based)',
        description:
          'A free online ergonomic screening tool that assesses biomechanical and postural loading on the whole body, with particular attention to the neck, trunk and upper limbs.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      }),
    },
  ],
})
</script>

<template>
  <div class="container">
    <section class="hero">
      <div>
        <h1>Rapid Upper Limb Assessment, scored in minutes</h1>
        <p class="lead">
          RULA is a survey method for investigating work-related upper limb disorders. Pick the
          postures that match the working position and get an instant score, action level and a
          free PDF summary — no sign-up needed.
        </p>
        <a class="btn btn--primary" href="#assessments">Start an assessment</a>
      </div>
      <div class="hero__art">
        <img
          src="/media/manikin_logo.png"
          alt="RULA manikin illustrating upper limb posture"
          width="240"
          height="280"
        />
      </div>
    </section>

    <section id="assessments" class="home-section">
      <h2>Choose your assessment</h2>
      <div class="variant-grid">
        <div v-for="variant in rula.variants" :key="variant.slug" class="card variant-card">
          <h3>{{ variant.label }}</h3>
          <p>{{ variant.description }}</p>
          <RouterLink :to="variant.path" class="btn btn--outline">Start</RouterLink>
        </div>
      </div>
    </section>

    <section class="home-section">
      <h2>How it works</h2>
      <div class="steps-grid">
        <div class="card">
          <h3>1 · Select postures</h3>
          <p class="muted">
            Work through guided steps for the arm, wrist, neck, trunk and legs, choosing the
            illustration closest to the working position.
          </p>
        </div>
        <div class="card">
          <h3>2 · Instant scoring</h3>
          <p class="muted">
            Scores are calculated live using the original RULA tables, exactly as published by
            McAtamney &amp; Corlett — watch them build as you answer.
          </p>
        </div>
        <div class="card">
          <h3>3 · Action level + PDF</h3>
          <p class="muted">
            Get a grand score of 1–7 with its action level, a full breakdown of every answer, and
            a printable PDF summary — free.
          </p>
        </div>
      </div>
    </section>

    <section class="home-section">
      <details class="disclaimer">
        <summary>Methodology &amp; disclaimer</summary>
        <p style="margin-top: 12px">
          Every care has been taken in preparing this resource; it must be used according to the
          guidelines based on the original article by Dr L. McAtamney and Prof E.N. Corlett. No
          responsibility will be taken for the use of this software. RULA provides a score of a
          snapshot of the activity as part of a rapid screening tool — the user should refer to
          the original article to check the detail of the scoring and the correct use of RULA
          scores. Further investigation and actions may be required.
        </p>
        <p>
          McAtamney, L. and Corlett, E.N. "RULA: a survey method for the investigation of
          work-related upper limb disorders." Applied Ergonomics 1993, 24(2), 91–99.
          <RouterLink to="/about">Read more about RULA</RouterLink>.
        </p>
      </details>
    </section>
  </div>
</template>
