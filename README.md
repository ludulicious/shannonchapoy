# Shannon Chapoy Website

Personal website for Shannon Chapoy built with Nuxt 4, Nuxt Content, and Tailwind CSS.

## Tech Stack

- **Nuxt 4** - Vue.js framework with modern app directory structure
- **Nuxt Content** - Markdown content management
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Lucide Vue Next** - Icon library

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server:

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
pnpm build
```

The build pre-renders the homepage, its three section URLs, the dedicated contact page, all three program pages, and both legal pages into `.output/public/` as HTML with content and SEO metadata. The explicit route list is in `nuxt.config.ts`; linked pages are also discovered during pre-rendering. Rendering errors fail the build.

The Docker build runs this same command. Run `.output/server/index.mjs` in production: it serves the generated pages and keeps the form-validation API and proper 404 responses available. Rebuild after changing Markdown content.

`pnpm generate` is available for a static-only export, but static hosting alone cannot run the contact submission or form-validation APIs.

## Contact form

`/contact` is a standalone page with a native form, based on the Amstelgospel form flow. The homepage's contact prompt and navigation link open this page. Its title, description, and SEO fields are in `content/pages/contact.md`.

Copy the contact settings from `.env.example` into your local `.env` and fill them in. In production, supply them to the Nuxt server environment (for example, Docker `--env-file`); Node does not load `.env` automatically. Also set the public Turnstile site key when building, since `/contact` is pre-rendered. Rebuild after changing it.

- `NUXT_RESEND_API_KEY`: Resend key with permission to send email.
- `NUXT_RESEND_FROM_EMAIL`: sender address on a domain verified in Resend, optionally `Shannon Chapoy <verified-sender@your-domain>`.
- `NUXT_CONTACT_TO`: receiving address; defaults to `hello@shannonchapoy.com`.
- `NUXT_PUBLIC_TURNSTILE_SITE_KEY`: defaults to the existing widget's public site key, `0x4AAAAAAFiE_t8kBJrdW5tA`. Override it when testing locally or switching widgets.
- `NUXT_TURNSTILE_SECRET_KEY`: private secret for that widget, kept server-only.
- `NUXT_TURNSTILE_HOSTNAMES`: exact allowed hostnames, comma-separated; defaults to `shannonchapoy.com,www.shannonchapoy.com`. Add these domains to the widget in Cloudflare too.

The server verifies the token's success, `contact` action, and hostname before sending through Resend. The visitor's email is the reply-to address; recipients are controlled only by server configuration. Missing settings prevent delivery. The form preserves the visitor's message on errors and resets the security check after each submission attempt, since Turnstile tokens are single-use. A missing public site key displays a direct email alternative.

Input lengths, consent, and a hidden spam field are checked on the server. Submissions are limited to five attempts per 15 minutes per connection IP per server process. Forwarded IP headers are not trusted. Configure trusted rate limiting at your reverse proxy for multi-instance deployments.

For local development, use a widget allowing `localhost` with `NUXT_TURNSTILE_HOSTNAMES=localhost`, or Cloudflare's documented test keys. Production rejects test keys and loopback hostnames. Automated server tests mock Cloudflare and Resend, including rejected/expired tokens, wrong actions/hosts, and delivery failures; they never send email.

The existing production widget requires its matching secret in `NUXT_TURNSTILE_SECRET_KEY`; a site key alone cannot verify submissions. Keep that secret in the ignored local `.env` or your production secret store. Local test keys must be replaced as a pair when switching to the real widget. The production hostname allowlist must contain only the production frontend domains.

References: [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/), and [Resend email API](https://resend.com/docs/api-reference/emails/send-email).

## Docker Deployment

### Build Docker Image

```bash
docker build -t shannon-chapoy .
```

### Run with Docker

```bash
docker run -p 3000:3000 shannon-chapoy
```

### Using Docker Compose

```bash
docker-compose up
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure (Nuxt 4)

