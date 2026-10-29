<script setup lang="ts">
const route = useRoute()
const fullStory = computed(() => route.path === '/about')
</script>

<template>
  <article v-if="fullStory" class="prose prose-lg max-w-none">
    <slot name="story" />
  </article>
  <div v-else class="about-summary prose prose-lg max-w-none">
    <slot name="summary" />
  </div>
</template>
