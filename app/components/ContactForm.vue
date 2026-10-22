<script setup lang="ts">
import { ArrowRight, CircleCheck, LoaderCircle } from 'lucide-vue-next'
import { contactFieldsSchema, contactSubjects } from '~~/shared/contact'

const config = useRuntimeConfig()
const initialFields = () => ({
  name: '',
  email: '',
  phone: '',
  subject: contactSubjects[0] as string,
  message: '',
  consent: false
})
const fields = reactive(initialFields())
const errors = ref<Record<string, string>>({})
const honeypot = ref('')
const token = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref('')
const form = useTemplateRef<HTMLFormElement>('form')
const confirmation = useTemplateRef<HTMLElement>('confirmation')
const failure = useTemplateRef<HTMLElement>('failure')
const turnstile = useTemplateRef<{ reset: () => void }>('turnstile')

async function submit() {
  if (sending.value) {
    return
  }
  error.value = ''
  errors.value = {}
  const result = contactFieldsSchema.safeParse(fields)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.value[String(issue.path[0])] ||= issue.message
    }
    await nextTick()
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  if (!token.value) {
    error.value = 'Please complete the security check before sending your message.'
    await nextTick()
    failure.value?.focus()
    return
  }
  sending.value = true
  try {
    const response = await $fetch<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: { ...result.data, honeypot: honeypot.value, turnstileToken: token.value },
      retry: 0,
      timeout: 30000
    })
    if (!response.success) {
      throw new Error('Message was not accepted')
    }
    sent.value = true
    Object.assign(fields, initialFields())
    honeypot.value = ''
    await nextTick()
    confirmation.value?.focus()
  } catch (cause) {
    const status = (cause as { statusCode?: number }).statusCode
    error.value =
      status === 429
        ? 'You’ve made several attempts. Please wait 15 minutes, or email Shannon directly.'
        : status === 400
          ? 'Please complete a new security check and try sending your message again.'
          : 'Your message could not be sent. Please try again, or email hello@shannonchapoy.com.'
    await nextTick()
    failure.value?.focus()
  } finally {
    sending.value = false
    token.value = ''
    turnstile.value?.reset()
  }
}

async function sendAnother() {
  sent.value = false
  error.value = ''
  errors.value = {}
  await nextTick()
  form.value?.querySelector<HTMLInputElement>('#contact-name')?.focus()
}
</script>

