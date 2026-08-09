<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead, useSeoMeta } from '@unhead/vue'
import { canonicalUrl } from '@/config'
import { useWeb3Forms, web3FormsConfigured } from '@/composables/useWeb3Forms'

const configured = web3FormsConfigured

const form = reactive({ name: '', email: '', message: '', botcheck: '' })
const { status, send } = useWeb3Forms()

const route = useRoute()
/** Set after mount: the prerendered page has no query string, so swapping copy
    any earlier would mismatch hydration. */
const isFeedback = ref(false)
onMounted(() => {
  isFeedback.value = route.query.topic === 'feedback'
})

function submit() {
  return send({
    subject: `rula.co.uk — ${isFeedback.value ? 'feedback' : 'message'} from ${form.name}`,
    message: form.message,
    name: form.name,
    email: form.email,
    botcheck: form.botcheck,
  })
}

useSeoMeta({
  title: 'Contact | RULA — Rapid Upper Limb Assessment',
  description:
    'Get in touch about the free online RULA assessment tool — questions, feedback or suggestions.',
  ogUrl: canonicalUrl('/contact'),
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl('/contact') }],
})
</script>

<template>
  <div class="container page">
    <h1>Contact</h1>
    <p v-if="isFeedback" class="muted">
      Thanks for taking a moment — feedback from real use is what shapes this tool. What worked,
      what tripped you up, what's missing? A sentence or two is plenty.
    </p>
    <p v-else class="muted">
      Questions, feedback, or an idea for the site? Send a message and I'll get back to you by
      email.
    </p>

    <div v-if="!configured" class="card">
      <p style="margin: 0">
        The contact form is being set up — please check back soon.
      </p>
    </div>

    <div v-else-if="status === 'sent'" class="form-status form-status--ok">
      Thanks — your message has been sent.
    </div>

    <form v-else class="form-grid" @submit.prevent="submit">
      <div class="field">
        <label for="contact-name">Name</label>
        <input id="contact-name" v-model="form.name" type="text" required maxlength="80" autocomplete="name" />
      </div>
      <div class="field">
        <label for="contact-email">Email address</label>
        <input id="contact-email" v-model="form.email" type="email" required maxlength="120" autocomplete="email" />
        <small>Only used to reply to you — never shared.</small>
      </div>
      <div class="field">
        <label for="contact-message">Message</label>
        <textarea
          id="contact-message"
          v-model="form.message"
          required
          rows="6"
          maxlength="4000"
          :placeholder="isFeedback ? 'What would make this tool more useful for you?' : undefined"
        ></textarea>
      </div>
      <!-- honeypot, hidden from real users -->
      <input
        v-model="form.botcheck"
        type="text"
        name="botcheck"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        style="position: absolute; left: -9999px"
      />
      <p v-if="status === 'error'" class="form-status form-status--error">
        Sorry, the message could not be sent. Please try again in a moment.
      </p>
      <div>
        <button type="submit" class="btn btn--primary" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Sending…' : 'Send message' }}
        </button>
      </div>
    </form>
  </div>
</template>
