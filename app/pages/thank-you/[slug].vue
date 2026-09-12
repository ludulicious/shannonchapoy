<script setup lang="ts">
import { ArrowLeft, Check } from 'lucide-vue-next'

type CatalogPrice = { amount: number; currency: string }
type CatalogProduct = {
  slug: string
  title: string
  subtitle?: string
  thumbnailImage: string | null
  nextSteps: string
  prices: CatalogPrice[]
  isFree: boolean
}
type CatalogResponse = { items: CatalogProduct[] }

const route = useRoute()
const locale = route.query.locale === 'nl' ? 'nl' : 'en'
const requestedCurrency = typeof route.query.currency === 'string' ? route.query.currency.toUpperCase() : 'EUR'
const currency = requestedCurrency === 'USD' ? 'USD' : 'EUR'
const reference =
  typeof route.query.reference === 'string' && /^BK-[A-F0-9]{12}$/.test(route.query.reference)
    ? route.query.reference
    : ''
const { data, error } = await useFetch<CatalogResponse>('/api/catalog/products', { query: { locale, currency } })
const product = computed(() => data.value?.items.find((item) => item.slug === route.params.slug))

if (!error.value && data.value && !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Purchase not found' })
}

const copy = {
  en: {
    status: 'Payment received',
    title: 'Thank you for your purchase',
    intro: 'Your purchase is confirmed. Here is what happens next.',
    reference: 'Booking reference',
    next: 'Your next steps',
    empty: 'Your purchase is complete. We’ll contact you with the next steps.',
    back: 'Back to offerings',
    home: 'Return to Shannon Chapoy'
  },
  nl: {
    status: 'Betaling ontvangen',
    title: 'Bedankt voor je aankoop',
    intro: 'Je aankoop is bevestigd. Hieronder lees je wat er nu gebeurt.',
    reference: 'Boekingsnummer',
    next: 'Je volgende stappen',
    empty: 'Je aankoop is voltooid. We nemen contact met je op over de volgende stappen.',
    back: 'Terug naar het aanbodoverzicht',
    home: 'Terug naar Shannon Chapoy'
  }
}[locale]

const formattedPrice = computed(() => {
  if (product.value?.isFree) {
    return locale === 'nl' ? 'Gratis' : 'Free'
  }
  const price = product.value?.prices[0]
  return price
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: price.currency }).format(price.amount / 100)
    : ''
})

useSeoMeta({ title: `${copy.title} - Shannon Chapoy`, robots: 'noindex, nofollow' })
</script>

<template>
  <main class="thanks-page">
    <div v-if="error" class="thanks-state" role="alert">
      <h1>{{ locale === 'nl' ? 'Deze aankoop kan niet worden geladen' : 'This purchase cannot be loaded' }}</h1>
      <NuxtLink to="/">{{ copy.home }}</NuxtLink>
    </div>

    <article v-else-if="product" class="thanks-shell" aria-labelledby="thanks-title">
      <section class="thanks-message">
        <div class="thanks-status">
          <span class="thanks-check"><Check aria-hidden="true" /></span>
          <span>{{ copy.status }}</span>
        </div>
        <h1 id="thanks-title">{{ copy.title }}</h1>
        <p class="thanks-intro">{{ copy.intro }}</p>
        <dl v-if="reference" class="booking-reference">
          <dt>{{ copy.reference }}</dt>
          <dd>{{ reference }}</dd>
        </dl>
        <NuxtLink to="/offerings" class="thanks-back">
          <ArrowLeft aria-hidden="true" />
          {{ copy.back }}
        </NuxtLink>
      </section>

      <aside class="purchase-summary">
        <div class="purchase-heading">
          <img
            v-if="product.thumbnailImage"
            :src="product.thumbnailImage"
            :alt="product.title"
            width="112"
            height="112"
          />
          <div>
            <h2>{{ product.title }}</h2>
            <p v-if="product.subtitle">{{ product.subtitle }}</p>
            <strong v-if="formattedPrice">{{ formattedPrice }}</strong>
          </div>
        </div>
        <div class="next-steps">
          <h3>{{ copy.next }}</h3>
          <p>{{ product.nextSteps || copy.empty }}</p>
        </div>
      </aside>
    </article>
  </main>
