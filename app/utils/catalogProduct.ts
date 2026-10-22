import { effectiveCatalogAmount, type CatalogPrice } from './catalogPrice.ts'

export type CatalogProduct = {
  visibility?: 'listed' | 'unlisted'
  id: string
  slug: string
  type: 'digital' | 'service'
  title: string
  subtitle?: string
  summary: string
  thumbnailImage: string | null
  prices: CatalogPrice[]
  purchaseUrl: string
  buyButtonLabel?: string
  categoryDetails?: { name?: string }
  isFree: boolean
  planningEnabled?: boolean
  durationMinutes?: number | null
}

export const catalogActionLabel = (
  product: Pick<CatalogProduct, 'buyButtonLabel' | 'planningEnabled' | 'type' | 'isFree'>
) =>
  product.buyButtonLabel ||
  (product.type === 'service' && product.planningEnabled
    ? 'Book a session'
    : product.isFree
      ? 'Get this offering'
      : 'Buy now')

export const catalogCheckoutUrl = (
  product: Pick<CatalogProduct, 'purchaseUrl' | 'slug'>,
  currency: string,
  origin: string
) => {
  if (!product.purchaseUrl) {
    return ''
  }
  try {
    const url = new URL(product.purchaseUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return ''
    }
    const returnUrl = new URL(`/thank-you/${encodeURIComponent(product.slug)}`, origin)
    for (const target of [url, returnUrl]) {
      target.searchParams.set('locale', 'en')
      target.searchParams.set('currency', currency)
    }
    url.searchParams.set('returnUrl', returnUrl.toString())
    return url.toString()
  } catch {
    return ''
  }
}

export const publicCatalogProducts = (products: CatalogProduct[], featuredSlug: string) =>
  products
    .filter((product) => product.visibility !== 'unlisted')
    .sort((left, right) => {
      const priority = Number(right.slug === featuredSlug) - Number(left.slug === featuredSlug)
      return priority || effectiveCatalogAmount(left) - effectiveCatalogAmount(right)
    })