Nuxt 4 uses a preferred folder structure with the `app/` directory:

```
├── app/              # Main application directory
│   ├── assets/       # CSS and static assets
│   ├── components/   # Vue components (auto-imported)
│   ├── composables/  # Vue composables (auto-imported)
│   ├── layouts/      # Layout components
│   ├── pages/        # File-based routing
│   ├── plugins/      # Vue plugins
│   ├── utils/        # Utility functions
│   └── app.vue       # Root component
├── server/           # Server-side code
├── shared/           # Shared code between client and server
├── content/          # Markdown content files (Nuxt Content)
├── public/           # Static files (favicons, images)
└── nuxt.config.ts    # Nuxt configuration
```

## Content Management

| Studio collection      | What to edit                                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Homepage Hero**      | **Details**: heading, desktop/mobile artwork, and fallback button. **Story**: Markdown below the main heading.                                        |
| **Homepage Offerings** | **Details**: section headings and card details-link label. **Story**: introduction above the product cards.                                           |
| **Homepage FAQ**       | Heading and question/category selection in Details; optional introduction in Story.                                                                   |
| **Homepage Settings**  | Homepage search/social metadata and coach profile.                                                                                                    |
| **Homepage About**     | Homepage introduction in the **Summary** Markdown tab; full biography revealed by **Read my story** in **Story**; portrait and buttons in **Details** |
| **Pages**              | Contact page and the two legal pages                                                                                                                  |
| **Offerings**          | Portal product slugs, order, active/featured settings, and related FAQs                                                                               |
| **Media**              | Upload, crop, organize, and choose website images                                                                                                     |
| **FAQs**               | Reusable questions, answers, and category headings                                                                                                    |
| **Archived Programs**  | Older program pages and PJ Circle introduction, kept separately for existing direct links                                                             |

Open **Home** in Studio to find the five homepage entries in order: Hero, Offerings, About Shannon, FAQ section, and Homepage Settings. Each entry retains its own fields and writing tabs. Pages and Archived Programs contain only the existing implemented pages, so Studio does not offer to add unsupported pages. Creating a new page is not needed to change the homepage. The catalog itself is edited in Offerings and the portal. Older program URLs still work, but their records are outside the active page list; archiving here organizes the editor rather than unpublishing existing URLs. Publishing changes requires the usual website rebuild.

