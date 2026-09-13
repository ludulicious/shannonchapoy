<script setup lang="ts">
import { ArrowLeft, ShoppingBag } from 'lucide-vue-next'

type CatalogPrice = { amount: number; currency: string; taxBehavior: 'exclusive' | 'inclusive' | 'unspecified' }
type CatalogProduct = {
  type: 'digital' | 'service'
  planningEnabled?: boolean
  durationMinutes?: number | null
  id: string
  slug: string
  title: string
  subtitle?: string
  buyButtonLabel?: string
  secondaryCta?: string
  summary: string
  descriptionHtml: string
  thumbnailImage: string | null
  purchaseUrl: string
  prices: CatalogPrice[]
  isFree: boolean
  categoryDetails?: { name?: string }
  markdownStyle?: {
    fontFamily?: 'system' | 'sans' | 'serif'
    fontSize?: number
    lineHeight?: number
    paragraphSpacing?: number
    headingScale?: number
    bulletStyle?: 'disc' | 'circle' | 'square' | 'dash' | 'check' | 'sparkle'
    bulletColor?: string
    textColor?: string
    headingColor?: string
    h1Color?: string
    h2Color?: string
    h3Color?: string
    h4Color?: string
    h5Color?: string
    h6Color?: string
    linkColor?: string
    backgroundColor?: string
  }
}
type CatalogResponse = { items: CatalogProduct[] }

const route = useRoute()
const requestUrl = useRequestURL()
const currency = useCatalogCurrency()
const { data, error } = await useFetch<CatalogResponse>('/api/catalog/products', { query: { currency } })
const product = computed(() => data.value?.items.find((item) => item.slug === route.params.slug))
const checkoutUrl = computed(() => {
  if (!product.value) {
    return ''
  }
  const url = new URL(product.value.purchaseUrl)
  url.searchParams.set('locale', 'en')
  url.searchParams.set('currency', currency.value)
  url.searchParams.set('returnUrl', new URL(route.fullPath, requestUrl.origin).toString())
  return url.toString()
})

if (!error.value && data.value && !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Offering not found' })
}

const formattedPrice = computed(() => {
  if (!product.value) {
    return ''
  }
  if (product.value.isFree) {
    return 'Free'
  }
  const price = product.value.prices[0]
  if (!price) {
    return 'Price on request'
  }
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: price.amount % 100 === 0 ? 0 : 2
  }).format(price.amount / 100)
})

const taxNote = computed(() => {
  const price = product.value?.prices[0]
  if (!price || product.value?.isFree) {
    return ''
  }
  if (price.taxBehavior === 'inclusive') {
    return 'Tax included'
  }
  if (price.taxBehavior === 'exclusive') {
    return 'Excluding tax'
  }
  return ''
})

const descriptionStyle = computed(() => {
  const bullets = { disc: '•', circle: '◦', square: '▪', dash: '–', check: '✓', sparkle: '✦' }
  const markdownStyle = product.value?.markdownStyle
  const bullet = bullets[markdownStyle?.bulletStyle ?? 'disc']
  const fonts = {
    system: 'system-ui, sans-serif',
    sans: 'Arial, Helvetica, sans-serif',
    serif: 'Georgia, Times New Roman, serif'
  }
  const headingColor = markdownStyle?.headingColor || 'var(--color-catalog-display)'
  return {
    '--product-content-bullet': `"${bullet}  "`,
    '--product-content-bullet-color': markdownStyle?.bulletColor || 'inherit',
    '--product-content-font': fonts[markdownStyle?.fontFamily ?? 'system'],
    '--product-content-size': `${markdownStyle?.fontSize ?? 16}px`,
    '--product-content-leading': String(markdownStyle?.lineHeight ?? 1.7),
    '--product-content-gap': `${markdownStyle?.paragraphSpacing ?? 1}em`,
    '--product-content-scale': String(markdownStyle?.headingScale ?? 1.25),
    '--product-content-text': markdownStyle?.textColor || 'var(--color-catalog-ink)',
    '--product-content-heading': headingColor,
    '--product-content-h1': markdownStyle?.h1Color || headingColor,
    '--product-content-h2': markdownStyle?.h2Color || headingColor,
    '--product-content-h3': markdownStyle?.h3Color || headingColor,
    '--product-content-h4': markdownStyle?.h4Color || headingColor,
    '--product-content-h5': markdownStyle?.h5Color || headingColor,
    '--product-content-h6': markdownStyle?.h6Color || headingColor,
    '--product-content-link': markdownStyle?.linkColor || 'var(--color-catalog-accent)',
    backgroundColor: markdownStyle?.backgroundColor || undefined
  }
})
watchEffect(() => {
  if (product.value) {
    useSeoMeta({
      title: `${product.value.title} - Shannon Chapoy`,
      description: product.value.summary
    })
  }
})
</script>

