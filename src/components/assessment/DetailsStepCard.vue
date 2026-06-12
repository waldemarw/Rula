<script setup lang="ts">
import { onMounted } from 'vue'
import { useRulaSession } from '@/stores/rulaSession'

const session = useRulaSession()

onMounted(() => {
  if (!session.details.date) {
    session.details.date = new Date().toISOString().slice(0, 10)
  }
})
</script>

<template>
  <div>
    <p class="section-label">Almost done</p>
    <h2>Personal details <span class="muted">(optional)</span></h2>
    <p class="muted">
      These details only appear on your PDF summary. Nothing is stored or sent anywhere — leave
      any field blank to skip it.
    </p>

    <div class="form-grid">
      <div class="field">
        <label for="details-assessee">Assessee (person being assessed)</label>
        <input id="details-assessee" v-model="session.details.assessee" type="text" maxlength="60" placeholder="e.g. John Doe" />
      </div>
      <div class="field">
        <label for="details-assessor">Assessor</label>
        <input id="details-assessor" v-model="session.details.assessor" type="text" maxlength="60" placeholder="e.g. Jane Doe" />
      </div>
      <div class="field">
        <label for="details-email">Email address</label>
        <input id="details-email" v-model="session.details.email" type="email" maxlength="80" placeholder="e.g. name@example.com" />
      </div>
      <div class="field">
        <label for="details-department">Department / location</label>
        <input id="details-department" v-model="session.details.department" type="text" maxlength="60" placeholder="e.g. HR" />
      </div>
      <div class="field">
        <label for="details-company">Company / organisation</label>
        <input id="details-company" v-model="session.details.company" type="text" maxlength="60" />
      </div>
      <div class="field">
        <label for="details-date">Date</label>
        <input id="details-date" v-model="session.details.date" type="date" />
      </div>
    </div>
  </div>
</template>
