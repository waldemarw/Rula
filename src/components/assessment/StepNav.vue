<script setup lang="ts">
import { useRulaSession } from '@/stores/rulaSession'

const session = useRulaSession()

function chipLabel(index: number): string {
  const step = session.flow[index]
  if (step.kind === 'details') return '✎'
  if (step.kind === 'results') return '★'
  return String(index + 1)
}

function chipClass(index: number) {
  const step = session.flow[index]
  return {
    'is-current': index === session.stepIndex,
    'is-done': step.kind === 'question' && session.isAnswered(step.id),
  }
}

/** Full announcement for screen readers; the visible chip only shows a glyph. */
function chipAria(index: number): string {
  const step = session.flow[index]
  if (step.kind !== 'question') return step.title
  const state = session.isAnswered(step.id) ? ' (answered)' : ''
  return `Step ${index + 1}: ${step.title}${state}`
}
</script>

<template>
  <nav class="step-nav" aria-label="Assessment steps">
    <button
      v-for="(step, index) in session.flow"
      :key="step.id"
      type="button"
      class="step-chip"
      :class="chipClass(index)"
      :disabled="index > session.maxReachableIndex"
      :title="step.title"
      :aria-label="chipAria(index)"
      :aria-current="index === session.stepIndex ? 'step' : undefined"
      @click="session.goTo(index)"
    >
      {{ chipLabel(index) }}
    </button>
  </nav>
</template>