Markdown files in the `content/` directory are automatically available via Nuxt Content. The page templates use `<ContentRenderer>` to render Markdown. Search metadata, social previews, and structured service information are editable in page frontmatter through Marpos Studio. FAQs and offering selection have their own collections. FAQ categories are stored directly on each question. Homepage copy lives in **Homepage Hero**, **Homepage Offerings**, and **Homepage About**. SEO and profile settings live in **Homepage Settings**; FAQ selection lives in **Homepage FAQ**. See [SEO and AI discoverability](docs/seo.md) for the field reference and audit findings.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate` - Generate static site
- `pnpm preview` - Preview production build
- `pnpm format` - Format files and apply ESLint fixes
- `pnpm format:check` - Check formatting and ESLint rules
- `pnpm lint` - Check ESLint rules

Run `pnpm format` after every batch of changes.

## Migration Notes

This project has been migrated from React to Nuxt 4 using the preferred folder structure. All components, composables, layouts, and pages are organized within the `app/` directory for better maintainability and scalability.

## Unlisted portal offerings

`/specials/:slug` loads a single published product through the server-side `/api/catalog/products/:slug` proxy. This allows unlisted portal products to use the existing detail page without appearing in the offerings catalog. The portal generates the unguessable slug; no separate share token is used. Anyone with the URL can view and purchase it.

Product detail responses and pages use `private, no-store`; unlisted pages are marked `noindex`. Keep these URLs out of navigation and sitemaps. Configure the existing portal URL and catalog API key on the server, and deploy portal unlisted-product support before deploying this website change.

## Managing offerings and FAQs in Marpos Studio

After deploying this code, use **Get latest website** in Studio to load the new collections. The collections use local YAML records with explicit schemas; filters and preview destinations are configured for Studio. Data collections open Details without a story editor.

### Offerings

Open **Offerings** to manage which portal products appear on the website. The existing public products, `intake` and `discover-your-pathway`, have been added already.

- **Title** is an internal label. **Page and product slug** is one shared value for the portal product and the website page. It must exactly match a published portal product slug: `intake` selects that product and opens `/specials/intake`. There is no separate page slug or product slug to maintain. Studio derives offering addresses from the collection’s `/specials` prefix and dynamic page; use its Slug control to keep the filename and stored slug together when changing the value. Changing this value changes both the product lookup and the detail URL; it does not rename the product in the portal.
- **Order** controls display order, lowest first, independent of price. Reorder in Studio or edit the number.
- **Is active** includes the product in the website catalog. New records default to inactive until you enable them. Products without a record are not listed.
- **Is featured** selects the homepage hero offering. Mark one active offering as featured. If several qualify, the first available one in saved order wins. If none qualifies, the hero displays a general introduction.
- **FAQ slugs** offers a searchable multiple-selection picker of saved questions, labelled by title. Category selection is available only in **Home → FAQ section**. Offerings select individual questions.

Product names, images, descriptions, prices, discounts, duration, and checkout URLs still come from the portal for the selected currency. Unlisted or unpublished portal products cannot become public catalog entries through Studio. Deactivation removes a product from the website listings and hero; direct detail links continue to follow the portal's publication rules, including unlisted sharing.

The former `NUXT_PUBLIC_FEATURED_OFFERING_SLUG` setting is no longer used and can be removed from deployment settings. Content changes require rebuilding the pre-rendered website through the normal publication pipeline.

### FAQs and categories

Open **FAQs** to add a question (Title), a unique slug, category names, display order, and active status. Categories are a list of text values, just like categories in the media library; there is no separate FAQ categories collection. Edit its answer in the **Story** visual/Markdown editor. The existing nine FAQs retain their answers and their four category names.

Reuse questions on an offering by selecting individual questions on its Offerings record. They appear below `/specials/<offering-slug>`. Program pages also select individual questions through `faqSlugs`. Only the homepage FAQ section offers `faqCategories`. Existing program questions were preserved as individual selections.

Individual FAQ relationship pickers display titles and store stable slug identifiers. Studio validates that selected entries exist, updates declared references when a target slug changes, and shows dependent content before deletion. The website ignores missing references if content is changed outside Studio. Inactive FAQs disappear everywhere they are reused. Questions are ordered within categories. Homepage category names follow their selection order; additional headings come from the selected FAQ items in question order. A question in multiple categories appears under the first matching heading only. Questions without categories appear without a category heading. Category names must match exactly between FAQ items and the homepage selection; renaming a category means updating those text values wherever used.

Visible answers and FAQ structured data come from the same selection. Editing an answer updates every page and offering that reuses it after rebuilding.

## Media library

Open **Media** in Marpos Studio for the image library. Existing homepage artwork, portraits, social previews, older artwork, and avatar variants are registered with titles, alternative text, and categories. Logos and favicons remain application assets outside the media library. Portal product images remain managed in the portal.

Use **Upload image** to add an image or open an existing record to crop, adjust, rename, or categorize it. Uploads are stored under `public/images/`; existing URLs are preserved so current links and previews keep working. Full images keep a flexible crop ratio because this library contains portraits and wide backgrounds. Separate thumbnails use a fixed **4:3** crop: open an image, choose **Add thumbnail** or **Adjust thumbnail**, crop, and save. Studio stores the thumbnail separately from the full image.

In **Homepage Hero**, **Homepage About**, or a page’s **SEO → Image** field, use **Choose image** to select from the shared library. Selecting an image stores its URL on that page. If a library edit creates a new cropped image URL, select the updated image in the page field to use that version. Update the portrait or SEO alternative text to match a replacement image. Hidden library records remain selectable; visibility is not a way to unpublish an image already used on a page.

### About Shannon writing tabs

**Homepage About** has three tabs: **Details** for the portrait and button labels, **Summary** for the homepage heading, paragraphs, and signature, and **Story** for the full biography opened by **Read my story**. Summary and Story each use Studio’s visual/Markdown editor. Their content is stored as named Markdown slots in `content/homepage/3.about.md`; editing one tab preserves the other. Use a level-two heading for the summary heading and bold text for the signature.

### Hero and offerings writing editors

Open **Homepage Hero** and choose **Story** to edit the text underneath the main heading using Studio’s visual or Markdown editor. It supports multiple paragraphs, emphasis, lists, and links. The heading and artwork stay in Details. **Homepage Offerings → Story** edits the introduction above the product cards. Its Details tab controls both heading variants and the details-link label. Individual products are still managed in Offerings and the portal.

The hero no longer contains general page metadata. **Homepage Settings** contains the homepage’s search/social metadata and coach profile; **Homepage FAQ** contains its selected FAQs. Contact and legal pages expose title, description, and SEO only; unused profile, FAQ, and service fields were removed from those schemas. Archived programs retain their service metadata and FAQ selections because their templates use them. The About block’s redundant editor description was removed, and its fixed internal title is hidden; Summary, Story, portrait, and button settings remain.

Some fields apply only in specific states: the hero button appears when no product is featured, and the alternate catalog heading appears when a product is featured. Page title and description are SEO fallbacks; explicit SEO title/description override them.

### Internal content names

Every collection offers an optional **Name** field for identifying items in Studio. Studio uses this name for cards and editor headings; leaving it empty falls back to the content title. The name does not change the website heading, SEO, slug, or URL. The Home entries are named Hero, Offerings section, About Shannon, FAQ section, and Homepage settings.

### Preview links

Use an item’s **Preview link** to choose where Studio opens its preview, for example `/about`, `/contact`, or `/#about`. The field suggests internal routes and accepts section anchors. It overrides developer preview mappings and inferred routes without changing the item’s slug, canonical URL, or public page address. Leave it empty to use the existing automatic destination. About Shannon defaults to `/about`; Contact defaults to `/contact`.

