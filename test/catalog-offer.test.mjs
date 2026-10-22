import assert from 'node:assert/strict'
import test from 'node:test'
import { catalogOfferDeadline } from '../app/utils/catalogOffer.ts'

const price = {
  amount: 0,
  originalAmount: 5000,
  currency: 'USD',
  taxBehavior: 'inclusive',
  offer: { id: 'offer', startsAt: '2026-10-01T00:00:00Z', endsAt: '2026-10-31T18:00:00Z' }
}
const deadline = (now, timeZone) => catalogOfferDeadline(price, Date.parse(now), timeZone)

test('deadline changes from the offer label to days left, tomorrow, and today', () => {
  assert.equal(deadline('2026-10-23T18:00:00Z').label, 'Limited-time offer')
  assert.equal(deadline('2026-10-24T18:00:00Z').label, 'Only 7 days left')
  assert.equal(deadline('2026-10-29T23:59:59Z').label, 'Only 2 days left')
  assert.equal(deadline('2026-10-30T00:00:00Z').label, 'Ends tomorrow')
  assert.equal(deadline('2026-10-31T00:00:00Z').label, 'Ends today')
  assert.equal(deadline('2026-10-31T17:59:59Z').date, '31 October 2026')
})

test('missing, invalid, future, expired, and non-discounted offers have no deadline', () => {
  const now = Date.parse('2026-10-22T00:00:00Z')
  assert.equal(catalogOfferDeadline(undefined, now), null)
  assert.equal(catalogOfferDeadline({ ...price, offer: null }, now), null)
  assert.equal(catalogOfferDeadline({ ...price, originalAmount: 0 }, now), null)
  assert.equal(catalogOfferDeadline({ ...price, offer: { ...price.offer, endsAt: 'invalid' } }, now), null)
  assert.equal(deadline('2026-09-30T23:59:59Z'), null)
  assert.equal(deadline('2026-10-31T18:00:00Z'), null)
})

test('calendar days use the supplied timezone, including across daylight saving changes', () => {
  assert.equal(deadline('2026-10-30T23:30:00Z', 'Europe/Amsterdam').label, 'Ends today')
  assert.equal(deadline('2026-10-24T22:30:00Z', 'Europe/Amsterdam').label, 'Only 6 days left')
  const lateOffer = { ...price, offer: { ...price.offer, endsAt: '2026-11-01T01:00:00Z' } }
  const local = catalogOfferDeadline(lateOffer, Date.parse('2026-10-31T17:00:00Z'), 'America/New_York')
  assert.equal(local.date, '31 October 2026')
  assert.equal(local.label, 'Ends today')
})
