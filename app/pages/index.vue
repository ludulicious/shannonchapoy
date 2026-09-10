<script setup lang="ts">
definePageMeta({
  path: '/:section(about|services|philosophy|contact)?',
  key: 'landing'
})

usePageSeo(
  'Self-Love & Relationship Coaching - Shannon Chapoy',
  'Rediscover yourself with Shannon Chapoy. Explore self-love workshops, one-on-one relationship coaching, and Peace & Joy Circles for successful women.'
)

const route = useRoute()
const { handleHashNavigation } = useScrollToSection()

onMounted(() => {
  handleHashNavigation()
})

watch(
  () => route.path,
  () => {
    handleHashNavigation()
  }
)
</script>

<template>
  <div>
    <Hero />
    <About />
    <Services />
    <Philosophy />
    <Contact />
  </div>
</template>
