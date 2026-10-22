# SEO and AI discoverability

## Audit and implementation

The site pre-renders its seven canonical pages and three homepage section URLs. Content is available in HTML before JavaScript loads, the homepage has one H1, images have dimensions, and decorative images have empty alt text. The three section URLs represent the same homepage and intentionally share its canonical. `/contact` is a separate page with its own canonical and sitemap entry. Robots allows crawling; purchase confirmation pages and missing pages are excluded from indexing.

Previously, search descriptions, titles, and social previews were hardcoded in Vue. They now come from Markdown frontmatter, with reactive metadata shared by search, Open Graph, and Twitter. All canonical pages have explicit frontmatter. The homepage settings live in `content/index.md`; `/about`, `/offerings`, and `/philosophy` use those same settings. The contact page uses `content/contact.md`. `about.md` and `pj-circle-intro.md` are content fragments, not separate canonical pages.

JSON-LD describes the website, Shannon as a Person, each page, and the three coaching services. Frontmatter FAQs are rendered visibly and used for FAQPage structured data. They provide direct answers grounded in existing content. Google generally restricts FAQ rich results to authoritative government and health websites; this markup does not promise a rich result. No prices, credentials, addresses, ratings, or external profiles were invented.

Catalog offering pages now also receive canonical URLs and social metadata from their portal-managed title, summary, and thumbnail. Purchase pages stay `noindex, nofollow`. Catalog content continues to be edited in the customer portal.

[Google's AI guidance](https://developers.google.com/search/docs/appearance/ai-features) recommends the same fundamentals as SEO: crawlable, helpful text, internal links, and structured data that matches visible content. It does not require a special AI metadata format or an `llms.txt` file. Schema and FAQs help describe content; they do not guarantee indexing, rankings, or AI citations.

## Editing in Marpos Studio

The explicit Zod schema in `content.config.ts` exposes all fields as labelled Studio editors, including optional objects, booleans, lists, and the structured-data type selector. No Studio code change or Nuxt Studio installation is needed. After these website changes reach the live branch, use **Get latest website** in Marpos Studio to refresh the content and schema, then open the page's properties.

| Property                                            | Effect                                                                                                |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `title`, `description`                              | Page identity and fallback metadata                                                                   |
| `seo.title`, `seo.description`                      | Search title/description and social preview text                                                      |
| `seo.image`, `seo.imageAlt`                         | Social image path/HTTPS URL and accessible description; omitted images use the existing card          |
| `seo.canonical`                                     | Preferred path or HTTPS URL; omitted values use the route, with homepage sections consolidated to `/` |
| `seo.noindex`                                       | Exclude the page from search indexing                                                                 |
| `structuredData.type`                               | `WebPage` or `Service`                                                                                |
| `structuredData.name`, `serviceType`, `audience`    | Service facts that must match the visible content                                                     |
| `profile.name`, `jobTitle`, `description`, `sameAs` | Homepage coach identity; only add verified public profile URLs                                        |
| `faq[].question`, `faq[].answer`                    | Visible FAQ content and corresponding structured data                                                 |

Keep descriptions accurate and concise. Change the visible story as well when changing service facts. Edit `content/`, which Nuxt and Studio read; the old `public/content/` copies are not the site's content source. Rebuild after publishing content changes.

The sitemap is generated from the seven implemented canonical routes and their frontmatter. It excludes pages marked `noindex`, excludes off-site canonicals, and deduplicates URLs. New standalone routes still need to be implemented and added to the route list; creating arbitrary Markdown files does not create page templates here.

## Content issues requiring owner review

- PJ Circle's introduction says biweekly gatherings; its main story says weekly sessions for four weeks. Confirm the current schedule before changing either claim. FAQ answers deliberately omit the conflicting schedule and price.
- The terms contain unfinished cancellation, package expiry, session format, and governing-law placeholders. These reduce trust and need confirmed business information.
- Privacy text lists analytics and service providers as examples. Confirm it matches the services actually used.
- Shannon's story uses relative ages and dates that will become stale; consider confirmed calendar dates when updating it.
- Additional first-hand details about the coaching approach, qualifications, formats, and outcomes would make the content more useful and distinctive. Add only confirmed facts and permissioned testimonials.

## Verification

The production build passed. Generated HTML checks passed for all ten page URLs: search and social metadata, canonical URLs, parseable JSON-LD, visible FAQ answers, and one H1. The sitemap contained all six canonical URLs. Marpos Studio's own `scripts/inspect-project.mjs` recognized every new field and nested editor type. Additional checks passed for reactive metadata overrides, noindex, invalid image/URL fallbacks, canonical query removal, and JSON-LD script escaping. Live website access and search indexing could not be checked in this environment. After deployment, use Search Console and validate representative URLs with the Rich Results Test; social platforms may cache older cards.

## Open Graph image

Default asset: `public/images/og-shannon-chapoy.jpg`, 1200 × 630 JPEG. Custom social images should ideally have the same aspect ratio; their dimensions are not guessed. The existing image was created from the floral butterfly hero reference.
