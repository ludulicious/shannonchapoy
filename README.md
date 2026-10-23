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

`/contact` is a standalone page with a native form, based on the Amstelgospel form flow. The homepage's contact prompt and navigation link open this page. Its title, description, and SEO fields are in `content/contact.md`.

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

Markdown files in the `content/` directory are automatically available via Nuxt Content. The page templates use `<ContentRenderer>` to render Markdown. Search metadata, social previews, structured service information, and visible FAQs are editable in frontmatter through Marpos Studio. Homepage metadata lives in `content/index.md`. See [SEO and AI discoverability](docs/seo.md) for the field reference and audit findings.

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

## Promoted homepage offering

Set `NUXT_PUBLIC_FEATURED_OFFERING_SLUG` to the public catalog slug to recommend on the homepage. It defaults to `intake` (Discover Yourself). Set it in the build and deployment environment and rebuild, because landing pages are pre-rendered.

The hero, recommendation label, and catalog ordering all use this setting. Product names, prices, discounts, duration, and checkout URLs come from the configured portal for the selected currency. Development and production can therefore show different prices. No free-session price is hardcoded in the website.

Only products returned in the public catalog are eligible; unlisted products are excluded. An empty or unavailable configured slug produces a general offerings introduction and no featured booking prompt. Hidden offering links continue to work on their individual detail pages.
