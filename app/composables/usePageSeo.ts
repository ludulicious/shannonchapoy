const siteUrl = 'https://shannonchapoy.com'

export const usePageSeo = (title: string, description: string) => {
  const route = useRoute()
  const canonical = computed(() => {
    const path = route.path.replace(/\/+$/, '') || '/'
    return `${siteUrl}${isLandingPath(path) ? '/' : path}`
  })
  const image = `${siteUrl}/images/og-shannon-chapoy.jpg`
  const imageAlt = 'Shannon Chapoy — Your greatest love lives within you. Self-love & relationship coaching.'

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogSiteName: 'Shannon Chapoy',
    ogLocale: 'en_US',
    ogUrl: () => canonical.value,
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    ogImageAlt: imageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: imageAlt
  })
  useHead(() => ({ link: [{ rel: 'canonical', href: canonical.value }] }))
}
