import assert from 'node:assert/strict'
import test from 'node:test'

const headers = new Map()
let fetchProduct
Object.assign(globalThis, {
  defineEventHandler: (handler) => handler,
  useRuntimeConfig: () => ({ portalUrl: 'https://portal.example.test', portalApiKey: 'server-only-key' }),
  getQuery: () => ({ currency: 'EUR' }),
  getRouterParam: () => 'unguessable-product-slug',
  setHeader: (_event, key, value) => headers.set(key, value),
  createError: (data) => Object.assign(new Error(data.statusMessage), data),
  $fetch: (...args) => fetchProduct(...args)
})
const { default: detail } = await import('../server/api/catalog/products/[slug].get.ts')

test('individual unlisted product loads without enumerating the catalog and stays private', async () => {
  fetchProduct = async (path, options) => {
    assert.equal(path, '/api/store/v1/products/unguessable-product-slug')
    assert.equal(options.headers.Authorization, 'Bearer server-only-key')
    assert.deepEqual(options.query, { status: 'published', locale: 'en', currency: 'EUR' })
    return {
      visibility: 'unlisted',
      title: 'Special',
      images: ['https://portal.example.test/api/store/media/image'],
      thumbnailImage: null,
      detailImages: [],
      purchaseUrl: 'https://portal.example.test/store/unguessable-product-slug'
    }
  }
  headers.clear()
  const product = await detail({})
  assert.equal(product.visibility, 'unlisted')
  assert.deepEqual(product.images, ['/api/catalog/media/image'])
  assert.equal(headers.get('Cache-Control'), 'private, no-store')
  assert.equal(headers.get('X-Robots-Tag'), 'noindex, nofollow')
  assert.equal(JSON.stringify(product).includes('server-only-key'), false)
})

test('missing or unpublished products return 404; upstream failures remain unavailable', async () => {
  fetchProduct = async () => {
    throw Object.assign(new Error('Missing'), { statusCode: 404 })
  }
  await assert.rejects(detail({}), { statusCode: 404 })
  fetchProduct = async () => {
    throw new Error('Unavailable')
  }
  await assert.rejects(detail({}), { statusCode: 502 })
})
