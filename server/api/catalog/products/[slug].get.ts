export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const requestedCurrency = String(query.currency ?? 'EUR').toUpperCase()
  const currency = requestedCurrency === 'USD' ? 'USD' : 'EUR'
  const locale = query.locale === 'nl' ? 'nl' : 'en'
  const slug = getRouterParam(event, 'slug')!
  setHeader(event, 'Cache-Control', 'private, no-store')
  if (!config.portalApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Catalog API credentials are not configured' })
  }
  try {
    const product = await $fetch<
      Record<string, unknown> & {
        images: string[]
        thumbnailImage: string | null
        detailImages: string[]
        visibility?: string
      }
    >(`/api/store/v1/products/${encodeURIComponent(slug)}`, {
      baseURL: config.portalUrl,
      query: { status: 'published', locale, currency },
      headers: { Authorization: `Bearer ${config.portalApiKey}` }
    })
    const portalOrigin = new URL(config.portalUrl).origin
    const localImageUrl = (url: string | null) => {
      if (!url) {
        return null
      }
      const parsed = new URL(url, portalOrigin)
      const match = parsed.origin === portalOrigin && parsed.pathname.match(/^\/api\/store\/media\/([^/]+)$/)
      return match ? `/api/catalog/media/${encodeURIComponent(decodeURIComponent(match[1]!))}` : url
    }
    if (product.visibility === 'unlisted') {
      setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
    }
    return {
      ...product,
      images: product.images.map((url) => localImageUrl(url)!),
      thumbnailImage: localImageUrl(product.thumbnailImage),
      detailImages: product.detailImages.map((url) => localImageUrl(url)!)
    }
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Offering not found' })
    }
    throw createError({ statusCode: 502, statusMessage: 'The product API is currently unavailable' })
  }
})
