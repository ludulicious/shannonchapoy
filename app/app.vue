<script setup>
const route = useRoute()
const pageKey = computed(() => (isLandingPath(route.path) ? 'landing' : route.fullPath))

useHead(() => ({
  htmlAttrs: {
    class: route.path === '/privacy' || route.path === '/terms' ? 'legal-document' : ''
  }
}))

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
html.legal-document,
html.legal-document body {
  overflow-anchor: none;
  scroll-behavior: auto;
}

html {
  scroll-padding-top: 40px;
}

section[id] {
  scroll-margin-top: 40px;
}
</style>
