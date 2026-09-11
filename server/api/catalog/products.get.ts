type CatalogResponse = {
  items: Array<{
    images: string[]
    thumbnailImage: string | null
    detailImages: string[]
    [key: string]: unknown
  }>
  pagination: { page: number; pageSize: number; totalItems: number; totalPages: number }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const requestedCurrency = String(getQuery(event).currency ?? 'EUR').toUpperCase()
  const currency = requestedCurrency === 'USD' ? 'USD' : 'EUR'
  if (!config.portalApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Catalog API credentials are not configured' })
  }

  try {
    const catalog = await $fetch<CatalogResponse>('/api/store/v1/products', {
      baseURL: config.portalUrl,
      query: { status: 'draft', locale: 'en', currency },
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

    return {
      ...catalog,
      items: catalog.items.map((product) => ({
        ...product,
        images: product.images.map((url) => localImageUrl(url)!),
        thumbnailImage: localImageUrl(product.thumbnailImage),
        detailImages: product.detailImages.map((url) => localImageUrl(url)!)
      }))
    }
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'The catalog API is currently unavailable' })
  }
})
