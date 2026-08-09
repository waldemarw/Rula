<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRulaSession } from '@/stores/rulaSession'
import { rulaAssessment } from '@/assessments/rula'
import type { RulaSide } from '@/assessments/rula'
import { SUPPORT_URL } from '@/config'
import { useWeb3Forms, web3FormsConfigured } from '@/composables/useWeb3Forms'

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

/* ── Feedback ──────────────────────────────────────────────────────────
   One click is the whole ask. The long-form contact page produced nothing
   in two months, which is what an "email a stranger" ask costs an
   anonymous visitor. Deliberately sends the verdict and the optional note
   and nothing else — no answers, no score, no personal details — so the
   promise made on the details step stays true without qualification. */
const { status: feedbackStatus, send: sendFeedback } = useWeb3Forms()
const feedbackView = ref<'ask' | 'note'>('ask')
const note = ref('')

function submitFeedback(verdict: 'useful' | 'not-quite') {
  return sendFeedback({
    subject: `rula.co.uk — feedback: ${verdict}`,
    message: note.value.trim()
      ? `Verdict: ${verdict}\n\n${note.value.trim()}`
      : `Verdict: ${verdict} (no note left)`,
  })
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

    <aside v-if="web3FormsConfigured" class="feedback-prompt">
      <template v-if="feedbackStatus === 'sent'">
        <h3>Thanks — that's genuinely useful.</h3>
        <p>Every response gets read.</p>
      </template>

      <template v-else-if="feedbackView === 'note'">
        <h3>What was off?</h3>
        <p class="feedback-prompt__hint">
          One line is plenty. Leave it blank if you'd rather not say.
        </p>
        <div class="feedback-note">
          <input
            v-model="note"
            type="text"
            maxlength="300"
            aria-label="What was off?"
            placeholder="e.g. the wrist step was hard to follow"
            @keyup.enter="submitFeedback('not-quite')"
          />
          <button
            type="button"
            class="btn btn--primary btn--sm"
            :disabled="feedbackStatus === 'sending'"
            @click="submitFeedback('not-quite')"
          >
            {{ feedbackStatus === 'sending' ? 'Sending…' : 'Send' }}
          </button>
        </div>
        <p v-if="feedbackStatus === 'error'" class="feedback-prompt__hint">
          That didn't send — you can
          <RouterLink to="/contact?topic=feedback">use the contact form</RouterLink> instead.
        </p>
      </template>

      <template v-else>
        <h3>Was this useful?</h3>
        <p class="feedback-prompt__hint">
          One click. Nothing but your answer is sent — your postures, score and details stay in
          your browser.
        </p>
        <div class="feedback-actions">
          <button
            type="button"
            class="btn btn--outline btn--sm"
            :disabled="feedbackStatus === 'sending'"
            @click="submitFeedback('useful')"
          >
            Yes, that helped
          </button>
          <button
            type="button"
            class="btn btn--ghost btn--sm"
            @click="feedbackView = 'note'"
          >
            Something was off
          </button>
        </div>
        <p v-if="feedbackStatus === 'error'" class="feedback-prompt__hint">
          That didn't send — you can
          <RouterLink to="/contact?topic=feedback">use the contact form</RouterLink> instead.
        </p>
      </template>
    </aside>

    <aside v-if="SUPPORT_URL" class="support-note">
      <p>
        rula.co.uk has been free for over twenty years and always will be. The domain costs about
        £30 a year; hosting costs nothing. If this saved you some time, you're welcome to
        <a :href="SUPPORT_URL" target="_blank" rel="noopener">chip in towards it</a>.
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
