import { toValue, type MaybeRefOrGetter } from 'vue'

const siteUrl = 'https://shannonchapoy.com'
const defaultImage = '/images/og-shannon-chapoy.jpg'
const defaultImageAlt = 'Shannon Chapoy — Your greatest love lives within you. Self-love & relationship coaching.'

type SeoPage = {
  title?: string
  description?: string
  seo?: {
    title?: string
    description?: string
    image?: string
    imageAlt?: string
    canonical?: string
    noindex?: boolean
  }
  structuredData?: { type: 'WebPage' | 'Service'; name?: string; serviceType?: string; audience?: string }
  profile?: { name: string; jobTitle: string; description: string; sameAs?: string[] }
  faq?: { question: string; answer: string }[]
}

// Never use a request host (or query parameters) as the production canonical.
const absoluteUrl = (value: string | undefined, fallback: string) => {
  try {
    const url = new URL(value || fallback, siteUrl)
    return url.protocol === 'https:' ? url.href : new URL(fallback, siteUrl).href
  } catch {
    return new URL(fallback, siteUrl).href
  }
}

export const usePageSeo = (source: MaybeRefOrGetter<SeoPage | null | undefined>) => {
  const route = useRoute()
  const page = computed(() => toValue(source))
  const title = computed(() => page.value?.seo?.title || page.value?.title || 'Shannon Chapoy')
  const description = computed(() => page.value?.seo?.description || page.value?.description || '')
  const canonical = computed(() => {
    const path = route.path.replace(/\/+$/, '') || '/'
    const url = new URL(absoluteUrl(page.value?.seo?.canonical, isLandingPath(path) ? '/' : path))
    url.search = ''
    url.hash = ''
    return url.href
  })
  const image = computed(() => absoluteUrl(page.value?.seo?.image, defaultImage))
  const imageAlt = computed(() => page.value?.seo?.imageAlt || defaultImageAlt)

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    robots: () => (page.value?.seo?.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogType: 'website',
    ogSiteName: 'Shannon Chapoy',
    ogLocale: 'en_US',
    ogUrl: () => canonical.value,
    ogImage: () => image.value,
    ogImageWidth: () => (image.value === `${siteUrl}${defaultImage}` ? 1200 : undefined),
    ogImageHeight: () => (image.value === `${siteUrl}${defaultImage}` ? 630 : undefined),
    ogImageAlt: () => imageAlt.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
    twitterImageAlt: () => imageAlt.value
  })

  useHead(() => {
    const personId = `${siteUrl}/#person`
    const websiteId = `${siteUrl}/#website`
    const pageId = `${canonical.value}#webpage`
    const profile = page.value?.profile
    const service = page.value?.structuredData
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Person',
        '@id': personId,
        name: profile?.name || 'Shannon Chapoy',
        url: `${siteUrl}/`,
        ...(profile ? { jobTitle: profile.jobTitle, description: profile.description, sameAs: profile.sameAs } : {})
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${siteUrl}/`,
        name: 'Shannon Chapoy',
        publisher: { '@id': personId },
        inLanguage: 'en'
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: canonical.value,
        name: title.value,
        description: description.value,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        inLanguage: 'en',
        ...(service?.type === 'Service' ? { mainEntity: { '@id': `${canonical.value}#service` } } : {})
      }
    ]
    if (service?.type === 'Service') {
      graph.push({
        '@type': 'Service',
        '@id': `${canonical.value}#service`,
        name: service.name || page.value?.title,
        description: description.value,
        url: canonical.value,
        provider: { '@id': personId },
        serviceType: service.serviceType,
        ...(service.audience ? { audience: { '@type': 'Audience', audienceType: service.audience } } : {})
      })
    }
    if (page.value?.faq?.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical.value}#faq`,
        isPartOf: { '@id': pageId },
        mainEntity: page.value.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      })
    }
    return {
      link: [{ rel: 'canonical', href: canonical.value }],
      script: [
        {
          key: 'page-structured-data',
          type: 'application/ld+json',
          // Prevent frontmatter from terminating a script element in server-rendered HTML.
          innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
        }
      ]
    }
  })
}
