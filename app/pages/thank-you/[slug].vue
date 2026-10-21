<script setup lang="ts">
import { ArrowLeft, Check, Download } from 'lucide-vue-next'

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

const route = useRoute()
const locale = route.query.locale === 'nl' ? 'nl' : 'en'
const requestedCurrency = typeof route.query.currency === 'string' ? route.query.currency.toUpperCase() : 'EUR'
const currency = requestedCurrency === 'USD' ? 'USD' : 'EUR'
const reference =
  typeof route.query.reference === 'string' && /^BK-[A-F0-9]{12}$/.test(route.query.reference)
    ? route.query.reference
    : ''
const { data: product, error } = await useFetch<CatalogProduct>(
  () => `/api/catalog/products/${encodeURIComponent(String(route.params.slug))}`,
  { query: { locale, currency } }
)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: 'Purchase not found' })
}

type PurchaseResponse = {
  status: string
  variant?: 'free' | 'paid'
  files: Array<{ id: string; name: string; url: string }>
}
const purchaseToken = typeof route.query.purchase === 'string' ? route.query.purchase : ''
const {
  data: purchase,
  status: purchaseStatus,
  error: purchaseError,
  refresh: refreshPurchase
} = await useFetch<PurchaseResponse>('/api/catalog/purchase', {
  query: { purchase: purchaseToken },
  server: false,
  immediate: !!purchaseToken,
  watch: false
})
const orderPending = computed(() => purchase.value?.status === 'pending')
const orderConfirmed = computed(() => !purchaseToken || ['paid', 'accepted'].includes(purchase.value?.status ?? ''))
const orderReceived = computed(() => orderConfirmed.value || orderPending.value)
let pollTimer: ReturnType<typeof setTimeout> | undefined
let pollCount = 0
watch([purchase, purchaseStatus], () => {
  clearTimeout(pollTimer)
  if (import.meta.client && orderPending.value && purchaseStatus.value === 'success' && pollCount < 12) {
    pollTimer = setTimeout(() => {
      pollCount++
      void refreshPurchase()
    }, 5000)
  }
})
onBeforeUnmount(() => clearTimeout(pollTimer))

const copy = {
  en: {
    status: 'Order received',
    checking: 'Checking your order',
    pending: 'Your order has been received. We’ll email you with confirmation and any next steps.',
    pendingDownloads: 'Your downloads will appear here once your order is confirmed.',
    unconfirmed: 'We could not confirm your purchase. Please check your confirmation email or try again.',
    downloads: 'Download your files',
    downloadError: 'Your downloads could not be loaded. Please try again or use the links in your confirmation email.',
    loadingDownloads: 'Loading your downloads…',
    noDownloads: 'There are no downloadable files available for this purchase.',
    retry: 'Check again',
    title: 'Thank you for your order',
    intro: 'Your order is confirmed. Here is what happens next.',
    invoice: 'Your order is confirmed. An invoice will follow separately.',
    reference: 'Booking reference',
    next: 'Your next steps',
    empty: 'Your order is confirmed. We’ll contact you with the next steps.',
    back: 'Back to offerings',
    home: 'Return to Shannon Chapoy'
  },
  nl: {
    status: 'Bestelling ontvangen',
    checking: 'Je bestelling wordt gecontroleerd',
    pending: 'Je bestelling is ontvangen. Je ontvangt een e-mail met de bevestiging en eventuele volgende stappen.',
    pendingDownloads: 'Je downloads verschijnen hier zodra je bestelling is bevestigd.',
    unconfirmed: 'We konden je aankoop niet bevestigen. Controleer je bevestigingsmail of probeer het opnieuw.',
    downloads: 'Download je bestanden',
    downloadError:
      'Je downloads konden niet worden geladen. Probeer het opnieuw of gebruik de links in je bevestigingsmail.',
    loadingDownloads: 'Je downloads worden geladen…',
    noDownloads: 'Er zijn geen downloadbare bestanden beschikbaar voor deze aankoop.',
    retry: 'Opnieuw controleren',
    title: 'Bedankt voor je bestelling',
    intro: 'Je bestelling is bevestigd. Hieronder lees je wat er nu gebeurt.',
    invoice: 'Je bestelling is bevestigd. Je ontvangt de factuur later apart.',
    reference: 'Boekingsnummer',
    next: 'Je volgende stappen',
    empty: 'Je bestelling is bevestigd. We nemen contact met je op over de volgende stappen.',
    back: 'Terug naar het aanbodoverzicht',
    home: 'Terug naar Shannon Chapoy'
  }
}[locale]

