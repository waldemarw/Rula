<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { SITE_URL } from '@/config'

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
const configured = Boolean(accessKey)

const form = reactive({ name: '', email: '', message: '', botcheck: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

async function submit() {
  if (form.botcheck) return // honeypot tripped — silently drop
  status.value = 'sending'
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `rula.co.uk — message from ${form.name}`,
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    })
    const data = await response.json()
    status.value = data.success ? 'sent' : 'error'
  } catch {
    status.value = 'error'
  }
}

useSeoMeta({
  title: 'Contact | RULA — Rapid Upper Limb Assessment',
  description:
    'Get in touch about the free online RULA assessment tool — questions, feedback or suggestions.',
  ogUrl: `${SITE_URL}/contact`,
})

useHead({
  link: [{ rel: 'canonical', href: `${SITE_URL}/contact` }],
})
</script>

<template>
  <div class="container page">
    <h1>Contact</h1>
    <p class="muted">
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
        <textarea id="contact-message" v-model="form.message" required rows="6" maxlength="4000"></textarea>
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
