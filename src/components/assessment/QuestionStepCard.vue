<script setup lang="ts">
import { computed } from 'vue'
import type { QuestionStep } from '@/assessments/types'
import { useRulaSession } from '@/stores/rulaSession'

const props = defineProps<{
  step: QuestionStep
  stepNumber: number
}>()

const session = useRulaSession()

const selectedId = computed(() => session.selections[props.step.id])
const hasImages = computed(() => props.step.options.some((o) => o.image))
</script>

<template>
  <fieldset class="question">
    <legend class="sr-only">{{ step.title }}</legend>
    <p class="section-label">{{ step.section }}</p>
    <h2>Step {{ stepNumber }}: {{ step.title }}</h2>

    <div class="option-grid" :class="{ 'option-grid--text': !hasImages }">
      <label
        v-for="option in step.options"
        :key="option.id"
        class="option-card"
        :class="{ 'is-selected': option.id === selectedId }"
      >
        <input
          type="radio"
          class="sr-only"
          :name="step.id"
          :value="option.id"
          :checked="option.id === selectedId"
          @change="session.choose(step.id, option.id)"
        />
        <span v-if="option.image" class="option-card__img">
          <img :src="option.image" :alt="option.imageAlt ?? option.label" loading="lazy" />
        </span>
        <span class="option-card__label">{{ option.label }}</span>
        <ul v-if="option.detail">
          <li v-for="line in option.detail" :key="line">{{ line }}</li>
        </ul>
      </label>
    </div>

    <div v-if="step.adjustments && selectedId" class="adjustments">
      <h3>{{ step.adjustments.title }}</h3>
      <label
        v-for="option in step.adjustments.options"
        :key="option.id"
        class="adjustment-option"
      >
        <input
          type="checkbox"
          :checked="session.flags[option.id] ?? false"
          @change="session.setFlag(option.id, ($event.target as HTMLInputElement).checked)"
        />
        <span>
          {{ option.label }}
          <img v-if="option.image" :src="option.image" :alt="option.imageAlt ?? ''" loading="lazy" />
        </span>
      </label>
    </div>
  </fieldset>
</template>
