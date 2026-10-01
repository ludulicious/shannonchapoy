<script setup lang="ts">
definePageMeta({
  path: '/:section(about|offerings|philosophy|contact)?',
  key: 'landing'
})

const { data: contentData } = await useAsyncData('content-home', () => queryCollection('content').path('/').first())

usePageSeo(contentData)

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
    <PageFaq :items="contentData?.faq" />
    <Contact />
  </div>
</template>
