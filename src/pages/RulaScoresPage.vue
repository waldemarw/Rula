<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { canonicalUrl, OG_IMAGE } from '@/config'

useSeoMeta({
  title: 'RULA Scores Explained: What 1–7 Means & Action Levels',
  description:
    'A RULA score of 1–2 is acceptable; 7 needs changing immediately. What every score on the 1–7 scale means, the four action levels, why scores come out high and how to bring them down.',
  ogTitle: 'RULA scores explained: what 1–7 means',
  ogDescription:
    'What each RULA score and action level means, why scores come out high, and how to bring them down.',
  ogType: 'article',
  ogUrl: canonicalUrl('/rula-scores'),
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl('/rula-scores') }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'What is a good RULA score?',
        url: canonicalUrl('/rula-scores'),
        about:
          'Interpretation of Rapid Upper Limb Assessment scores and action levels, based on McAtamney & Corlett (1993).',
      }),
    },
  ],
})
</script>

<template>
  <div class="container page">
    <h1>What is a good RULA score?</h1>
    <p class="lead muted">
      The short answer: <strong>1 or 2</strong>. A RULA grand score runs from 1 to 7, and lower
      is always better — anything above 2 is the method telling you to look closer.
    </p>

    <h2>The four action levels</h2>
    <ul>
      <li>
        <strong>Score 1–2 · Action level 1 — acceptable.</strong> The posture is acceptable if
        it is not maintained or repeated for long periods. This is the "good" band; scores of 1
        are rare in real work and usually mean a well-supported, neutral posture.
      </li>
      <li>
        <strong>Score 3–4 · Action level 2 — investigate further.</strong> Not an emergency, but
        the posture is loading the body enough that changes may be required. Most everyday desk
        setups that "feel a bit awkward" land here.
      </li>
      <li>
        <strong>Score 5–6 · Action level 3 — investigate and change soon.</strong> The
        combination of posture, muscle use and force is likely to be contributing to discomfort
        or injury risk; plan changes rather than waiting for symptoms.
      </li>
      <li>
        <strong>Score 7 · Action level 4 — investigate and change immediately.</strong> The
        highest loading the method can express. Do not leave the task as it is.
      </li>
    </ul>

    <h2>Where the number comes from</h2>
    <p>
      The grand score is not an average — it is built from two halves. Part A scores the
      <strong>arm and wrist</strong> (upper arm, lower arm, wrist position and twist via Table
      A), Part B scores the <strong>neck, trunk and legs</strong> (Table B). Each half then adds
      a muscle-use score (+1 for static postures held over a minute, or action repeated more
      than four times a minute) and a force/load score (0–3). The two totals meet in Table C to
      give the final 1–7. Because the tables saturate, a very bad single element — say, a wrist
      bent at end of range under load — can dominate an otherwise reasonable posture.
    </p>

    <h2>Why is my score high?</h2>
    <p>The usual suspects, roughly in order of how often they appear in assessments:</p>
    <ul>
      <li><strong>Static muscle use</strong> — a posture held longer than a minute (screen work is static by nature) adds +1 to both halves.</li>
      <li><strong>Working above shoulder height or with raised shoulders</strong> — upper arm scores climb steeply past 45° of flexion.</li>
      <li><strong>Wrist deviation and twist</strong> — bending the wrist away from neutral, or twisting near end of range.</li>
      <li><strong>Neck and trunk flexion</strong> — leaning into the screen or over a bench, worse if twisted or side-bent.</li>
      <li><strong>Unsupported legs</strong> — feet not firmly supported and balanced.</li>
      <li><strong>Force</strong> — anything from 2 kg upwards, especially static or repeated.</li>
    </ul>

    <h2>How to bring a score down</h2>
    <p>
      Work through the same elements in reverse: support the forearms and get the upper arms
      hanging relaxed; bring work between elbow and shoulder height and close to the body;
      keep wrists neutral (straight and mid-twist); raise the screen or lower the bench so the
      neck stays upright; give the feet stable support; reduce or share the load; and break up
      static postures — the +1 muscle-use scores disappear when the posture varies. Re-run the
      assessment after each change: because of the table structure, one fix can drop the grand
      score by more than one point.
    </p>

    <h2>A caution on chasing the number</h2>
    <p>
      RULA scores a <em>snapshot</em> of one posture as part of a rapid screening process. A
      "good" score for one moment does not certify a whole job, and the method is intended to be
      used within a broader ergonomic study — refer to McAtamney, L. and Corlett, E.N.,
      <em>Applied Ergonomics</em> 1993, 24(2), 91–99 for the correct use of the scores.
    </p>

    <p>
      Get your own number in a few minutes with the free
      <RouterLink to="/">online RULA assessment</RouterLink>, score by hand with the
      <RouterLink to="/rula-worksheet">printable worksheet</RouterLink>, or compare methods in
      <RouterLink to="/rula-vs-reba">RULA vs REBA</RouterLink>.
    </p>
  </div>
</template>
