type CatalogResponse = {
  items: Array<{
    images: string[]
    thumbnailImage: string | null
    detailImages: string[]
    nextSteps: string
    [key: string]: unknown
  }>
  pagination: { page: number; pageSize: number; totalItems: number; totalPages: number }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const requestedCurrency = String(getQuery(event).currency ?? 'EUR').toUpperCase()
  const currency = requestedCurrency === 'USD' ? 'USD' : 'EUR'
  const locale = getQuery(event).locale === 'nl' ? 'nl' : 'en'
  if (!config.portalApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Catalog API credentials are not configured' })
  }

  try {
    const readPage = (page: number) =>
      $fetch<CatalogResponse>('/api/store/v1/products', {
        baseURL: config.portalUrl,
        query: { status: 'published', locale, currency, page },
        headers: { Authorization: `Bearer ${config.portalApiKey}` }
      })
    const catalog = await readPage(1)
    const items = [...catalog.items]
    // A Studio-selected slug may be on any page of the portal's public catalog.
    for (let page = 2; page <= catalog.pagination.totalPages; page++) {
      items.push(...(await readPage(page)).items)
    }
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
      pagination: { page: 1, pageSize: items.length, totalItems: items.length, totalPages: 1 },
      items: items.map((product) => ({
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
