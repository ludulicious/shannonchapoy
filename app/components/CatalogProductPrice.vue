<script setup lang="ts">
import { formatCatalogAmount, hasCatalogDiscount, type CatalogPrice } from '~/utils/catalogPrice'

const props = defineProps<{ prices: CatalogPrice[]; isFree: boolean }>()
const price = computed(() => props.prices[0])
const discounted = computed(() => hasCatalogDiscount(price.value))
const formattedPrice = computed(() => {
  if (props.isFree) {
    return 'Free'
  }
  return price.value ? formatCatalogAmount(price.value.amount, price.value.currency) : 'Price on request'
})
const taxNote = computed(() => {
  if (!price.value || props.isFree) {
    return ''
  }
  if (price.value.taxBehavior === 'inclusive') {
    return 'Tax included'
  }
  if (price.value.taxBehavior === 'exclusive') {
    return 'Excluding tax'
  }
  return ''
})
</script>

<template>
  <div class="offering-price">
    <span v-if="discounted && price" class="offering-price__original">
      From <del>{{ formatCatalogAmount(price.originalAmount!, price.currency) }}</del>
    </span>
    <strong><span v-if="discounted" class="offering-price__label">For </span>{{ formattedPrice }}</strong>
    <span v-if="taxNote" class="offering-price__tax">{{ taxNote }}</span>
  </div>
</template>

<style scoped>
.offering-price {
  display: grid;
  gap: 0.25rem;
  font-variant-numeric: tabular-nums;
}
.offering-price strong {
  color: var(--color-catalog-display);
  font-size: inherit;
  line-height: 1.2;
}
.offering-price__original,
.offering-price__tax,
.offering-price__label {
  color: var(--color-catalog-muted);
  font-size: 0.875rem;
  font-weight: 400;
}
</style>
