import assert from 'node:assert/strict'
import test from 'node:test'

let fetchPage
Object.assign(globalThis, {
  defineEventHandler: (handler) => handler,
  useRuntimeConfig: () => ({ portalUrl: 'https://portal.example.test', portalApiKey: 'server-only-key' }),
  getQuery: () => ({ currency: 'USD' }),
  createError: (data) => Object.assign(new Error(data.statusMessage), data),
  $fetch: (...args) => fetchPage(...args)
})
const { default: catalog } = await import('../server/api/catalog/products.get.ts')

test('all public catalog pages are available for Studio selections and media stays proxied', async () => {
  const pages = []
  fetchPage = async (path, options) => {
    assert.equal(path, '/api/store/v1/products')
    assert.equal(options.headers.Authorization, 'Bearer server-only-key')
    assert.equal(options.query.status, 'published')
    assert.equal(options.query.currency, 'USD')
    pages.push(options.query.page)
    return {
      items: [
        {
          slug: `offering-${options.query.page}`,
          images: ['https://portal.example.test/api/store/media/photo'],
          thumbnailImage: null,
          detailImages: []
        }
      ],
      pagination: { page: options.query.page, pageSize: 1, totalItems: 2, totalPages: 2 }
    }
  }
  const response = await catalog({})
  assert.deepEqual(pages, [1, 2])
  assert.deepEqual(
    response.items.map((p) => p.slug),
    ['offering-1', 'offering-2']
  )
  assert.deepEqual(response.items[1].images, ['/api/catalog/media/photo'])
  assert.equal(response.pagination.totalItems, 2)
  assert.equal(JSON.stringify(response).includes('server-only-key'), false)
})

test('a failed subsequent catalog page reports an error instead of silently dropping selected offerings', async () => {
  fetchPage = async (_path, { query }) => {
    if (query.page === 2) {
      throw new Error('Unavailable')
    }
    return { items: [], pagination: { totalPages: 2 } }
  }
  await assert.rejects(catalog({}), { statusCode: 502 })
})
