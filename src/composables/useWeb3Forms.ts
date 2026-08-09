import { ref } from 'vue'

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

/** False when the key is missing (local dev, or a fork without the repo secret). */
export const web3FormsConfigured = Boolean(accessKey)

export type SendStatus = 'idle' | 'sending' | 'sent' | 'error'

export interface Web3FormsMessage {
  subject: string
  message: string
  name?: string
  email?: string
  /** Honeypot value. Non-empty means a bot filled a field real users can't see. */
  botcheck?: string
}

/**
 * Posts to Web3Forms, which relays to the site inbox. The only place the
 * endpoint, the access key and the honeypot check live — both the contact form
 * and the one-click results-page feedback go through here.
 */
export function useWeb3Forms() {
  const status = ref<SendStatus>('idle')

  async function send({ subject, message, name, email, botcheck }: Web3FormsMessage) {
    if (botcheck) return false // honeypot tripped — drop it, but look successful
    if (!web3FormsConfigured) {
      status.value = 'error'
      return false
    }

    status.value = 'sending'
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: accessKey, subject, message, name, email }),
      })
      const data = await response.json()
      status.value = data.success ? 'sent' : 'error'
      return Boolean(data.success)
    } catch {
      status.value = 'error'
      return false
    }
  }

  return { status, send }
}
