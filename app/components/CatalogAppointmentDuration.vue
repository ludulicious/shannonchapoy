<script setup lang="ts">
import { Clock } from 'lucide-vue-next'

const props = defineProps<{
  product: { type?: string; planningEnabled?: boolean; durationMinutes?: number | null }
}>()
const duration = computed(() => {
  const minutes = props.product.durationMinutes
  return props.product.type === 'service' &&
    props.product.planningEnabled &&
    typeof minutes === 'number' &&
    Number.isFinite(minutes) &&
    minutes > 0
    ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
    : ''
})
</script>

<template>
  <p v-if="duration" class="appointment-duration">
    <Clock aria-hidden="true" />
    <span>{{ duration }}</span>
  </p>
</template>

<style scoped>
.appointment-duration {
  align-items: center;
  color: var(--color-catalog-primary, #513078);
  display: flex;
  font-size: 1.125rem;
  font-weight: 600;
  gap: var(--space-catalog-xs);
  margin-block-start: var(--space-catalog-sm);
}
.appointment-duration svg {
  flex-shrink: 0;
  height: 1.25rem;
  width: 1.25rem;
}
</style>
