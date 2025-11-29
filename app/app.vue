<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Disable scroll restoration
if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
  
  // Reset scroll position immediately
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  if (document.body) {
    document.body.scrollTop = 0
  }
  
  // Also reset on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    if (document.body) {
      document.body.scrollTop = 0
    }
  })
}
</script>

<style>
html {
  scroll-padding-top: 40px;
}

section[id] {
  scroll-margin-top: 40px;
}
</style>