</template>

<style scoped>
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4
 * genre: editorial · macrostructure: Split Studio · theme: Shannon host · enrichment: product thumbnail
 */
.thanks-page {
  min-height: 100dvh;
  overflow-x: clip;
  padding: clamp(8rem, 14vw, 11rem) clamp(1.25rem, 5vw, 4rem) clamp(4rem, 8vw, 7rem);
  background: var(--color-catalog-paper);
  color: var(--color-catalog-ink);
  font-family: var(--font-catalog-body);
}
.thanks-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-catalog-2xl);
  width: min(100%, 70rem);
  margin-inline: auto;
}
.thanks-message,
.purchase-summary {
  min-width: 0;
}
.thanks-message {
  align-self: center;
}
.thanks-status {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: var(--space-catalog-sm);
  color: var(--color-catalog-success);
  font-size: var(--text-catalog-sm);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.thanks-check {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: var(--radius-catalog-pill);
  background: var(--color-catalog-success);
  color: var(--color-catalog-action-ink);
}
.thanks-check svg {
  width: 20px;
  height: 20px;
}
h1,
h2,
h3 {
  margin: 0;
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-style: normal;
  overflow-wrap: anywhere;
}
h1 {
  max-width: 22ch;
  margin-top: var(--space-catalog-md);
  font-family: var(--font-catalog-body);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
}
.thanks-intro {
  max-width: 52ch;
  margin: var(--space-catalog-lg) 0 0;
  color: var(--color-catalog-muted);
  font-size: var(--text-catalog-md);
  line-height: 1.6;
}
.booking-reference {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-catalog-xs) var(--space-catalog-md);
  margin: var(--space-catalog-lg) 0 0;
  color: var(--color-catalog-muted);
}
.booking-reference dt {
  font-weight: 700;
}
.booking-reference dd {
  margin: 0;
  color: var(--color-catalog-ink);
  font-family: var(--font-catalog-body);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.thanks-back {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: var(--space-catalog-xs);
  margin-top: var(--space-catalog-xl);
  color: var(--color-catalog-action);
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.thanks-back svg {
  width: 18px;
  height: 18px;
  transition: transform var(--dur-catalog-interaction) var(--ease-catalog-out);
}
.purchase-summary {
  align-self: start;
  padding: clamp(1.5rem, 4vw, 3rem);
  border: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  border-radius: var(--radius-catalog-card);
  background: var(--color-catalog-surface);
}
.purchase-heading {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: var(--space-catalog-lg);
  align-items: center;
}
.purchase-heading img {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-catalog-card);
  object-fit: cover;
}
.purchase-heading h2 {
  font-size: var(--text-catalog-xl);
  line-height: 1.08;
}
.purchase-heading p {
  margin: var(--space-catalog-xs) 0 0;
  color: var(--color-catalog-muted);
}
.purchase-heading strong {
  display: block;
  margin-top: var(--space-catalog-sm);
  color: var(--color-catalog-display);
}
.next-steps {
  margin-top: var(--space-catalog-xl);
  padding-top: var(--space-catalog-xl);
  border-top: var(--rule-catalog-thin) solid var(--color-catalog-rule);
}
.next-steps h3 {
  font-size: var(--text-catalog-lg);
}
.next-steps p {
  max-width: 65ch;
  margin: var(--space-catalog-md) 0 0;
  line-height: 1.7;
  white-space: pre-line;
}
.thanks-back:focus-visible {
  outline: var(--rule-catalog-focus) solid var(--color-catalog-focus);
  outline-offset: 3px;
}
.thanks-back:active {
  color: var(--color-catalog-accent);
}
.thanks-state {
  width: min(100%, 42rem);
  margin-inline: auto;
}
@media (hover: hover) and (pointer: fine) {
  .thanks-back:hover svg {
    transform: translateX(-3px);
  }
}
@media (min-width: 52rem) {
  .thanks-shell {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    align-items: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .thanks-back svg {
    transition-duration: var(--dur-catalog-reduced);
  }
  .thanks-back:hover svg {
    transform: none;
  }
}
</style>
