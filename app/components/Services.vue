<script setup lang="ts">
import { ArrowRight, PackageOpen, RefreshCw } from 'lucide-vue-next'

type CatalogPrice = { amount: number; currency: string; taxBehavior: 'exclusive' | 'inclusive' | 'unspecified' }
type CatalogProduct = {
  id: string
  slug: string
  title: string
  subtitle: string
  summary: string
  thumbnailImage: string
  prices: CatalogPrice[]
  purchaseUrl: string
  categoryDetails?: { name?: string }
  isFree: boolean
}
type CatalogResponse = { items: CatalogProduct[] }

const currency = useCatalogCurrency()
const { data, status, error, refresh } = await useFetch<CatalogResponse>('/api/catalog/products', {
  query: { currency }
})
const products = computed(() =>
  [...(data.value?.items ?? [])].sort((left, right) => {
    const leftPrice = left.isFree ? 0 : (left.prices[0]?.amount ?? Number.POSITIVE_INFINITY)
    const rightPrice = right.isFree ? 0 : (right.prices[0]?.amount ?? Number.POSITIVE_INFINITY)
    return leftPrice - rightPrice
  })
)
const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation(0.2)
const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1)

const formatPrice = (product: CatalogProduct) => {
  if (product.isFree) {
    return 'Free'
  }
  const price = product.prices[0]
  if (!price) {
    return 'Price on request'
  }
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: price.amount % 100 === 0 ? 0 : 2
  }).format(price.amount / 100)
}

const priceNote = (product: CatalogProduct) => {
  const price = product.prices[0]
  if (!price || product.isFree) {
    return ''
  }
  if (price.taxBehavior === 'inclusive') {
    return 'Tax included'
  }
  if (price.taxBehavior === 'exclusive') {
    return 'Excluding tax'
  }
  return ''
}
</script>

<template>
  <section id="services" class="catalog-section">
    <div class="catalog-shell">
      <div
        ref="headerRef"
        :class="['catalog-heading', headerVisible ? 'catalog-heading--visible' : 'catalog-heading--hidden']"
      >
        <p class="catalog-heading__intro">Ways I support you</p>
        <h2>Choose your Greatest Love Adventure</h2>
        <p class="catalog-heading__copy">
          Every journey to self-love is unique. Explore the offering that feels right for where you are now.
        </p>
        <CatalogCurrencySelect />
      </div>

      <div v-if="status === 'pending'" class="catalog-grid" aria-label="Loading offerings" aria-busy="true">
        <article v-for="index in 2" :key="index" class="product-card product-card--loading">
          <div class="product-card__skeleton product-card__skeleton--image"></div>
          <div class="product-card__body">
            <div class="product-card__skeleton product-card__skeleton--short"></div>
            <div class="product-card__skeleton product-card__skeleton--title"></div>
            <div class="product-card__skeleton product-card__skeleton--copy"></div>
          </div>
        </article>
      </div>

      <div v-else-if="error" class="catalog-state" role="alert">
        <RefreshCw aria-hidden="true" />
        <h3>The offerings couldn’t be loaded</h3>
        <p>The catalog may be temporarily unavailable. Please try again in a moment.</p>
        <button type="button" class="catalog-state__button" @click="refresh">Try again</button>
      </div>

      <div v-else-if="products.length === 0" class="catalog-state">
        <PackageOpen aria-hidden="true" />
        <h3>New offerings are on their way</h3>
        <p>There are no available catalog items right now. Please check back soon.</p>
      </div>

      <div v-else ref="cardsRef" class="catalog-grid">
        <NuxtLink
          v-for="(product, index) in products"
          :key="product.id"
          :to="`/specials/${product.slug}`"
          class="product-card"
          :class="cardsVisible ? 'product-card--visible' : 'product-card--hidden'"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div class="product-card__heading">
            <div>
              <h3>{{ product.title }}</h3>
              <p v-if="product.subtitle" class="product-card__subtitle">{{ product.subtitle }}</p>
            </div>
            <div class="product-card__price">
              <strong>{{ formatPrice(product) }}</strong>
              <span v-if="priceNote(product)">{{ priceNote(product) }}</span>
            </div>
          </div>

          <div class="product-card__media">
            <img
              :src="product.thumbnailImage"
              :alt="`${product.title} offering`"
              width="400"
              height="400"
              loading="lazy"
            />
            <span v-if="product.categoryDetails?.name" class="product-card__category">
              {{ product.categoryDetails.name }}
            </span>
          </div>

          <div class="product-card__body">
            <p class="product-card__summary">{{ product.summary }}</p>
            <div class="product-card__footer">
              <span class="product-card__action">View offering <ArrowRight aria-hidden="true" /></span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · pre-emit critique: P4 H5 E4 S5 R5 V4 */
