<script setup lang="ts">
const currency = useCatalogCurrency()
</script>

<template>
  <label class="currency-select">
    <span>Currency</span>
    <select v-model="currency" aria-label="Currency">
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
    </select>
  </label>
</template>

<style scoped>
.currency-select {
  align-items: center;
  color: var(--color-catalog-muted);
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 700;
  gap: 0.65rem;
}
.currency-select select {
  appearance: none;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b5068' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
    no-repeat right 0.8rem center;
  border: 1px solid color-mix(in srgb, var(--color-catalog-accent) 25%, transparent);
  border-radius: 999px;
  color: var(--color-catalog-display);
  cursor: pointer;
  font: inherit;
  min-width: 5.4rem;
  padding: 0.55rem 2rem 0.55rem 0.9rem;
}
.currency-select select:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-catalog-accent) 35%, transparent);
  outline-offset: 2px;
}
</style>
