import { catalogOfferDeadline } from '~/utils/catalogOffer'
import type { CatalogPrice } from '~/utils/catalogPrice'

export const useCatalogOffers = (prices: () => CatalogPrice[], refresh: () => unknown) => {
  const now = useState('catalog-offer-now', () => Date.now())
  const timeZone = ref('UTC')
  const deadlineFor = (price: CatalogPrice | undefined) => catalogOfferDeadline(price, now.value, timeZone.value)
  const activeOffers = computed(() => prices().flatMap((price) => deadlineFor(price) ?? []))

  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    timeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
    const updateOffers = () => {
      const previous = activeOffers.value
      now.value = Date.now()
      if (previous.some((offer) => Date.parse(offer.endsAt) <= now.value)) {
        void refresh()
      }
    }
    updateOffers()
    timer = setInterval(updateOffers, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return { deadlineFor }
}