const contentVariant = computed(() => purchase.value?.variant || (product.value?.isFree ? 'free' : 'paid'))
const { data: editableCopy } = await useFetch('/api/thank-you/content', {
  query: { slug: String(route.params.slug), locale, variant: contentVariant }
})

const formattedPrice = computed(() => {
  if (product.value?.isFree) {
    return locale === 'nl' ? 'Gratis' : 'Free'
  }
  const price = product.value?.prices[0]
  return price
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: price.currency }).format(price.amount / 100)
    : ''
})

useSeoMeta({ title: `${copy.title} - Shannon Chapoy`, robots: 'noindex, nofollow', referrer: 'no-referrer' })
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
          <span v-if="orderReceived" class="thanks-check"><Check aria-hidden="true" /></span>
          <span>{{ orderReceived ? editableCopy?.statusLabel || copy.status : copy.checking }}</span>
        </div>
        <h1 id="thanks-title">{{ orderReceived ? editableCopy?.heading || copy.title : copy.checking }}</h1>
        <p class="thanks-intro">
          {{
            orderConfirmed
              ? editableCopy?.message || copy.intro
              : orderPending || purchaseStatus === 'pending' || purchaseStatus === 'idle'
                ? copy.pending
                : copy.unconfirmed
          }}
        </p>
        <p v-if="orderConfirmed && purchase?.status === 'accepted'" class="thanks-intro">{{ copy.invoice }}</p>
        <p v-if="orderConfirmed && editableCopy?.helpText" class="thanks-intro">{{ editableCopy.helpText }}</p>
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
        <div class="purchase-heading" :class="{ 'purchase-heading--without-image': !product.thumbnailImage }">
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
        <section v-if="purchaseToken" class="purchase-downloads" aria-labelledby="downloads-title" aria-live="polite">
          <h3 id="downloads-title">{{ editableCopy?.downloadsHeading || copy.downloads }}</h3>
          <p v-if="purchaseError" role="alert">{{ copy.downloadError }}</p>
          <ul v-else-if="purchase?.files.length" class="download-list">
            <li v-for="file in purchase.files" :key="file.id">
              <a :href="file.url" class="download-link" referrerpolicy="no-referrer" rel="noreferrer">
                <Download aria-hidden="true" />
                {{ file.name }}
              </a>
            </li>
          </ul>
          <p v-else-if="orderPending">{{ copy.pendingDownloads }}</p>
          <p v-else-if="purchaseStatus === 'pending' || purchaseStatus === 'idle'">{{ copy.loadingDownloads }}</p>
          <p v-else>{{ orderConfirmed ? copy.noDownloads : copy.unconfirmed }}</p>
          <button
            v-if="purchaseError || orderPending || (purchase && !orderConfirmed)"
            type="button"
            class="download-retry"
            :disabled="purchaseStatus === 'pending'"
            @click="refreshPurchase()"
          >
            {{ copy.retry }}
          </button>
        </section>
        <div v-if="orderConfirmed" class="next-steps">
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
.purchase-heading--without-image {
  grid-template-columns: minmax(0, 1fr);
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
.next-steps,
.purchase-downloads {
  margin-top: var(--space-catalog-xl);
  padding-top: var(--space-catalog-xl);
  border-top: var(--rule-catalog-thin) solid var(--color-catalog-rule);
}
.next-steps h3,
.purchase-downloads h3 {
  font-size: var(--text-catalog-lg);
}
.next-steps p,
.purchase-downloads p {
  max-width: 65ch;
  margin: var(--space-catalog-md) 0 0;
  line-height: 1.7;
  white-space: pre-line;
  white-space: pre-line;
}
.download-list {
  display: grid;
  gap: var(--space-catalog-sm);
  list-style: none;
  margin: var(--space-catalog-md) 0 0;
  padding: 0;
}
.download-link {
  display: flex;
  align-items: center;
  gap: var(--space-catalog-sm);
  min-height: 44px;
  color: var(--color-catalog-action);
  font-weight: 700;
  overflow-wrap: anywhere;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.download-link svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.download-retry {
  margin-top: var(--space-catalog-md);
  padding: var(--space-catalog-sm) var(--space-catalog-md);
  border: 1px solid var(--color-catalog-action);
  border-radius: var(--radius-catalog-small);
  color: var(--color-catalog-action);
  cursor: pointer;
}
.download-retry:disabled {
  opacity: 0.6;
  cursor: wait;
}
.download-link:focus-visible,
.download-retry:focus-visible,
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
