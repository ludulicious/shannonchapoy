import assert from 'node:assert/strict'
import test, { beforeEach } from 'node:test'
import { contactFieldsSchema } from '../shared/contact.ts'
import { isLandingPath } from '../app/utils/landingRoutes.ts'

let config
let body
let verification
let delivery
let calls
let headers
let ip = 0
Object.assign(globalThis, {
  defineEventHandler: (handler) => handler,
  useRuntimeConfig: () => config,
  readBody: async () => body,
  getRequestIP: () => String(ip),
  setHeader: (_event, key, value) => headers.set(key, value),
  createError: (data) => Object.assign(new Error(data.statusMessage), data),
  $fetch: async (url, options) => {
    calls.push({ url, options })
    const response = url.includes('siteverify') ? verification : delivery
    if (response instanceof Error) {
      throw response
    }
    return response
  }
})
const { default: submit } = await import('../server/api/contact.post.ts')

beforeEach(() => {
  ip++
  headers = new Map()
  calls = []
  config = {
    resendApiKey: 'private-resend-key',
    resendFromEmail: 'Shannon <sender@example.com>',
    contactTo: 'hello@shannonchapoy.com',
    turnstileSecretKey: 'private-turnstile-key',
    turnstileHostnames: 'shannonchapoy.com,www.shannonchapoy.com',
    public: { turnstileSiteKey: 'public-widget-key' }
  }
  body = {
    name: ' Test Visitor ',
    email: ' visitor@example.com ',
    phone: '',
    subject: 'A session with Shannon',
    message: 'I would like to know more about your sessions.',
    consent: true,
    honeypot: '',
    turnstileToken: 'valid-token'
  }
  verification = { success: true, action: 'contact', hostname: 'shannonchapoy.com' }
  delivery = { id: 'accepted-email-id' }
})

test('contact is a separate page while existing section links stay on the landing page', () => {
  assert.equal(isLandingPath('/contact'), false)
  for (const path of ['/', '/about', '/offerings', '/philosophy']) {
    assert.equal(isLandingPath(path), true)
  }
})

test('accepted submissions verify before delivery and use only configured recipients', async () => {
  body.to = 'untrusted@example.com'
  assert.deepEqual(await submit({}), { success: true })
  assert.equal(calls.length, 2)
  assert.equal(calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify')
  assert.equal(calls[0].options.body.get('secret'), config.turnstileSecretKey)
  assert.equal(calls[0].options.body.get('response'), body.turnstileToken)
  assert.equal(calls[1].url, 'https://api.resend.com/emails')
  assert.deepEqual(calls[1].options.body.to, ['hello@shannonchapoy.com'])
  assert.equal(calls[1].options.body.reply_to, 'visitor@example.com')
  assert.equal(calls[1].options.body.from, config.resendFromEmail)
  assert.match(calls[1].options.body.text, /Name: Test Visitor\n/)
  assert.equal(calls[1].options.body.text.includes('valid-token'), false)
  assert.equal(calls[1].options.retry, 0)
  assert.equal(headers.get('Cache-Control'), 'no-store')
})

for (const [field, value] of [
  ['name', ' '],
  ['email', 'invalid'],
  ['phone', '1'.repeat(101)],
  ['subject', 'Injected\r\nBcc: attacker@example.com'],
  ['message', 'Short'],
  ['message', 'x'.repeat(10001)],
  ['consent', false],
  ['turnstileToken', ''],
  ['turnstileToken', 'x'.repeat(2049)],
  ['honeypot', 'spam']
]) {
  test(`invalid ${field} is blocked before any external request (${String(value).length} chars)`, async () => {
    body[field] = value
    await assert.rejects(submit({}), { statusCode: 400 })
    assert.equal(calls.length, 0)
  })
}

test('client validation accepts optional phone and reports missing consent', () => {
  assert.equal(contactFieldsSchema.safeParse(body).success, true)
  const result = contactFieldsSchema.safeParse({ ...body, consent: false })
  assert.equal(result.success, false)
  assert.equal(result.error.issues[0].path[0], 'consent')
})

for (const rejected of [
  { success: false, 'error-codes': ['timeout-or-duplicate'] },
  { success: true, hostname: 'shannonchapoy.com', action: 'booking' },
  { success: true, hostname: 'attacker.example', action: 'contact' },
  { success: true, action: 'contact' }
]) {
  test(`unverified action/host/token never sends email: ${JSON.stringify(rejected)}`, async () => {
    verification = rejected
    await assert.rejects(submit({}), { statusCode: 400 })
    assert.equal(calls.length, 1)
  })
}

test('missing server configuration fails closed', async () => {
  config.resendApiKey = ''
  await assert.rejects(submit({}), { statusCode: 503 })
  assert.equal(calls.length, 0)
})

test('production refuses test credentials and local hostnames', async () => {
  const previous = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  try {
    config.turnstileSecretKey = '1x0000000000000000000000000000000AA'
    await assert.rejects(submit({}), { statusCode: 503 })
    config.turnstileSecretKey = 'private-turnstile-key'
    config.public.turnstileSiteKey = '1x00000000000000000000AA'
    await assert.rejects(submit({}), { statusCode: 503 })
    config.public.turnstileSiteKey = 'public-widget-key'
    config.turnstileHostnames = 'localhost'
    await assert.rejects(submit({}), { statusCode: 503 })
    assert.equal(calls.length, 0)
  } finally {
    if (previous === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = previous
    }
  }
})

test('Cloudflare failure does not send mail or disclose provider errors', async () => {
  verification = new Error('upstream private details')
  await assert.rejects(submit({}), { statusCode: 503, statusMessage: 'Verification is temporarily unavailable' })
  assert.equal(calls.length, 1)
})

test('delivery failure cannot return a false success', async () => {
  delivery = new Error('upstream private details')
  await assert.rejects(submit({}), { statusCode: 502 })
  delivery = {}
  await assert.rejects(submit({}), { statusCode: 502 })
})

test('rate limit blocks repeated submissions and allows retry after the window', async (context) => {
  let now = Date.now()
  context.mock.method(Date, 'now', () => now)
  body.turnstileToken = ''
  for (let i = 0; i < 5; i++) {
    await assert.rejects(submit({}), { statusCode: 400 })
  }
  await assert.rejects(submit({}), { statusCode: 429 })
  assert.equal(headers.get('Retry-After'), '900')
  assert.equal(calls.length, 0)
  now += 15 * 60 * 1000
  body.turnstileToken = 'new-token'
  assert.deepEqual(await submit({}), { success: true })
})
