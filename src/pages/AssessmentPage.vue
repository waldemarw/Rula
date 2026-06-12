<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useRulaSession } from '@/stores/rulaSession'
import { rulaAssessment } from '@/assessments/rula'
import type { RulaMode } from '@/assessments/rula'
import { OG_IMAGE, SITE_URL } from '@/config'
import StepNav from '@/components/assessment/StepNav.vue'
import QuestionStepCard from '@/components/assessment/QuestionStepCard.vue'
import DetailsStepCard from '@/components/assessment/DetailsStepCard.vue'
import ResultsView from '@/components/assessment/ResultsView.vue'
import ScorePanel from '@/components/assessment/ScorePanel.vue'

const route = useRoute()
const session = useRulaSession()

const mode = computed<RulaMode>(() => (route.meta.mode as RulaMode) ?? 'right')
const variant = computed(() => rulaAssessment.variants.find((v) => v.slug === mode.value)!)

watch(mode, (m) => session.start(m), { immediate: true })

watch(
  () => session.stepIndex,
  () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
)

const current = computed(() => session.currentStep)
const questionNumber = computed(() => session.stepIndex + 1)
const canAdvance = computed(
  () => current.value.kind !== 'question' || session.isAnswered(current.value.id),
)

useSeoMeta({
  title: () => `${variant.value.name} | free online tool`,
  description: () =>
    `${variant.value.description} Free instant scoring with action levels and a PDF summary, based on McAtamney & Corlett (1993).`,
  ogTitle: () => variant.value.name,
  ogDescription: () => variant.value.description,
  ogType: 'website',
  ogUrl: () => `${SITE_URL}${variant.value.path}`,
  ogImage: OG_IMAGE,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: () => `${SITE_URL}${variant.value.path}` }],
})
</script>

<template>
  <div class="container assessment-layout">
    <section class="card assessment-card">
      <h1>{{ variant.name }}</h1>
      <p class="muted" style="font-size: 14px; margin-bottom: 0">
        Select the posture that most accurately reflects the working position at each step. You
        can revisit any completed step by clicking its number.
      </p>

      <StepNav />

      <QuestionStepCard
        v-if="current.kind === 'question'"
        :key="current.id"
        :step="current"
        :step-number="questionNumber"
      />
      <DetailsStepCard v-else-if="current.kind === 'details'" />
      <ResultsView v-else />

      <div v-if="current.kind !== 'results'" class="controls">
        <button
          v-if="session.stepIndex > 0"
          type="button"
          class="btn btn--ghost"
          @click="session.back()"
        >
          Back
        </button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="!canAdvance"
          @click="session.next()"
        >
          {{ current.kind === 'details' ? 'Show results' : 'Save & continue' }}
        </button>
      </div>
    </section>

    <aside v-if="current.kind !== 'results'" class="score-aside">
      <ScorePanel />
    </aside>
  </div>
</template>
