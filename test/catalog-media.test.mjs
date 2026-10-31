import assert from 'node:assert/strict'
import test from 'node:test'

const config = { portalUrl: 'https://portal.example.test', portalApiKey: 'server-only-key' }
const product = {
  images: ['https://portal.example.test/api/store/media/photo?purpose=gallery'],
  thumbnailImage: 'https://portal.example.test/api/store/media/photo?purpose=thumbnail',
  detailImages: ['https://portal.example.test/api/store/media/photo?purpose=detail']
}
Object.assign(globalThis, {
  defineEventHandler: (handler) => handler,
  useRuntimeConfig: () => config,
  getQuery: (event) => event.query || {},
  getRouterParam: (_event, name) => (name === 'slug' ? 'discover-yourself' : 'photo'),
  setHeader: () => {},
  createError: (data) => Object.assign(new Error(data.statusMessage), data),
  $fetch: async (path) =>
    path.endsWith('/discover-yourself') ? product : { items: [product], pagination: { totalPages: 1 } },
  proxyRequest: async (_event, target, options) => ({ target, options })
})
const { default: list } = await import('../server/api/catalog/products.get.ts')
const { default: detail } = await import('../server/api/catalog/products/[slug].get.ts')
const { default: media } = await import('../server/api/catalog/media/[id].get.ts')

test('list and detail image URLs retain their variants through the authenticated media proxy', async () => {
  const products = [(await list({})).items[0], await detail({})]
  for (const item of products) {
    for (const [url, purpose] of [
      [item.thumbnailImage, 'thumbnail'],
      [item.images[0], 'gallery'],
      [item.detailImages[0], 'detail']
    ]) {
      assert.equal(url, `/api/catalog/media/photo?purpose=${purpose}`)
      const query = Object.fromEntries(new URL(url, 'https://website.example.test').searchParams)
      const response = await media({ query })
      assert.equal(response.target, `https://portal.example.test/api/store/media/photo?purpose=${purpose}`)
      assert.equal(response.options.headers.Authorization, config.portalApiKey.replace(/^/, 'Bearer '))
    }
  }
})

test('media without a purpose continues to request the full image', async () => {
  assert.equal((await media({})).target, 'https://portal.example.test/api/store/media/photo')
})
