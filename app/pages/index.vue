<script setup lang="ts">
import type { CatalogProduct } from '~/utils/catalogProduct'
import { managedCatalogProducts } from '~/utils/managedContent'

definePageMeta({
  path: '/:section(about|offerings|philosophy|faq)?',
  key: 'landing'
})

const { data: contentData } = await useAsyncData('content-home', () => queryCollection('homepage_hero').first())

const { data: homepageSettings } = await useAsyncData('homepage-settings', () =>
  queryCollection('homepage_settings').first()
)
const { data: offeringsSection } = await useAsyncData('homepage-offerings', () =>
  queryCollection('homepage_offerings').first()
)
const { data: faqSection } = await useAsyncData('homepage-faq', () => queryCollection('homepage_faq').first())
const { items: faqItems, groups: faqGroups } = await useFaqs(faqSection, { includeCategories: true })
usePageSeo(() => ({ ...homepageSettings.value, faq: faqItems.value }))

const { data: offerings } = await useAsyncData('managed-offerings', () => queryCollection('offerings').all())

const currency = useCatalogCurrency()
const {
  data: catalog,
  status,
  error,
  refresh
} = await useFetch<{ items: CatalogProduct[] }>('/api/catalog/products', {
  query: { currency }
})
const { deadlineFor } = useCatalogOffers(
  () => (catalog.value?.items ?? []).flatMap((product) => product.prices.slice(0, 1)),
  refresh
)
const products = computed(() => managedCatalogProducts(catalog.value?.items ?? [], offerings.value ?? []))
const featured = computed(() => products.value.find((product) => product.isFeatured))
const otherProducts = computed(() => products.value.filter((product) => product.slug !== featured.value?.slug))
const featuredDeadline = computed(() => deadlineFor(featured.value?.prices[0]))

const route = useRoute()
const { handleHashNavigation } = useScrollToSection()

onMounted(() => {
  handleHashNavigation()
})

watch(
  () => route.path,
  () => {
    handleHashNavigation()
  },
  { flush: 'post' }
)
</script>

<template>
  <main>
    <Hero v-if="contentData" :content="contentData" :product="featured" :offer-deadline="featuredDeadline" />
    <Services
      v-if="offeringsSection && (otherProducts.length || !featured)"
      :content="offeringsSection"
      :products="otherProducts"
      :has-featured="!!featured"
      :status="status"
      :has-error="!!error"
      :deadline-for="deadlineFor"
      @retry="refresh()"
    />
    <About />
    <Philosophy v-if="route.path === '/philosophy'" />
    <PageFaq :groups="faqGroups" :heading="faqSection?.title" :intro="faqSection" />
    <Contact />
  </main>
</template>
