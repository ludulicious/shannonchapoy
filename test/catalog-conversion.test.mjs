import assert from 'node:assert/strict'
import test from 'node:test'
import { catalogCheckoutUrl } from '../app/utils/catalogProduct.ts'

test('checkout retains the booking destination and selected currency through the return', () => {
  for (const currency of ['EUR', 'USD']) {
    const url = new URL(
      catalogCheckoutUrl(
        { slug: 'intake', purchaseUrl: 'https://portal.example/store/intake/book?source=website' },
        currency,
        'https://shannon.example'
      )
    )
    assert.equal(url.pathname, '/store/intake/book')
    assert.equal(url.searchParams.get('source'), 'website')
    assert.equal(url.searchParams.get('currency'), currency)
    const returnUrl = new URL(url.searchParams.get('returnUrl'))
    assert.equal(returnUrl.origin, 'https://shannon.example')
    assert.equal(returnUrl.pathname, '/thank-you/intake')
    assert.equal(returnUrl.searchParams.get('currency'), currency)
    assert.equal(returnUrl.searchParams.get('locale'), 'en')
  }
})

test('invalid or unavailable checkout destinations do not produce purchase links', () => {
  for (const purchaseUrl of ['', 'not a URL', 'javascript:alert(1)']) {
    assert.equal(catalogCheckoutUrl({ slug: 'intake', purchaseUrl }, 'EUR', 'https://shannon.example'), '')
  }
})