/* Hallmark · component: product-card · genre: soft · theme: inherited
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass
 */
.catalog-section {
  background: var(--color-catalog-paper);
  color: var(--color-catalog-ink);
  padding-block: clamp(2.5rem, 5vw, 4rem);
}
.catalog-shell {
  margin-inline: auto;
  max-width: 80rem;
  padding-inline: clamp(var(--space-catalog-md), 4vw, var(--space-catalog-xl));
}
.catalog-heading {
  margin-block-end: var(--space-catalog-lg);
  max-width: 47rem;
  transition:
    opacity var(--dur-catalog-reveal) var(--ease-catalog-out),
    transform var(--dur-catalog-reveal) var(--ease-catalog-out);
}
.catalog-heading--hidden {
  opacity: 0;
  transform: translateY(var(--space-catalog-md));
}
.catalog-heading--visible {
  opacity: 1;
  transform: translateY(0);
}
.catalog-heading__intro {
  color: var(--color-catalog-accent);
  font-family: var(--font-catalog-body);
  font-size: var(--text-catalog-base);
  font-weight: 700;
  margin-block-end: var(--space-catalog-xs);
}
.catalog-heading :deep(.currency-select) {
  margin-block-start: var(--space-catalog-lg);
}
.catalog-heading h2 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: clamp(var(--text-catalog-xl), 4vw, var(--text-catalog-2xl));
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  min-width: 0;
  overflow-wrap: anywhere;
}
.catalog-heading__copy {
  color: var(--color-catalog-muted);
  font-size: var(--text-catalog-base);
  line-height: 1.65;
  margin-block-start: var(--space-catalog-md);
  max-width: 62ch;
}
.catalog-grid {
  display: grid;
  gap: var(--space-catalog-lg);
  grid-template-columns: minmax(0, 1fr);
}
.product-card {
  background: var(--color-catalog-surface);
  border: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  border-radius: var(--radius-catalog-card);
  box-shadow: var(--shadow-catalog-card);
  color: var(--color-catalog-ink);
  display: flex;
  flex-direction: column;
  min-width: 0;
  outline: var(--rule-catalog-focus) solid transparent;
  outline-offset: var(--space-catalog-2xs);
  overflow: clip;
  text-align: start;
  text-decoration: none;
  transition:
    opacity var(--dur-catalog-reveal) var(--ease-catalog-out),
    transform var(--dur-catalog-interaction) var(--ease-catalog-out),
    box-shadow var(--dur-catalog-interaction) var(--ease-catalog-out);
}
.product-card--hidden {
  opacity: 0;
  transform: translateY(var(--space-catalog-md));
}
.product-card--visible {
  opacity: 1;
  transform: translateY(0);
}
.product-card:focus-visible,
.catalog-state__button:focus-visible {
  outline-color: var(--color-catalog-focus);
}
.product-card:active {
  transform: translateY(var(--space-catalog-2xs));
}
.product-card[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.55;
  pointer-events: none;
}
.product-card[data-state='error'] {
  border-color: var(--color-catalog-error);
}
.product-card[data-state='success'] {
  border-color: var(--color-catalog-success);
}
.product-card__media {
  aspect-ratio: 16 / 10;
  background: var(--color-catalog-soft);
  color: var(--color-catalog-ink);
  overflow: clip;
  position: relative;
}
.product-card__media img {
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-catalog-image) var(--ease-catalog-out);
  width: 100%;
}
.product-card__category {
  background: var(--color-catalog-surface);
  border-radius: var(--radius-catalog-pill);
  color: var(--color-catalog-accent);
  font-size: var(--text-catalog-sm);
  font-weight: 700;
  inset-block-start: var(--space-catalog-sm);
  inset-inline-start: var(--space-catalog-sm);
  line-height: 1;
  padding: var(--space-catalog-xs) var(--space-catalog-sm);
  position: absolute;
}
.product-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-catalog-md);
  padding: clamp(var(--space-catalog-md), 4vw, var(--space-catalog-lg));
}
.product-card__subtitle {
  color: var(--color-catalog-accent);
  font-size: var(--text-catalog-sm);
  font-weight: 700;
  letter-spacing: 0.01em;
  margin-block-start: var(--space-catalog-xs);
}
.product-card__heading {
  align-items: start;
  display: flex;
  gap: var(--space-catalog-md);
  justify-content: space-between;
  padding: clamp(var(--space-catalog-md), 4vw, var(--space-catalog-lg));
}
.product-card__heading > div:first-child {
  min-width: 0;
}
.product-card h3 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: var(--text-catalog-lg);
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.18;
  overflow-wrap: anywhere;
}
.product-card__summary {
  color: var(--color-catalog-muted);
  flex: 1;
  font-size: var(--text-catalog-base);
  line-height: 1.6;
}
.product-card__footer {
  align-items: end;
  border-block-start: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-catalog-md);
  justify-content: flex-end;
  padding-block-start: var(--space-catalog-md);
}
.product-card__price {
  display: grid;
  flex: 0 0 auto;
  gap: var(--space-catalog-2xs);
  justify-items: end;
  text-align: end;
}
.product-card__price strong {
  color: var(--color-catalog-ink);
  font-size: var(--text-catalog-md);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.product-card__price span {
  color: var(--color-catalog-muted);
  font-size: var(--text-catalog-sm);
}
.product-card__action {
  align-items: center;
  color: var(--color-catalog-action);
  display: inline-flex;
  font-weight: 700;
  gap: var(--space-catalog-xs);
  min-height: 2.75rem;
  white-space: nowrap;
}
.product-card__action svg {
  height: var(--space-catalog-md);
  transition: transform var(--dur-catalog-interaction) var(--ease-catalog-out);
  width: var(--space-catalog-md);
}
.product-card--loading {
  pointer-events: none;
}
.product-card__skeleton {
  animation: catalog-pulse 1.3s var(--ease-catalog-in-out) infinite alternate;
  background: var(--color-catalog-skeleton);
  border-radius: var(--radius-catalog-small);
}
.product-card__skeleton--image {
  aspect-ratio: 16 / 10;
  border-radius: 0;
}
.product-card__skeleton--short {
  height: var(--space-catalog-sm);
  width: 30%;
}
.product-card__skeleton--title {
  height: var(--space-catalog-lg);
  width: 66%;
}
.product-card__skeleton--copy {
  height: 5rem;
  width: 100%;
}
.catalog-state {
  align-items: center;
  background: var(--color-catalog-surface);
  border: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  border-radius: var(--radius-catalog-card);
  color: var(--color-catalog-ink);
  display: flex;
  flex-direction: column;
  margin-inline: auto;
  max-width: 38rem;
  padding: var(--space-catalog-xl);
  text-align: center;
}
.catalog-state > svg {
  color: var(--color-catalog-accent);
  height: var(--space-catalog-xl);
  margin-block-end: var(--space-catalog-md);
  width: var(--space-catalog-xl);
}
.catalog-state h3 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: var(--text-catalog-lg);
  font-style: normal;
  font-weight: 700;
}
.catalog-state p {
  color: var(--color-catalog-muted);
  line-height: 1.6;
  margin-block-start: var(--space-catalog-xs);
  max-width: 48ch;
}
.catalog-state__button {
  background: var(--color-catalog-action);
  border: 0;
  border-radius: var(--radius-catalog-pill);
  color: var(--color-catalog-action-ink);
  cursor: pointer;
  font-weight: 700;
  margin-block-start: var(--space-catalog-md);
  min-height: 2.75rem;
  outline: var(--rule-catalog-focus) solid transparent;
  outline-offset: var(--space-catalog-2xs);
  padding-inline: var(--space-catalog-lg);
  transition: transform var(--dur-catalog-interaction) var(--ease-catalog-out);
  white-space: nowrap;
}
.catalog-state__button:active {
  transform: translateY(var(--space-catalog-2xs));
}
@media (min-width: 45rem) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (hover: hover) and (pointer: fine) {
  .product-card:hover {
    box-shadow: var(--shadow-catalog-card-hover);
    transform: translateY(calc(var(--space-catalog-xs) * -1));
  }
  .product-card:hover .product-card__media img {
    transform: scale(1.025);
  }
  .product-card:hover .product-card__action svg {
    transform: translateX(var(--space-catalog-xs));
  }
  .catalog-state__button:hover {
    transform: translateY(calc(var(--space-catalog-2xs) * -1));
  }
}
@media (prefers-reduced-motion: reduce) {
  .catalog-heading,
  .product-card,
  .product-card__media img,
  .product-card__action svg,
  .catalog-state__button {
    transition-duration: var(--dur-catalog-reduced);
  }
  .product-card__skeleton {
    animation: none;
  }
}
@keyframes catalog-pulse {
  from {
    opacity: 0.55;
  }
  to {
    opacity: 1;
  }
}
</style>
