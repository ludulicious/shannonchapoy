<template>
  <div>
    <Hero />
    <About />
    <Services />
    <Philosophy />
    <Contact />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { handleHashNavigation } = useScrollToSection()

onMounted(() => {
  if (process.client) {
    handleHashNavigation()
  }
})
</script>

