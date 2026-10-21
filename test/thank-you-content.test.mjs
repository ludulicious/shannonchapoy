import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveThankYouCopy } from '../shared/utils/thankYou.ts'

const defaults = [
  { locale: 'en', variant: 'free', heading: 'Free default', messageText: 'A gift for you' },
  { locale: 'en', variant: 'paid', heading: 'Paid default', messageText: 'Thanks for ordering' },
  { locale: 'nl', variant: 'free', heading: 'Gratis cadeau' }
]

test('free and paid defaults are isolated by variant and language', () => {
  assert.equal(resolveThankYouCopy(defaults, 'audio', 'free', 'en').heading, 'Free default')
  assert.equal(resolveThankYouCopy(defaults, 'audio', 'paid', 'en').heading, 'Paid default')
  assert.equal(resolveThankYouCopy(defaults, 'audio', 'free', 'nl').heading, 'Gratis cadeau')
})
test('exact slug overrides inherit blank fields without affecting another slug or variant', () => {
  const documents = [
    ...defaults,
    { productSlug: 'audio', variant: 'free', locale: 'en', heading: 'Your meditation is ready', messageText: '' }
  ]
  const resolved = resolveThankYouCopy(documents, 'audio', 'free', 'en')
  assert.equal(resolved.heading, 'Your meditation is ready')
  assert.equal(resolved.message, 'A gift for you')
  assert.equal(resolveThankYouCopy(documents, 'other', 'free', 'en').heading, 'Free default')
  assert.equal(resolveThankYouCopy(documents, 'audio', 'paid', 'en').heading, 'Paid default')
})
test('missing documents have complete safe defaults', () => {
  const copy = resolveThankYouCopy([], 'audio', 'free', 'en')
  assert.equal(Object.keys(copy).length, 5)
  assert.ok(Object.values(copy).every((value) => typeof value === 'string' && value.length > 0))
})
