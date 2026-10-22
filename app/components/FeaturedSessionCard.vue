<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { catalogOfferDeadline } from '~/utils/catalogOffer'
import { catalogActionLabel, type CatalogProduct } from '~/utils/catalogProduct'

const props = defineProps<{ product: CatalogProduct; offerDeadline?: ReturnType<typeof catalogOfferDeadline> }>()
const checkoutUrl = useCatalogCheckout()
const bookingUrl = computed(() => checkoutUrl(props.product))
</script>

<template>
  <article class="featured-session" aria-labelledby="featured-session-heading">
    <header class="featured-session__header">
      <h2 id="featured-session-heading">Featured session</h2>
      <CatalogAppointmentDuration :product="product" />
    </header>
    <div class="featured-session__body">
      <div class="featured-session__intro">
        <img
          v-if="product.thumbnailImage"
          class="featured-session__thumbnail"
          :src="product.thumbnailImage"
          :alt="`${product.title} offering`"
          width="80"
          height="80"
        />
        <div class="featured-session__title">
          <h3>{{ product.title }}</h3>
          <p v-if="product.subtitle" class="featured-session__subtitle">{{ product.subtitle }}</p>
        </div>
      </div>
      <div class="featured-session__footer">
        <CatalogProductPrice class="featured-session__price" :prices="product.prices" :is-free="product.isFree" />
        <div class="featured-session__actions">
          <NuxtLink v-if="bookingUrl" :to="bookingUrl" external class="conversion-button">
            {{ catalogActionLabel(product) }} <ArrowRight aria-hidden="true" />
          </NuxtLink>
          <NuxtLink
            :to="`/specials/${product.slug}`"
            :class="bookingUrl ? 'conversion-text-link' : 'conversion-button'"
            :aria-label="`More details about ${product.title}`"
            >More details</NuxtLink
          >
        </div>
      </div>
      <p class="featured-session__summary">{{ product.summary }}</p>
      <CatalogOfferBadge v-if="offerDeadline" :deadline="offerDeadline" />
    </div>
  </article>
</template>

<style scoped>
/* Hallmark · component: featured session · theme: inherited
 * pre-emit critique: P4 H5 E5 S5 R5 V4 · one card, thumbnail, offer terms, booking and details */
.featured-session {
  max-width: 44rem;
  min-width: 0;
  background: var(--color-catalog-surface);
  border: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  border-radius: var(--radius-catalog-card);
  box-shadow: var(--shadow-catalog-card);
  overflow: clip;
}
.featured-session__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-catalog-xs);
  background: var(--color-catalog-soft);
  padding: var(--space-catalog-xs) var(--space-catalog-md);
  border-bottom: var(--rule-catalog-thin) solid var(--color-catalog-rule);
}
.featured-session__header h2 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-body);
  font-size: var(--text-catalog-sm);
  font-weight: 700;
}
.featured-session__header :deep(.appointment-duration) {
  margin: 0;
  font-size: var(--text-catalog-sm);
}
.featured-session__header :deep(.appointment-duration svg) {
  width: var(--space-catalog-md);
  height: var(--space-catalog-md);
}
.featured-session__body {
  display: grid;
  gap: var(--space-catalog-sm);
  padding: var(--space-catalog-md);
}
.featured-session__intro {
  display: flex;
  align-items: center;
  gap: var(--space-catalog-md);
}
.featured-session__thumbnail {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  flex: none;
  border-radius: var(--radius-catalog-small);
}
.featured-session__title {
  min-width: 0;
}
.featured-session h3 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: var(--text-catalog-lg);
  font-weight: 700;
  font-style: normal;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.featured-session__subtitle {
  margin-top: var(--space-catalog-2xs);
  color: var(--color-catalog-accent);
  font-size: var(--text-catalog-sm);
  font-weight: 700;
}
.featured-session__summary {
  color: var(--color-catalog-muted);
  font-size: var(--text-catalog-sm);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.featured-session__footer {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--space-catalog-sm);
}
.featured-session__price {
  font-size: var(--text-catalog-md);
}
.featured-session__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-catalog-xs) var(--space-catalog-md);
}
.featured-session__actions .conversion-button {
  min-height: 2.75rem;
  padding: var(--space-catalog-xs) var(--space-catalog-sm);
  gap: var(--space-catalog-xs);
  font-size: var(--text-catalog-sm);
}
.featured-session__actions .conversion-text-link {
  font-size: var(--text-catalog-sm);
}
@media (max-width: 30rem) {
  .featured-session__header,
  .featured-session__body {
    padding-inline: var(--space-catalog-md);
  }
  .featured-session__intro {
    gap: var(--space-catalog-sm);
  }
  .featured-session__thumbnail {
    width: 4rem;
    height: 5rem;
  }
}
</style>
