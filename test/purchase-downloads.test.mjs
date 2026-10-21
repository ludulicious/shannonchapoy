import assert from 'node:assert/strict'
import test from 'node:test'

const headers = new Map()
let token = 'a'.repeat(64)
let response
Object.assign(globalThis, {
  defineEventHandler: (handler) => handler,
  useRuntimeConfig: () => ({ portalUrl: 'https://portal.example.test' }),
  getQuery: () => ({ purchase: token }),
  setHeaders: (_event, values) => Object.entries(values).forEach(([key, value]) => headers.set(key, value)),
  createError: (data) => Object.assign(new Error(data.statusMessage), data),
  $fetch: async (path, options) => {
    assert.equal(path, `/api/store/purchases/${token}`)
    assert.equal(options.headers, undefined)
    return response
  }
})
const { default: purchase } = await import('../server/api/catalog/purchase.get.ts')
const files = [{ id: 'audio', name: 'Meditation.mp3', url: 'https://portal.example.test/download' }]

test('paid and invoice-later orders retain the portal-authorized download list', async () => {
  for (const status of ['paid', 'accepted']) {
    response = { status, files }
    assert.deepEqual(await purchase({}), { status, files })
  }
  assert.equal(headers.get('Cache-Control'), 'private, no-store')
  assert.equal(headers.get('Referrer-Policy'), 'no-referrer')
})

test('unconfirmed or failed orders do not expose downloads', async () => {
  for (const status of ['pending', 'failed', 'expired']) {
    response = { status, files }
    assert.deepEqual(await purchase({}), { status, files: [] })
  }
})

test('invalid purchase tokens are rejected', async () => {
  token = 'invalid'
  await assert.rejects(purchase({}), { statusCode: 400 })
})

test('the original order variant is retained for thank-you content selection', async () => {
  token = 'a'.repeat(64)
  response = { status: 'paid', variant: 'free', files }
  assert.deepEqual(await purchase({}), { status: 'paid', variant: 'free', files })
})