### Homepage FAQ section

Open **Home → FAQ section** to edit the FAQ heading and select reusable questions or categories in Details. Story provides an optional Markdown introduction. The original General questions selection is preserved. Homepage Settings now contains only search/social metadata and the coach profile. The FAQ section appears below About Shannon whenever its selection contains active questions; `/faq` opens the same section on the homepage.

The About block starts with Summary on every fresh load, including `/about`. **Read my story** expands the full biography; **Show summary** collapses it. This choice is temporary and resets on refresh or navigation to another homepage section.

### FAQ answer editor

Each **FAQs** item has **Details** for its question, name, categories, and status, plus **Story** for the answer. Answers support Markdown paragraphs, emphasis, lists, and links. Existing answers have been migrated unchanged to Markdown bodies. The site renders those bodies inside the same animated, single-open accordion. FAQ structured-data text is derived from that parsed Markdown, so there is no second answer field to maintain.

### FAQ placement rules

Only **Home → FAQ section** allows selecting categories and displays category headings. All other pages and offerings select individual FAQ questions and display one flat accordion with no category headings. Existing category selections outside the homepage were expanded into individual FAQ slugs during migration, preserving the questions that were selected. Category assignments on FAQ records remain available for organizing the library and grouping the homepage.

Individually selected FAQs appear in the exact order of Studio’s selection chips. Move the chips with their arrow controls to reorder the questions on that page or offering. Missing, inactive, and duplicate selections are skipped. For homepage category selections, remaining questions follow their numeric Order, with category headings following the category name selection order.
