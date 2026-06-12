<script setup lang="ts">
import { useRulaSession } from '@/stores/rulaSession'

const session = useRulaSession()

function sideTitle(side: 'right' | 'left'): string {
  if (session.mode !== 'both') return 'Part A · Arm & Wrist'
  return side === 'right' ? 'Part A · Right Arm & Wrist' : 'Part A · Left Arm & Wrist'
}
</script>

<template>
  <div class="card score-panel">
    <h2>Progress so far</h2>
    <p class="muted" style="font-size: 13px">
      Table A and Table B values appear once each part is complete — handy if you know the manual
      RULA worksheet.
    </p>

    <section v-for="side in session.sides" :key="side">
      <h3>{{ sideTitle(side) }}</h3>
      <div class="score-row"><span>Upper arm</span><strong>{{ session.sideLiveScores(side).upperArm }}</strong></div>
      <div class="score-row"><span>Lower arm</span><strong>{{ session.sideLiveScores(side).lowerArm }}</strong></div>
      <div class="score-row"><span>Wrist</span><strong>{{ session.sideLiveScores(side).wrist }}</strong></div>
      <div class="score-row"><span>Wrist twist</span><strong>{{ session.sideLiveScores(side).wristTwist }}</strong></div>
      <div class="score-row"><span>Muscle use + force</span><strong>{{ session.sideLiveScores(side).muscleForce }}</strong></div>
      <div v-if="session.sideLiveScores(side).tableA !== null" class="score-row">
        <span>Posture score (Table A)</span><strong>{{ session.sideLiveScores(side).tableA }}</strong>
      </div>
      <div v-if="session.sideLiveScores(side).total !== null" class="score-row is-total">
        <span>Arm &amp; wrist score</span><strong>{{ session.sideLiveScores(side).total }}</strong>
      </div>
    </section>

    <section>
      <h3>Part B · Neck, Trunk &amp; Legs</h3>
      <div class="score-row"><span>Neck</span><strong>{{ session.bodyLiveScores.neck }}</strong></div>
      <div class="score-row"><span>Trunk</span><strong>{{ session.bodyLiveScores.trunk }}</strong></div>
      <div class="score-row"><span>Legs</span><strong>{{ session.bodyLiveScores.legs }}</strong></div>
      <div class="score-row"><span>Muscle use + force</span><strong>{{ session.bodyLiveScores.muscleForce }}</strong></div>
      <div v-if="session.bodyLiveScores.tableB !== null" class="score-row">
        <span>Posture score (Table B)</span><strong>{{ session.bodyLiveScores.tableB }}</strong>
      </div>
      <div v-if="session.bodyLiveScores.total !== null" class="score-row is-total">
        <span>Neck, trunk &amp; leg score</span><strong>{{ session.bodyLiveScores.total }}</strong>
      </div>
    </section>
  </div>
</template>
