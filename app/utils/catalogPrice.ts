export type CatalogPrice = {
  amount: number
  originalAmount?: number
  currency: string
  taxBehavior: 'exclusive' | 'inclusive' | 'unspecified'
}

export const effectiveCatalogAmount = (product: { isFree: boolean; prices: CatalogPrice[] }) =>
  product.isFree ? 0 : (product.prices[0]?.amount ?? Number.POSITIVE_INFINITY)

export const hasCatalogDiscount = (price: CatalogPrice | undefined) =>
  !!price && typeof price.originalAmount === 'number' && price.originalAmount > price.amount

export const formatCatalogAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2
  }).format(amount / 100)
