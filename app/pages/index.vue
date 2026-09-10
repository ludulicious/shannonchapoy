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
definePageMeta({
  path: '/:section(about|services|philosophy|contact)?',
  key: 'landing'
})

useHead({
  title: 'Shannon Chapoy'
})

const route = useRoute()
const { handleHashNavigation } = useScrollToSection()

onMounted(() => {
  handleHashNavigation()
})

watch(() => route.path, () => {
  handleHashNavigation()
})
</script>
