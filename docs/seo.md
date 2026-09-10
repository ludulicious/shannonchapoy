# SEO and social sharing

The site uses server rendering so page content and metadata are present in the initial HTML. Each content page has a title, description, Open Graph tags, Twitter large-image card, and canonical URL through `app/composables/usePageSeo.ts`.

The production origin is `https://shannonchapoy.com`. The homepage section routes share the homepage canonical. The sitemap lists the six canonical pages, and robots.txt points to it. Update the sitemap when adding pages. Canonical handling follows [Google's guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Missing pages return HTTP 404 and `noindex, follow`. The homepage has one H1; the About heading is H2.

## Verification

The production build and formatting checks passed. Local production HTTP checks passed for all six pages, four homepage section routes, the 404 response, robots.txt, sitemap.xml, and the social image. HTML checks confirmed descriptions, social tags, canonical links, one H1 per page, and no content-loading error messages.

Deployment and live search indexing were not checked. After deployment, verify the public image URL and submit the sitemap through Google Search Console. Social platforms may cache earlier previews.

## Open Graph image

Asset: `public/images/og-shannon-chapoy.jpg`, 1200 × 630 JPEG. Created with the built-in image generation tool using `public/images/hero-flowers-butterflies.jpg` as a reference, then resized and compressed for delivery.

Generation prompt:

> Create a finished Open Graph social sharing card for Shannon Chapoy's self-love coaching website. Use the reference floral butterfly photograph as the full-bleed background, adapting it to a wide 1200 x 630 landscape composition. Elegant deep plum background, purple flowers and pale butterflies at outer edges. Keep a generous quiet dark center with crisp perfectly legible ivory typography. Center exact large elegant serif text 'Shannon Chapoy'. Below in smaller clean sans serif text 'Your greatest love lives within you'. Below that a small line 'Self-love & relationship coaching'. At bottom center small 'shannonchapoy.com'. No extra text, borders, badges, or logos. All text safely inset at least 100 pixels. Produce a polished premium social preview image, 1200 x 630.
