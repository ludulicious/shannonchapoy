// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-check
/// <reference types="nuxt" />

export default defineNuxtConfig({
  compatibilityDate: '2025-11-29',
  ssr: true,
  devtools: { enabled: true },
  eslint: { config: { stylistic: { commaDangle: 'never', braceStyle: '1tbs' } } },
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxtjs/tailwindcss'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  runtimeConfig: {
    portalApiKey: '',
    portalUrl: 'http://localhost:3052',
    resendApiKey: '',
    resendFromEmail: '',
    contactTo: 'hello@shannonchapoy.com',
    turnstileSecretKey: '',
    turnstileHostnames: 'shannonchapoy.com,www.shannonchapoy.com',
    public: {
      featuredOfferingSlug: 'intake',
      turnstileSiteKey: ''
    }
  },

  app: {
    head: {
      title: 'Shannon Chapoy',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          'http-equiv': 'Permissions-Policy',
          content:
            'autoplay=*, camera=(), microphone=(), geolocation=(), payment=(self "https://actions.shannonchapoy.com")'
        }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/fav/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/fav/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/fav/favicon-16x16.png' },
        { rel: 'manifest', href: '/fav/site.webmanifest' },
        { rel: 'shortcut icon', href: '/fav/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  typescript: {
    strict: true
  },

  nitro: {
    // Pre-render content while retaining the server for form validation and 404s.
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/',
        '/about',
        '/offerings',
        '/philosophy',
        '/faq',
        '/contact',
        '/pj-circle',
        '/one-on-one-love-coaching',
        '/art-of-dating-yourself',
        '/privacy',
        '/terms',
        '/sitemap.xml'
      ]
    },
    routeRules: {
      '/services': { redirect: '/offerings' },
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "frame-src 'self' https://challenges.cloudflare.com https://actions.shannonchapoy.com https://storage.googleapis.com https://*.googleapis.com",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://actions.shannonchapoy.com https://storage.googleapis.com https://*.googleapis.com",
            "connect-src 'self' https://actions.shannonchapoy.com https://backend.leadconnectorhq.com https://storage.googleapis.com https://*.googleapis.com https://*.leadconnectorhq.com",
            "img-src 'self' data: https: blob:",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self' https://actions.shannonchapoy.com",
            "frame-ancestors 'self'"
          ].join('; ')
        }
      }
    }
  }
})
