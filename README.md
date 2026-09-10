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

The build pre-renders the homepage, its four section URLs, all three program pages, and both legal pages into `.output/public/` as HTML with content and SEO metadata. The explicit route list is in `nuxt.config.ts`; linked pages are also discovered during pre-rendering. Rendering errors fail the build.

The Docker build runs this same command. Run `.output/server/index.mjs` in production: it serves the generated pages and keeps the form-validation API and proper 404 responses available. Rebuild after changing Markdown content.

`pnpm generate` is available for a static-only export, but static hosting alone cannot run `server/api/validate-code.ts`.

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

Markdown files in the `content/` directory are automatically available via Nuxt Content. Use the `<ContentDoc>` component to render markdown content.

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
