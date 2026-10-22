import { catalogCheckoutUrl, type CatalogProduct } from '~/utils/catalogProduct'

export const useCatalogCheckout = () => {
  const currency = useCatalogCurrency()
  const requestUrl = useRequestURL()
  return (product: Pick<CatalogProduct, 'purchaseUrl' | 'slug'>) =>
    catalogCheckoutUrl(product, currency.value, requestUrl.origin)
}
