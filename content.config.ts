import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    thankYou: defineCollection({
      type: 'page',
      source: 'thank-you-texts/**/*.md',
      schema: z.object({
        title: z.string().min(1).describe('Name in Marpos Studio'),
        locale: z.enum(['en', 'nl']).describe('Language'),
        variant: z.enum(['free', 'paid']).describe('Free or paid order'),
        productSlug: z.string().max(200).default('').describe('Exact product slug; leave empty for the default'),
        previewSlug: z
          .string()
          .max(200)
          .default('')
          .describe('Product slug to show in Studio preview; does not change which products use this text'),
        statusLabel: z.string().max(120).default('').describe('Small confirmation label'),
        heading: z.string().max(240).default('').describe('Main thank-you heading'),
        messageText: z.string().max(4000).default('').describe('Thank-you message; blank fields inherit the default'),
        helpText: z.string().max(2000).default('').describe('Additional information'),
        downloadsHeading: z.string().max(120).default('').describe('Heading above download links')
      })
    }),
    content: defineCollection({
      type: 'page',
      source: { include: '**/*.md', exclude: ['thank-you-texts/**'] },
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
