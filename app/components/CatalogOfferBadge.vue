<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import type { catalogOfferDeadline } from '~/utils/catalogOffer'

defineProps<{ deadline: NonNullable<ReturnType<typeof catalogOfferDeadline>> }>()
</script>

<template>
  <div class="offer-badge" :title="`Offer ends ${deadline.exactTime}`">
    <Clock3 aria-hidden="true" />
    <div class="offer-badge__copy">
      <strong>{{ deadline.label }}</strong>
      <span
        >Offer ends <time :datetime="deadline.endsAt">{{ deadline.date }}</time></span
      >
    </div>
  </div>
</template>

<style scoped>
/* Hallmark · component: offer badge · genre: editorial · theme: existing catalog
 * pre-emit critique: P4 H5 E5 S4 R5 V4 · informational, no interactive states
 */
.offer-badge {
  align-items: center;
  background: color-mix(in srgb, var(--color-catalog-accent) 8%, var(--color-catalog-surface));
  border-radius: var(--radius-catalog-card);
  color: color-mix(in srgb, var(--color-catalog-accent) 75%, var(--color-catalog-ink));
  display: flex;
  font-family: var(--font-catalog-body);
  font-size: var(--text-catalog-sm);
  gap: var(--space-catalog-sm);
  line-height: 1.4;
  padding: var(--space-catalog-sm);
}
.offer-badge svg {
  flex: 0 0 auto;
  height: 1rem;
  width: 1rem;
}
.offer-badge__copy {
  display: grid;
  gap: var(--space-catalog-2xs);
  min-width: 0;
}
.offer-badge strong {
  font-weight: 700;
}
.offer-badge span {
  color: var(--color-catalog-muted);
  font-size: 0.75rem;
}
</style>
