import assert from 'node:assert/strict'
import test from 'node:test'
import { managedCatalogProducts, selectedFaqs, groupedFaqs, faqAnswerText } from '../app/utils/managedContent.ts'

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
  body: { value: [['p', {}, `${slug} answer`]] }
})

test('FAQ selection reuses categories and individual questions once, excludes inactive records, and follows selection order', () => {
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
    ['specific', 'shared']
  )
  assert.equal(result[0].question, 'specific?')
  assert.deepEqual(selectedFaqs(faqs, {}), [])
  assert.equal(faqs[0].slug, 'specific')
})

test('category headings use selected names first, derive other headings from FAQs, and show each question once', () => {
  const items = selectedFaqs(
    [
      faq('shared', 10, ['General questions', 'Coaching']),
      faq('custom', 20, ['New category']),
      faq('uncategorized', 30, [])
    ],
    { faqSlugs: ['shared', 'custom', 'uncategorized'] }
  )
  const groups = groupedFaqs(items, ['Empty category', 'Coaching', 'Coaching', 'General questions'])
  assert.deepEqual(
    groups.map((group) => group.title),
    ['Coaching', 'New category', '']
  )
  assert.deepEqual(
    groups.flatMap((group) => group.items.map((item) => item.slug)),
    ['shared', 'custom', 'uncategorized']
  )
  assert.deepEqual(
    groupedFaqs(items).map((group) => group.title),
    ['General questions', 'New category', '']
  )
  assert.deepEqual(groupedFaqs([], ['Empty category']), [])
})

test('FAQ structured data uses readable text from the same Markdown as the answer panel', () => {
  const body = {
    value: [
      ['p', {}, 'A ', ['strong', {}, 'bold'], ' answer with ', ['a', { href: '/contact' }, 'a link'], '.'],
      ['ul', {}, ['li', {}, 'First step'], ['li', {}, 'Second step']],
      ['p', {}, ['img', { src: '/example.jpg', alt: 'Example image' }]]
    ]
  }
  assert.equal(faqAnswerText(body), 'A bold answer with a link. First step Second step Example image')
  assert.equal(faqAnswerText({ value: [] }), '')
})

test('individually selected FAQs follow Studio chip order, skipping missing, inactive, and duplicate entries', () => {
  const faqs = [faq('first', 10, []), faq('second', 20, []), faq('third', 30, []), faq('inactive', 0, [], false)]
  const selection = { faqSlugs: ['third', 'missing', 'first', 'inactive', 'second', 'third'] }
  assert.deepEqual(
    selectedFaqs(faqs, selection).map((faq) => faq.slug),
    ['third', 'first', 'second']
  )
  assert.deepEqual(
    selectedFaqs(faqs, { faqSlugs: ['second', 'third', 'first'] }).map((faq) => faq.slug),
    ['second', 'third', 'first']
  )
  assert.equal(faqs[0].slug, 'first')
})

test('category-only selections retain numeric question order; additional category matches follow selected questions', () => {
  const faqs = [faq('later', 30, ['general']), faq('early', 10, ['general']), faq('middle', 20, ['general'])]
  assert.deepEqual(
    selectedFaqs(faqs, { faqCategories: ['general'] }).map((faq) => faq.slug),
    ['early', 'middle', 'later']
  )
  assert.deepEqual(
    selectedFaqs(faqs, { faqSlugs: ['later'], faqCategories: ['general'] }).map((faq) => faq.slug),
    ['later', 'early', 'middle']
  )
})
