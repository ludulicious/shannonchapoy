export type CatalogCurrency = 'EUR' | 'USD'

export const useCatalogCurrency = () =>
  useCookie<CatalogCurrency>('catalog-currency', {
    default: () => 'EUR',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
