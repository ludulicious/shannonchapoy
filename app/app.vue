<script setup>
const route = useRoute()
const pageKey = computed(() => (isLandingPath(route.path) ? 'landing' : route.fullPath))

if (import.meta.client && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage :page-key="pageKey" />
    </NuxtLayout>
  </div>
</template>

<style>
html {
  scroll-padding-top: 40px;
}

section[id] {
  scroll-margin-top: 40px;
}
</style>
