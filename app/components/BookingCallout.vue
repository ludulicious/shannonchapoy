<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { catalogOfferDeadline } from '~/utils/catalogOffer'
import { catalogActionLabel, type CatalogProduct } from '~/utils/catalogProduct'

defineProps<{ product: CatalogProduct; offerDeadline?: ReturnType<typeof catalogOfferDeadline> }>()
const checkoutUrl = useCatalogCheckout()
</script>

<template>
  <section class="booking-callout" aria-labelledby="booking-title">
    <div class="booking-callout__inner">
      <div>
        <h2 id="booking-title">Make space for yourself.</h2>
        <p>
          Begin with {{ product.title }}<template v-if="product.subtitle"> — {{ product.subtitle }}</template
          >.
        </p>
      </div>
      <div class="booking-callout__action">
        <CatalogProductPrice :prices="product.prices" :is-free="product.isFree" />
        <CatalogAppointmentDuration :product="product" />
        <NuxtLink
          :to="checkoutUrl(product) || `/specials/${product.slug}`"
          :external="!!checkoutUrl(product)"
          class="conversion-button"
        >
          {{ checkoutUrl(product) ? catalogActionLabel(product) : 'View offering' }} <ArrowRight aria-hidden="true" />
        </NuxtLink>
        <CatalogOfferBadge v-if="offerDeadline" :deadline="offerDeadline" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.booking-callout {
  background: var(--color-catalog-soft);
  border-block: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  padding: var(--space-catalog-2xl) var(--space-catalog-lg);
}
.booking-callout__inner {
  max-width: 70rem;
  margin-inline: auto;
  display: grid;
  gap: var(--space-catalog-xl);
  align-items: center;
}
.booking-callout h2 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  font-weight: 700;
  overflow-wrap: anywhere;
}
.booking-callout p {
  color: var(--color-catalog-muted);
  margin-block-start: var(--space-catalog-md);
  line-height: 1.65;
}
.booking-callout__action {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-catalog-md);
}
.booking-callout__action > :deep(.offering-price) {
  font-size: var(--text-catalog-lg);
}
@media (min-width: 60rem) {
  .booking-callout__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
    gap: var(--space-catalog-2xl);
  }
}
</style>
