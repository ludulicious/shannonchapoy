<script setup lang="ts">
import { publicCatalogProducts, type CatalogProduct } from '~/utils/catalogProduct'

definePageMeta({
  path: '/:section(about|offerings|philosophy|contact)?',
  key: 'landing'
})

const { data: contentData } = await useAsyncData('content-home', () => queryCollection('content').path('/').first())

usePageSeo(contentData)

const config = useRuntimeConfig()
const featuredOfferingSlug = config.public.featuredOfferingSlug
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
const products = computed(() => publicCatalogProducts(catalog.value?.items ?? [], featuredOfferingSlug))
const featured = computed(() => products.value.find((product) => product.slug === featuredOfferingSlug))
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
    <Hero :product="featured" :offer-deadline="featuredDeadline" />
    <Services
      v-if="otherProducts.length || !featured"
      :products="otherProducts"
      :has-featured="!!featured"
      :status="status"
      :has-error="!!error"
      :deadline-for="deadlineFor"
      @retry="refresh()"
    />
    <About />
    <Philosophy v-if="route.path === '/philosophy'" />
    <PageFaq :items="contentData?.faq" />
    <BookingCallout v-if="featured" :product="featured" :offer-deadline="featuredDeadline" />
    <Contact />
  </main>
</template>