<template>
  <main class="special-page">
    <div class="special-shell">
      <div class="special-toolbar">
        <NuxtLink to="/offerings" class="special-back">
          <ArrowLeft aria-hidden="true" />
          All offerings
        </NuxtLink>
        <CatalogCurrencySelect />
      </div>

      <div v-if="error" class="special-state" role="alert">
        <h1>This offering is unavailable</h1>
        <p>Please return to the offerings and try again in a moment.</p>
      </div>

      <article v-else-if="product" class="special-card">
        <div class="special-image">
          <img
            v-if="product.thumbnailImage"
            :src="product.thumbnailImage"
            :alt="`${product.title} offering`"
            width="400"
            height="400"
          />
        </div>

        <div class="special-content">
          <p v-if="product.categoryDetails?.name" class="special-eyebrow">{{ product.categoryDetails.name }}</p>
          <p v-if="product.subtitle" class="special-subtitle">{{ product.subtitle }}</p>
          <h1>{{ product.title }}</h1>
          <CatalogAppointmentDuration :product="product" />
          <p class="special-summary">{{ product.summary }}</p>

          <div class="special-price">
            <strong>{{ formattedPrice }}</strong>
            <span v-if="taxNote">{{ taxNote }}</span>
          </div>

          <NuxtLink :to="checkoutUrl" external class="special-buy">
            <ShoppingBag aria-hidden="true" />
            {{ product.buyButtonLabel || 'Buy now' }}
          </NuxtLink>
        </div>

        <section v-if="product.descriptionHtml" class="special-description">
          <p class="special-description__label">About this offering</p>
          <!-- HTML comes from the portal's allowlisted Markdown renderer. -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="special-description__body" :style="descriptionStyle" v-html="product.descriptionHtml"></div>
          <div v-if="product.secondaryCta" class="special-bottom-cta">
            <p>{{ product.secondaryCta }}</p>
            <div class="special-bottom-price">
              <strong>{{ formattedPrice }}</strong>
              <span v-if="taxNote">{{ taxNote }}</span>
            </div>
            <NuxtLink :to="checkoutUrl" external class="special-buy">
              <ShoppingBag aria-hidden="true" />
              {{ product.buyButtonLabel || 'Buy now' }}
            </NuxtLink>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style scoped>
