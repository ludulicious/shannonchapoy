import { queryCollection } from '@nuxt/content/server'
import { z } from 'zod'
import { resolveThankYouCopy } from '../../../shared/utils/thankYou'

const querySchema = z.object({
  slug: z.string().min(1).max(200),
  variant: z.enum(['free', 'paid']),
  locale: z.enum(['en', 'nl']).default('en')
})
export default defineEventHandler(async (event) => {
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer'
  })
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid thank-you content request' })
  }
  const { slug, variant, locale } = parsed.data
  const documents = await queryCollection(event, 'thankYou').all()
  return resolveThankYouCopy(documents, slug, variant, locale)
})
