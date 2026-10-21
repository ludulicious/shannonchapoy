# Editing thank-you text in Marpos Studio

Studio discovers the **thankYou** collection from the website's Nuxt Content schema. No Studio app update is required.

## Defaults

Open the website in Marpos Studio, choose the **thankYou** collection, and edit:

- `free`: free-order English text.
- `paid`: paid-order English text, also used for orders invoiced later.
- `free-nl` and `paid-nl`: the Dutch equivalents.

The editable fields are the small status label, heading, message text, additional information and download-section heading. Message text supports line breaks; it is displayed as plain text. Download links, payment state and invoice information stay controlled by the portal.

## Product-specific text

Create a document in this collection with a unique filename. Set **locale**, **variant** and the exact **productSlug** from the product's URL. Enter only the fields you want to override; blank fields inherit that language's free/paid default. Keep one default for each language/variant, and one override for each slug/language/variant.

A product can have separate free and paid overrides. This matters for temporary free offers. The portal uses the order's actual total, rather than the product's current price, when selecting the variant.

## Preview

Set **previewSlug** on a default document if you want a product preselected; it does not restrict the default to that product. Product-specific documents use **productSlug** automatically.

Use Studio's **Preview** action. The preview page has a product-slug field and a free/paid selector. Enter a published product's slug and choose **Preview product**. Unlisted products can be previewed using their exact slug. The preview uses the portal's real receipt component, branding and product information. A visible preview notice identifies it; orders, payments and file downloads are disabled. No customer data or purchase token is needed.

Studio's temporary local content preview is sent directly to the preview frame, so text edits can be reviewed before publishing. To make text changes visible to customers, save and publish the website through Studio's normal workflow.

## One-time integration setup

Deploy the website and a portal version supporting thank-you content and the preview route. In the portal's **Products → Settings → Styles**, set **Thank-you content URL** to:

`https://shannonchapoy.com/api/thank-you/content`

The website preview uses `https://lovecircle.shannonchapoy.com` by default. Set `NUXT_PUBLIC_PORTAL_URL` if the portal moves; this public URL never contains an API key. Keep `NUXT_PORTAL_URL` and `NUXT_PORTAL_API_KEY` configured for the website's product pages.

The public JSON endpoint accepts `slug`, `variant=free|paid`, and `locale=en|nl`, and returns only resolved text fields. The portal sends no purchase token, cookies or referring purchase URL to it. Missing, invalid or unreachable content falls back to the portal's standard localized wording.