.special-page {
  background: var(--color-catalog-paper);
  color: var(--color-catalog-ink);
  min-height: 100vh;
  padding: clamp(8rem, 15vw, 11rem) clamp(1.25rem, 5vw, 4rem) clamp(4rem, 8vw, 7rem);
}
.special-shell {
  margin-inline: auto;
  max-width: 72rem;
}
.special-back {
  align-items: center;
  color: var(--color-catalog-accent);
  display: inline-flex;
  font-weight: 700;
  gap: 0.5rem;
  text-decoration: none;
}
.special-toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-block-end: 2rem;
}
.special-back svg,
.special-buy svg {
  height: 1.1rem;
  width: 1.1rem;
}
.special-card {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-catalog-accent) 15%, transparent);
  border-radius: 2rem;
  box-shadow: 0 1.5rem 4rem rgb(63 43 61 / 10%);
  display: grid;
  grid-template-columns: minmax(16rem, 0.8fr) minmax(18rem, 1.2fr);
  overflow: hidden;
}
.special-image {
  background: var(--color-catalog-soft);
  min-height: 100%;
}
.special-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}
.special-content {
  align-self: center;
  padding: clamp(2rem, 5vw, 4.5rem);
}
.special-eyebrow,
.special-description__label {
  color: var(--color-catalog-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.special-subtitle {
  color: var(--color-catalog-muted);
  font-weight: 600;
  margin-block: 0.75rem 0.25rem;
}
.special-content h1 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  letter-spacing: -0.035em;
  line-height: 1;
  margin: 0;
}
.special-summary {
  color: var(--color-catalog-muted);
  font-size: 1.08rem;
  line-height: 1.7;
  margin-block: 1.5rem;
}
.special-price {
  align-items: baseline;
  display: flex;
  gap: 0.75rem;
  margin-block-end: 1.5rem;
}
.special-price strong {
  color: var(--color-catalog-display);
  font-size: 1.6rem;
}
.special-price span {
  color: var(--color-catalog-muted);
  font-size: 0.85rem;
}
.special-buy {
  align-items: center;
  background: var(--color-catalog-accent);
  border: 0;
  border-radius: 999px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 0.65rem;
  padding: 0.95rem 1.6rem;
  text-decoration: none;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}
.special-buy:hover {
  box-shadow: 0 0.8rem 1.8rem color-mix(in srgb, var(--color-catalog-accent) 25%, transparent);
  transform: translateY(-2px);
}
.special-buy:focus-visible,
.special-back:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-catalog-accent) 45%, transparent);
  outline-offset: 4px;
}
.special-description {
  border-top: 1px solid color-mix(in srgb, var(--color-catalog-accent) 14%, transparent);
  grid-column: 1 / -1;
  padding: clamp(2rem, 5vw, 4.5rem);
}
.special-description__label {
  margin-block-end: 1.5rem;
}
.special-description__body {
  color: var(--product-content-text);
  font-family: var(--product-content-font);
  font-size: var(--product-content-size);
  line-height: var(--product-content-leading);
  max-width: 48rem;
  overflow-wrap: anywhere;
}
.special-description__body :deep(p),
.special-description__body :deep(ul),
.special-description__body :deep(ol),
.special-description__body :deep(pre) {
  margin-block: 0 var(--product-content-gap);
}
.special-description__body :deep(h1),
.special-description__body :deep(h2),
.special-description__body :deep(h3),
.special-description__body :deep(h4),
.special-description__body :deep(h5),
.special-description__body :deep(h6) {
  color: var(--product-content-heading);
  font-family: inherit;
  font-weight: 700;
  line-height: 1.3;
  margin: 1.5em 0 0.6em;
}
.special-description__body :deep(h1) {
  color: var(--product-content-h1);
  font-size: calc(1.8em * var(--product-content-scale));
}
.special-description__body :deep(h2) {
  color: var(--product-content-h2);
  font-size: calc(1.5em * var(--product-content-scale));
}
.special-description__body :deep(h3) {
  color: var(--product-content-h3);
  font-size: calc(1.2em * var(--product-content-scale));
}
.special-description__body :deep(h4) {
  color: var(--product-content-h4);
}
.special-description__body :deep(h5) {
  color: var(--product-content-h5);
}
.special-description__body :deep(h6) {
  color: var(--product-content-h6);
}
.special-description__body :deep(h4),
.special-description__body :deep(h5),
.special-description__body :deep(h6) {
  font-size: calc(1em * var(--product-content-scale));
}
.special-description__body :deep(ul),
.special-description__body :deep(ol) {
  padding-inline-start: 1.4rem;
}
.special-description__body :deep(ul) {
  list-style: disc;
}
.special-description__body :deep(ul > li::marker) {
  color: var(--product-content-bullet-color);
  content: var(--product-content-bullet);
  font-family: system-ui, sans-serif;
}
.special-description__body :deep(ol) {
  list-style: decimal;
}
.special-description__body :deep(li) {
  margin-block: 0.3em;
}
.special-description__body :deep(li > ul),
.special-description__body :deep(li > ol) {
  margin-block-end: 0;
}
.special-description__body :deep(blockquote) {
  background: color-mix(in srgb, var(--color-catalog-accent) 7%, white);
  border-inline-start: 4px solid var(--color-catalog-accent);
  border-radius: 0 var(--radius-catalog-small) var(--radius-catalog-small) 0;
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: 1.12em;
  font-style: italic;
  line-height: 1.7;
  margin-block: 1.5rem;
  padding: 1.25rem 1.5rem;
}
.special-description__body :deep(blockquote > :last-child) {
  margin-block-end: 0;
}
.special-description__body :deep(a) {
  color: var(--product-content-link);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.special-bottom-cta {
  align-items: center;
  border-block-start: 1px solid color-mix(in srgb, var(--color-catalog-accent) 18%, transparent);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin-block-start: 2.5rem;
  padding-block-start: 2rem;
}
.special-bottom-cta > p:first-child {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: 1.35rem;
  font-weight: 700;
  margin-inline-end: auto;
}
.special-bottom-price {
  display: grid;
  gap: 0.2rem;
  text-align: end;
}
.special-bottom-price strong {
  color: var(--color-catalog-display);
  font-size: 1.35rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.special-bottom-price span {
  color: var(--color-catalog-muted);
  font-size: 0.78rem;
}
.special-state {
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
}
@media (max-width: 720px) {
  .special-card {
    grid-template-columns: 1fr;
  }
  .special-image {
    aspect-ratio: 16 / 10;
  }
}
</style>
