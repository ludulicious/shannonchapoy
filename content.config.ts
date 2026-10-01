import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string().min(1).describe('Page title'),
        description: z.string().min(1).describe('Short page summary'),
        seo: z
          .object({
            title: z.string().min(1).describe('Search and social preview title'),
            description: z.string().min(1).describe('Search and social preview description'),
            image: z.string().describe('Social image: site-relative path or HTTPS URL').optional(),
            imageAlt: z.string().describe('Description of the social image').optional(),
            canonical: z
              .string()
              .describe('Canonical URL: site-relative path or HTTPS URL; omit for automatic URL')
              .optional(),
            noindex: z.boolean().describe('Hide this page from search results').optional()
          })
          .optional(),
        structuredData: z
          .object({
            type: z.enum(['WebPage', 'Service']).describe('Page or coaching service'),
            name: z.string().describe('Service name, matching the visible page').optional(),
            serviceType: z.string().describe('Kind of coaching or workshop').optional(),
            audience: z.string().describe('Who this service is for').optional()
          })
          .optional(),
        profile: z
          .object({
            name: z.string().min(1),
            jobTitle: z.string().min(1),
            description: z.string().min(1),
            sameAs: z.array(z.string().url()).describe('Verified public profile URLs').optional()
          })
          .describe('Coach identity on the homepage')
          .optional(),
        faq: z
          .array(
            z.object({
              question: z.string().min(1),
              answer: z.string().min(1)
            })
          )
          .describe('Questions and answers displayed on this page')
          .optional()
      })
    })
  }
})
