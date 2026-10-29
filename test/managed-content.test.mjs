import assert from 'node:assert/strict'
import test from 'node:test'
import { managedCatalogProducts, selectedFaqs, groupedFaqs } from '../app/utils/managedContent.ts'

const offering = (slug, order, options = {}) => ({ slug, order, isActive: true, isFeatured: false, ...options })

test('Studio ordering and active flags curate the catalog without exposing unlisted or unknown products', () => {
  const products = [
    { slug: 'intake', visibility: 'listed', prices: [{ amount: 100 }] },
    { slug: 'pathway', visibility: 'listed', prices: [{ amount: 200 }] },
    { slug: 'hidden', visibility: 'unlisted' },
    { slug: 'not-selected', visibility: 'listed' },
    { slug: 'inactive', visibility: 'listed' }
  ]
  const offerings = [
    offering('intake', 20),
    offering('pathway', 10, { isFeatured: true }),
    offering('hidden', 1, { isFeatured: true }),
    offering('missing', 0, { isFeatured: true }),
    offering('inactive', 2, { isActive: false, isFeatured: true }),
    offering('intake', 30, { isFeatured: true })
  ]
  const result = managedCatalogProducts(products, offerings)
  assert.deepEqual(
    result.map((p) => p.slug),
    ['pathway', 'intake']
  )
  assert.equal(result.find((p) => p.isFeatured)?.slug, 'pathway')
  assert.equal(result[1].isFeatured, false)
  assert.equal(products[0].isFeatured, undefined)
  assert.equal(offerings[0].slug, 'intake')
  assert.deepEqual(managedCatalogProducts(products, []), [])
})

test('multiple featured offerings resolve by saved order and unavailable candidates are skipped', () => {
  const result = managedCatalogProducts(
    [{ slug: 'later' }, { slug: 'earlier' }],
    [
      offering('missing', 0, { isFeatured: true }),
      offering('later', 20, { isFeatured: true }),
      offering('earlier', 10, { isFeatured: true })
    ]
  )
  assert.equal(result.find((p) => p.isFeatured)?.slug, 'earlier')
  assert.equal(
    managedCatalogProducts([{ slug: 'plain' }], [offering('plain', 0)]).find((p) => p.isFeatured),
    undefined
  )
})

const faq = (slug, order, categories, isActive = true) => ({
  slug,
  order,
  categories,
  isActive,
  title: `${slug}?`,
  answer: `${slug} answer`
})

test('FAQ selection reuses categories and individual questions once, excludes inactive records, and follows saved order', () => {
  const faqs = [
    faq('specific', 30, ['coaching']),
    faq('shared', 10, ['general', 'coaching']),
    faq('inactive', 0, ['general'], false),
    faq('unrelated', 5, [])
  ]
  const result = selectedFaqs(faqs, {
    faqSlugs: ['specific', 'shared', 'missing', 'inactive'],
    faqCategories: ['general']
  })
  assert.deepEqual(
    result.map((item) => item.slug),
    ['shared', 'specific']
  )
  assert.equal(result[0].question, 'shared?')
  assert.deepEqual(selectedFaqs(faqs, {}), [])
  assert.equal(faqs[0].slug, 'specific')
})

test('category headings use saved order and each question appears once, including uncategorized answers', () => {
  const items = selectedFaqs([faq('shared', 10, ['general', 'coaching']), faq('orphan', 20, ['removed-category'])], {
    faqSlugs: ['shared', 'orphan']
  })
  const groups = groupedFaqs(items, [
    { slug: 'general', title: 'General', order: 20 },
    { slug: 'coaching', title: 'Coaching', order: 10 }
  ])
  assert.deepEqual(
    groups.map((group) => group.title),
    ['Coaching', '']
  )
  assert.deepEqual(
    groups.flatMap((group) => group.items.map((item) => item.slug)),
    ['shared', 'orphan']
  )
})
