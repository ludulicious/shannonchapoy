import { defineCollection, defineContentConfig, z, type EditorOptions } from '@nuxt/content'

// Marpos Studio extends Nuxt Content's editor metadata with collection relationships.
const reference = (collection: 'faqs') =>
  z
    .string()
    .min(1)
    .editor({ input: 'reference', collection, valueField: 'slug' } as unknown as EditorOptions)

const itemName = z
  .string()
  .trim()
  .optional()
  .editor({ label: 'Name' })
  .describe('Internal name shown in Studio; does not change the website heading or URL')

const previewLink = z
  .string()
  .trim()
  .regex(/^(?:$|\/(?!\/)[^\\\s]*)$/, 'Use an internal website path such as /about or /#about')
  .optional()
  .editor({ input: 'internal-link', label: 'Preview link' } as unknown as EditorOptions)
  .describe('Website page or section opened by Studio preview; does not change the slug or public URL')

const pageSchema = z.object({
  pageName: itemName,
  previewUrl: previewLink,
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
    .array(z.string())
    .default([])
    .describe('Include all active FAQs with these category names; use the same names as on the FAQ items')
})

export default defineContentConfig({
  collections: {
    homepage_hero: defineCollection({
      type: 'page',
      source: 'homepage/1.hero.md',
      schema: z.object({
        pageName: itemName,
        previewUrl: previewLink,
        title: z
          .string()
          .min(1)
          .editor({ label: 'Heading' })
          .describe('Main heading at the top of the homepage; edit the text underneath in Story'),
        image: z.string().min(1).editor({ input: 'media' }).describe('Desktop background image'),
        mobileImage: z.string().min(1).editor({ input: 'media' }).describe('Mobile background image'),
        buttonLabel: z.string().min(1).describe('Offerings button shown when no offering is featured')
      })
    }),
    homepage_offerings: defineCollection({
      type: 'page',
      source: 'homepage/2.offerings.md',
      schema: z.object({
        pageName: itemName,
        previewUrl: previewLink,
        title: z
          .string()
          .min(1)
          .editor({ label: 'Heading' })
          .describe('Section heading; edit the introduction in Story'),
        featuredHeading: z.string().min(1).describe('Alternate heading when the hero already features an offering'),
        detailsLabel: z.string().min(1).describe('Details link label on each offering card')
      })
    }),
    homepage_about: defineCollection({
      type: 'page',
      source: 'homepage/3.about.md',
      schema: z.object({
        pageName: itemName,
        previewUrl: previewLink,
        title: z.string().default('About Shannon').editor({ hidden: true }),
        image: z.string().min(1).editor({ input: 'media' }).describe('Portrait of Shannon'),
        imageAlt: z.string().min(1).describe('Portrait description for accessibility'),
        storyLinkLabel: z.string().min(1).describe('Link to the full story, edited in this block’s Story tab'),
        summaryLinkLabel: z
          .string()
          .min(1)
          .default('Show summary')
          .describe('Button to return from the full story to the summary'),
        actionLabel: z.string().min(1).describe('Button linking to offerings')
      })
    }),
    homepage_faq: defineCollection({
      type: 'page',
      source: 'homepage/4.faq.md',
      schema: pageSchema.pick({ pageName: true, previewUrl: true, title: true, faqSlugs: true, faqCategories: true })
    }),
    homepage_settings: defineCollection({
      type: 'data',
      source: 'homepage/5.settings.yml',
      schema: pageSchema.pick({
        pageName: true,
        previewUrl: true,
        title: true,
        description: true,
        seo: true,
        profile: true
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/{contact,privacy,terms}.md', prefix: '/' },
      schema: pageSchema.omit({ structuredData: true, profile: true, faqSlugs: true, faqCategories: true })
    }),
    offerings: defineCollection({
      type: 'data',
      source: { include: 'offerings/*.yml', prefix: '/specials', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        pageName: itemName,
        previewUrl: previewLink,
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
        faqSlugs: z
          .array(reference('faqs'))
          .default([])
          .describe('Select individual questions to display below this offering')
      })
    }),
    faqs: defineCollection({
      type: 'page',
      source: { include: 'faqs/*.md', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        pageName: itemName,
        previewUrl: previewLink,
        title: z.string().min(1).describe('The question shown to visitors'),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .describe('Unique FAQ slug used by pages and offerings'),
        categories: z
          .array(z.string())
          .default([])
          .describe('Category names for organizing FAQs, like categories in the media library'),
        order: z.number().int().nonnegative().default(100).describe('Display order, lowest first'),
        isActive: z.boolean().default(true).describe('Make this FAQ available on pages and offerings')
      })
    }),
    media: defineCollection({
      type: 'data',
      source: { include: 'media/*.yml', exclude: ['**/.navigation.yml'] },
      schema: z.object({
        pageName: itemName,
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
      schema: pageSchema.omit({ profile: true, faqCategories: true })
    })
  }
})
