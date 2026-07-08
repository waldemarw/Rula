<script setup lang="ts">
import { computed } from 'vue'
import { useRulaSession } from '@/stores/rulaSession'
import { rulaAssessment } from '@/assessments/rula'
import type { RulaSide } from '@/assessments/rula'

const session = useRulaSession()

const sideHeadings: Record<RulaSide, string> = {
  right: 'Right side',
  left: 'Left side',
}

const scoredSides = computed(() =>
  session.sides.filter((side): side is RulaSide => session.results[side] !== undefined),
)

const detailRows = computed(() =>
  (
    [
      ['Assessee', session.details.assessee],
      ['Assessor', session.details.assessor],
      ['Email', session.details.email],
      ['Department / location', session.details.department],
      ['Company / organisation', session.details.company],
      ['Date', session.details.date],
    ] as const
  ).filter(([, value]) => value),
)

const answerSummary = computed(() =>
  session.questionSteps.map((step, index) => {
    const selected = session.selectedOption(step.id)
    const ticked = (step.adjustments?.options ?? []).filter((o) => session.flags[o.id])
    return { step, number: index + 1, selected, ticked }
  }),
)

function savePdf() {
  window.print()
}

function startAgain() {
  session.reset()
}
</script>

<template>
  <div class="results">
    <p class="section-label">Results</p>
    <h2>Your RULA score</h2>

    <div v-for="side in scoredSides" :key="side" class="result-card" :data-level="session.results[side]!.actionLevel.level">
      <h2>
        <span class="grand">{{ session.results[side]!.grandScore }}</span>
        <span v-if="session.mode === 'both'">RULA score — {{ sideHeadings[side] }}</span>
        <span v-else>Final RULA score</span>
      </h2>
      <p>
        Action level {{ session.results[side]!.actionLevel.level }}:
        {{ session.results[side]!.actionLevel.advice }}
      </p>
    </div>

    <div class="action-level-key">
      <span><span class="dot" style="background: var(--al-1)"></span>Score 1–2 · Action level 1 — posture acceptable if not held or repeated for long periods</span>
      <span><span class="dot" style="background: var(--al-2)"></span>Score 3–4 · Action level 2 — further investigation needed, changes may be required</span>
      <span><span class="dot" style="background: var(--al-3)"></span>Score 5–6 · Action level 3 — investigation and changes required soon</span>
      <span><span class="dot" style="background: var(--al-4)"></span>Score 7 · Action level 4 — investigation and changes required immediately</span>
    </div>

    <p class="muted score-guide-link">
      <RouterLink to="/rula-scores">What do these action levels mean?</RouterLink> ·
      <RouterLink to="/rula-vs-reba">RULA vs REBA</RouterLink>
    </p>

    <h3>Score breakdown</h3>
    <template v-for="side in scoredSides" :key="`break-${side}`">
      <h4 v-if="session.mode === 'both'" class="muted">{{ sideHeadings[side] }}</h4>
      <div class="subscore-grid">
        <div class="subscore">
          Posture score (Table A)<strong>{{ session.results[side]!.tableA }}</strong>
        </div>
        <div class="subscore">
          Arm &amp; wrist score<strong>{{ session.results[side]!.armWristScore }}</strong>
        </div>
        <div class="subscore">
          Posture score (Table B)<strong>{{ session.results[side]!.tableB }}</strong>
        </div>
        <div class="subscore">
          Neck, trunk &amp; leg score<strong>{{ session.results[side]!.neckTrunkLegScore }}</strong>
        </div>
      </div>
    </template>

    <div class="results-actions">
      <button type="button" class="btn btn--primary" @click="savePdf">Save as PDF</button>
      <button type="button" class="btn btn--ghost" @click="startAgain">Start a new assessment</button>
      <RouterLink
        v-for="variant in rulaAssessment.variants"
        :key="variant.slug"
        :to="variant.path"
        class="btn btn--outline"
      >
        {{ variant.label }}
      </RouterLink>
    </div>

    <aside class="feedback-prompt">
      <h3>Was this tool useful?</h3>
      <p>
        rula.co.uk is free and shaped by the people who use it. If something helped, tripped you
        up, or is missing — <RouterLink to="/contact?topic=feedback">send a quick note</RouterLink>.
        Every message gets read.
      </p>
    </aside>

    <section v-if="detailRows.length">
      <h3>Personal details</h3>
      <div class="subscore-grid">
        <div v-for="[label, value] in detailRows" :key="label" class="subscore">
          {{ label }}<strong style="font-size: 15px">{{ value }}</strong>
        </div>
      </div>
    </section>

    <section>
      <h3>Answers selected</h3>
      <div class="summary-list">
        <div v-for="entry in answerSummary" :key="entry.step.id" class="summary-item">
          <span v-if="entry.selected?.image" class="summary-item__img">
            <!-- Eager: lazy images can be missing from the printed PDF in some browsers. -->
            <img :src="entry.selected.image" :alt="entry.selected.imageAlt ?? entry.selected.label" />
          </span>
          <span v-else class="summary-item__img muted">{{ entry.selected?.label }}</span>
          <div>
            <h4>Step {{ entry.number }}: {{ entry.step.title }}</h4>
            <p>{{ entry.selected?.label }}</p>
            <ul v-if="entry.ticked.length">
              <li v-for="adj in entry.ticked" :key="adj.id">{{ adj.label }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