<template>
  <section class="contact-form" :aria-labelledby="sent ? 'contact-success' : 'contact-form-title'">
    <div v-if="sent" ref="confirmation" class="contact-confirmation" tabindex="-1" role="status">
      <CircleCheck class="w-12 h-12 text-brand-seaBlue mb-5" aria-hidden="true" />
      <h2 id="contact-success" class="font-serif text-3xl text-brand-dkPurple mb-4">Thank you for reaching out.</h2>
      <p class="leading-relaxed mb-8">
        Your message has been sent to Shannon. She’ll reply to the email address you provided.
      </p>
      <button type="button" class="conversion-button" @click="sendAnother">Send another message</button>
    </div>
    <template v-else>
      <h2 id="contact-form-title" class="font-serif text-3xl text-brand-dkPurple mb-2">Send a message</h2>
      <p class="text-sm mb-7">Fields marked with an asterisk (*) are required.</p>
      <form ref="form" action="/api/contact" method="post" novalidate :aria-busy="sending" @submit.prevent="submit">
        <fieldset :disabled="sending" class="contact-fields">
          <legend class="sr-only">Your contact details and message</legend>
          <div class="contact-row">
            <div>
              <label for="contact-name">Name *</label>
              <input
                id="contact-name"
                v-model="fields.name"
                name="name"
                autocomplete="name"
                required
                maxlength="200"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'contact-name-error' : undefined"
                @input="delete errors.name"
              />
              <p v-if="errors.name" id="contact-name-error" class="field-error">{{ errors.name }}</p>
            </div>
            <div>
              <label for="contact-email">Email *</label>
              <input
                id="contact-email"
                v-model="fields.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                maxlength="254"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'contact-email-error' : undefined"
                @input="delete errors.email"
              />
              <p v-if="errors.email" id="contact-email-error" class="field-error">{{ errors.email }}</p>
            </div>
          </div>
          <div class="contact-row">
            <div>
              <label for="contact-phone">Phone <span class="font-normal">(optional)</span></label>
              <input
                id="contact-phone"
                v-model="fields.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                maxlength="100"
                :aria-invalid="!!errors.phone"
                :aria-describedby="errors.phone ? 'contact-phone-error' : undefined"
                @input="delete errors.phone"
              />
              <p v-if="errors.phone" id="contact-phone-error" class="field-error">{{ errors.phone }}</p>
            </div>
            <div>
              <label for="contact-subject">Subject *</label>
              <select
                id="contact-subject"
                v-model="fields.subject"
                name="subject"
                required
                :aria-invalid="!!errors.subject"
                :aria-describedby="errors.subject ? 'contact-subject-error' : undefined"
                @change="delete errors.subject"
              >
                <option v-for="subject in contactSubjects" :key="subject" :value="subject">{{ subject }}</option>
              </select>
              <p v-if="errors.subject" id="contact-subject-error" class="field-error">{{ errors.subject }}</p>
            </div>
          </div>
          <div>
            <label for="contact-message">How can I help? *</label>
            <textarea
              id="contact-message"
              v-model="fields.message"
              name="message"
              rows="5"
              required
              minlength="10"
              maxlength="10000"
              :aria-invalid="!!errors.message"
              :aria-describedby="errors.message ? 'contact-message-error' : undefined"
              @input="delete errors.message"
            />
            <p v-if="errors.message" id="contact-message-error" class="field-error">{{ errors.message }}</p>
          </div>
          <div>
            <label class="consent-label" for="contact-consent">
              <input
                id="contact-consent"
                v-model="fields.consent"
                name="consent"
                type="checkbox"
                required
                :aria-invalid="!!errors.consent"
                :aria-describedby="errors.consent ? 'contact-consent-error' : undefined"
                @change="delete errors.consent"
              />
              <span>I agree that Shannon may use these details to respond to my message. *</span>
            </label>
            <NuxtLink to="/privacy" class="conversion-text-link text-sm mt-2 inline-flex"
              >Read the privacy policy</NuxtLink
            >
            <p v-if="errors.consent" id="contact-consent-error" class="field-error">{{ errors.consent }}</p>
          </div>
          <div hidden aria-hidden="true">
            <label for="contact-website">Website</label>
            <input id="contact-website" v-model="honeypot" name="website" tabindex="-1" autocomplete="off" />
          </div>
          <ContactTurnstile v-if="config.public.turnstileSiteKey" ref="turnstile" v-model="token" />
          <p v-else class="text-sm leading-relaxed" role="status">
            The contact form is temporarily unavailable. Please email
            <a href="mailto:hello@shannonchapoy.com" class="conversion-text-link">hello@shannonchapoy.com</a>.
          </p>
          <p v-if="error" ref="failure" class="field-error" role="alert" tabindex="-1">{{ error }}</p>
          <button
            type="submit"
            class="conversion-button justify-center w-full sm:w-auto sm:justify-self-start"
            :disabled="sending || !config.public.turnstileSiteKey"
          >
            <LoaderCircle v-if="sending" class="w-5 h-5 animate-spin" aria-hidden="true" />
            {{ sending ? 'Sending…' : 'Send message' }}
            <ArrowRight v-if="!sending" class="w-5 h-5" aria-hidden="true" />
          </button>
        </fieldset>
      </form>
    </template>
  </section>
</template>

<style scoped>
.contact-form {
  min-width: 0;
  padding: clamp(1.5rem, 4vw, 3rem);
}
.contact-fields {
  display: grid;
  gap: 1.5rem;
  min-width: 0;
}
.contact-row {
  display: grid;
  gap: 1.5rem;
  min-width: 0;
}
.contact-row > div {
  min-width: 0;
}
label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
input:not([type='checkbox']),
select,
textarea {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid #b7a8c1;
  border-radius: 0.5rem;
  background: white;
  font: inherit;
  color: var(--color-catalog-ink);
}
textarea {
  resize: vertical;
  min-height: 9rem;
}
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-catalog-action);
  outline-offset: 2px;
}
[aria-invalid='true'] {
  border-color: var(--color-catalog-error);
}
.consent-label {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  font-weight: 400;
  line-height: 1.5;
}
input[type='checkbox'] {
  flex-shrink: 0;
  margin-top: 0.25rem;
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--color-catalog-action);
}
.field-error {
  margin-top: 0.5rem;
  color: var(--color-catalog-error);
  font-size: 0.875rem;
  line-height: 1.5;
}
button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.contact-confirmation {
  padding-block: 2rem;
}
@media (min-width: 40rem) {
  .contact-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
