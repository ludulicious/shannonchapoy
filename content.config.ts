import { defineCollection, defineContentConfig, z, type EditorOptions } from '@nuxt/content'

// Marpos Studio extends Nuxt Content's editor metadata with collection relationships.
const reference = (collection: 'faqs' | 'faq_categories') =>
  z
    .string()
    .min(1)
    .editor({ input: 'reference', collection, valueField: 'slug' } as unknown as EditorOptions)

const pageSchema = z.object({
  title: z.string().min(1).describe('Page title'),
  description: z.string().min(1).describe('Short page summary'),
  seo: z
    .object({
      title: z.string().min(1).describe('Search and social preview title'),
      description: z.string().min(1).describe('Search and social preview description'),
      image: z
        .string()
        .editor({ input: 'media' })
        .describe('Choose a social preview image from the media library')
        .optional(),
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
  faqSlugs: z.array(reference('faqs')).default([]).describe('Reusable FAQ slugs to display on this page'),
  faqCategories: z
    .array(reference('faq_categories'))
    .default([])
    .describe('Include all active FAQs in these category slugs')
})

export default defineContentConfig({
  collections: {
    homepage_hero: defineCollection({
      type: 'data',
      source: 'homepage/hero/content.yml',
      schema: pageSchema.extend({
        heading: z.string().min(1).describe('Main heading at the top of the homepage'),
        intro: z.string().min(1).editor({ input: 'textarea' }).describe('Text below the hero heading'),
        image: z.string().min(1).editor({ input: 'media' }).describe('Desktop background image'),
        mobileImage: z.string().min(1).editor({ input: 'media' }).describe('Mobile background image'),
        buttonLabel: z.string().min(1).describe('Offerings button shown when no offering is featured')
      })
    }),
    homepage_about: defineCollection({
      type: 'page',
      source: 'homepage/about/content.md',
      schema: z.object({
        title: z.string().min(1).describe('Editor label for this homepage block'),
        description: z.string().min(1).describe('Editor summary of this block'),
        image: z.string().min(1).editor({ input: 'media' }).describe('Portrait of Shannon'),
        imageAlt: z.string().min(1).describe('Portrait description for accessibility'),
        storyLinkLabel: z.string().min(1).describe('Link to the full story, edited in this block’s Story tab'),
        actionLabel: z.string().min(1).describe('Button linking to offerings')
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/{contact,privacy,terms}.md', prefix: '/' },
      schema: pageSchema
    }),
    offerings: defineCollection({
      type: 'data',
      source: { include: 'offerings/*.yml', prefix: '/specials', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1).describe('Internal label; the public title comes from the portal'),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .editor({ label: 'Page and product slug' })
          .describe(
            'One slug for both the portal product and its website page. Use the exact published portal slug: intake opens /specials/intake.'
          ),
        order: z.number().int().nonnegative().default(100).describe('Display order, lowest first'),
        isActive: z.boolean().default(false).describe('Include this offering in the public catalog'),
        isFeatured: z
          .boolean()
          .default(false)
          .describe('Feature on the homepage; the first available active featured offering wins'),
        faqSlugs: z.array(reference('faqs')).default([]).describe('Reusable FAQ slugs to display below this offering'),
        faqCategories: z
          .array(reference('faq_categories'))
          .default([])
          .describe('Include all active FAQs in these category slugs')
      })
    }),
    faqs: defineCollection({
      type: 'data',
      source: { include: 'faqs/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1).describe('The question shown to visitors'),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .describe('Unique FAQ slug used by pages and offerings'),
        answer: z.string().min(1).describe('Answer shown to visitors'),
        categories: z
          .array(reference('faq_categories'))
          .default([])
          .describe('Category slugs from the FAQ categories collection'),
        order: z.number().int().nonnegative().default(100).describe('Display order, lowest first'),
        isActive: z.boolean().default(true).describe('Make this FAQ available on pages and offerings')
      })
    }),
    faq_categories: defineCollection({
      type: 'data',
      source: { include: 'faq-categories/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1).describe('Category heading shown above its questions'),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .describe('Unique category slug used by FAQs, pages, and offerings'),
        order: z.number().int().nonnegative().default(100).describe('Category display order, lowest first')
      })
    }),
    media: defineCollection({
      type: 'data',
      source: { include: 'media/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        title: z.string().min(1).describe('Image name in the library'),
        image: z.object({
          src: z.string().min(1).editor({ input: 'media' }),
          alt: z.string().describe('Describe informative images; leave empty for decorative artwork')
        }),
        thumbnail: z
          .object({
            src: z.string().min(1).editor({ input: 'media' }),
            alt: z.string()
          })
          .optional(),
        categories: z.array(z.string()).default([]),
        credit: z.string().optional(),
        visible: z.boolean().default(true),
        order: z.number().int().nonnegative().default(100)
      })
    }),
    archived_programs: defineCollection({
      type: 'page',
      source: {
        include: 'archive/programs/{pj-circle,pj-circle-intro,one-on-one-love-coaching,art-of-dating-yourself}.md',
        prefix: '/'
      },
      schema: pageSchema
    })
  }
})
