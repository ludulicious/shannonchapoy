import { z } from 'zod'
import { contactEmail, contactSchema } from '../../shared/contact.ts'

const attempts = new Map<string, { count: number; expires: number }>()

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  // Use the connection IP; do not trust client-supplied forwarding headers.
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()
  for (const [key, value] of attempts) {
    if (value.expires <= now) {
      attempts.delete(key)
    }
  }
  const attempt = attempts.get(ip) || { count: 0, expires: now + 15 * 60 * 1000 }
  if (attempt.count >= 5) {
    setHeader(event, 'Retry-After', String(Math.ceil((attempt.expires - now) / 1000)))
    throw createError({ statusCode: 429, statusMessage: 'Please try again later' })
  }
  attempt.count++
  attempts.set(ip, attempt)

  const parsed = contactSchema.safeParse(await readBody(event))
  if (!parsed.success || parsed.data.honeypot.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Please check your form details' })
  }
  const data = parsed.data
  const config = useRuntimeConfig(event)
  const hostnames = new Set(
    config.turnstileHostnames
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )
  const production = process.env.NODE_ENV === 'production'
  if (
    !config.resendApiKey ||
    !config.resendFromEmail ||
    !config.turnstileSecretKey ||
    !config.public.turnstileSiteKey ||
    hostnames.size === 0 ||
    !z.string().email().safeParse(config.contactTo).success ||
    (production &&
      (/^[123]x0+/.test(config.turnstileSecretKey) ||
        /^[123]x0+/.test(config.public.turnstileSiteKey) ||
        [...hostnames].some((hostname) => ['localhost', '127.0.0.1', '::1'].includes(hostname))))
  ) {
    throw createError({ statusCode: 503, statusMessage: 'The contact form is temporarily unavailable' })
  }

  let verification: { success: boolean; action?: string; hostname?: string }
  try {
    verification = await $fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: config.turnstileSecretKey, response: data.turnstileToken }),
      timeout: 10000,
      retry: 0
    })
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Verification is temporarily unavailable' })
  }
  if (
    verification.success !== true ||
    verification.action !== 'contact' ||
    !verification.hostname ||
    !hostnames.has(verification.hostname)
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Please complete the security check again' })
  }

  try {
    const result = await $fetch<{ id?: string }>('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: contactEmail(data, config.resendFromEmail, config.contactTo),
      timeout: 15000,
      retry: 0
    })
    if (!result.id) {
      throw new Error('Email was not accepted')
    }
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Your message could not be sent. Please try again.' })
  }
  return { success: true }
})
