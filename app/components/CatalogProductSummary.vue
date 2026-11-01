<script setup lang="ts">
defineProps<{ summary: string; summaryHtml?: string }>()
</script>

<template>
  <!-- HTML comes from the portal's allowlisted Markdown renderer, like product descriptions. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-if="summaryHtml" class="catalog-summary" v-html="summaryHtml"></div>
  <p v-else class="catalog-summary">{{ summary }}</p>
</template>

<style scoped>
.catalog-summary {
  overflow-wrap: anywhere;
}
.catalog-summary :deep(> :first-child) {
  margin-block-start: 0;
}
.catalog-summary :deep(> :last-child) {
  margin-block-end: 0;
}
.catalog-summary :deep(p),
.catalog-summary :deep(ul),
.catalog-summary :deep(ol),
.catalog-summary :deep(blockquote),
.catalog-summary :deep(pre) {
  margin-block: 0.75em;
}
.catalog-summary :deep(ul),
.catalog-summary :deep(ol) {
  padding-inline-start: 1.5em;
}
.catalog-summary :deep(ul) {
  list-style-type: disc;
}
.catalog-summary :deep(ol) {
  list-style-type: decimal;
}
.catalog-summary :deep(a) {
  color: var(--color-catalog-action);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.catalog-summary :deep(blockquote) {
  border-inline-start: var(--rule-catalog-thin) solid var(--color-catalog-rule);
  padding-inline-start: 1em;
}
.catalog-summary :deep(pre) {
  overflow-x: auto;
}
</style>
