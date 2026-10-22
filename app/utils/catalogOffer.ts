import { hasCatalogDiscount, type CatalogPrice } from './catalogPrice.ts'

export function catalogOfferDeadline(price: CatalogPrice | undefined, now: number, timeZone = 'UTC') {
  if (!hasCatalogDiscount(price) || !price?.offer) {
    return null
  }
  const start = Date.parse(price.offer.startsAt)
  const end = Date.parse(price.offer.endsAt)
  if (!Number.isFinite(start) || !Number.isFinite(end) || now < start || now >= end) {
    return null
  }

  const calendarDay = (time: number) => {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(time)
    const value = (type: string) => Number(parts.find((part) => part.type === type)!.value)
    return Date.UTC(value('year'), value('month') - 1, value('day')) / 86400000
  }
  const daysLeft = calendarDay(end) - calendarDay(now)
  return {
    endsAt: price.offer.endsAt,
    date: new Intl.DateTimeFormat('en-GB', { timeZone, day: 'numeric', month: 'long', year: 'numeric' }).format(end),
    exactTime: new Intl.DateTimeFormat('en-GB', {
      timeZone,
      dateStyle: 'long',
      timeStyle: 'long'
    }).format(end),
    label:
      daysLeft === 0
        ? 'Ends today'
        : daysLeft === 1
          ? 'Ends tomorrow'
          : daysLeft <= 7
            ? `Only ${daysLeft} days left`
            : 'Limited-time offer'
  }
}
