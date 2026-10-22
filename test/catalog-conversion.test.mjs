import assert from 'node:assert/strict'
import test from 'node:test'
import { catalogCheckoutUrl, publicCatalogProducts } from '../app/utils/catalogProduct.ts'

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

test('the configured slug takes priority without revealing unlisted products', () => {
  const products = [
    { slug: 'intake', visibility: 'listed', isFree: false, prices: [{ amount: 6050 }] },
    { slug: 'pathway', visibility: 'listed', isFree: false, prices: [{ amount: 22200 }] },
    { slug: 'private-gift', visibility: 'unlisted', isFree: true, prices: [] }
  ]
  assert.deepEqual(
    publicCatalogProducts(products, 'pathway').map((p) => p.slug),
    ['pathway', 'intake']
  )
  assert.deepEqual(
    publicCatalogProducts(products, 'intake').map((p) => p.slug),
    ['intake', 'pathway']
  )
  for (const slug of ['private-gift', 'missing', '']) {
    const visible = publicCatalogProducts(products, slug)
    assert.deepEqual(
      visible.map((p) => p.slug),
      ['intake', 'pathway']
    )
    assert.equal(
      visible.find((p) => p.slug === slug),
      undefined
    )
  }
  assert.equal(products[0].slug, 'intake')
})
