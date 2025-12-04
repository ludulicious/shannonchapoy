// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-check
/// <reference types="nuxt" />

export default defineNuxtConfig({
  compatibilityDate: '2025-11-29',
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

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
          'http-equiv': 'Content-Security-Policy',
          content: "frame-src 'self' https://actions.shannonchapoy.com https://storage.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://actions.shannonchapoy.com https://storage.googleapis.com; connect-src 'self' https://actions.shannonchapoy.com https://backend.leadconnectorhq.com https://storage.googleapis.com;"
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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap' }
      ],
      script: [
        { src: 'https://actions.shannonchapoy.com/js/form_embed.js', defer: true }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  typescript: {
    strict: true
  }
})
