import type { RouterConfig } from '@nuxt/schema'
// Avoid the #app barrel: route rules import this file during client startup.
import { useNuxtApp } from '#app/nuxt'
import { isLandingPath } from './utils/landingRoutes'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/privacy' || to.path === '/terms') {
      const top = { top: 0, left: 0, behavior: 'instant' as const }
      if (!from.matched.length || to.path === from.path) {
        return top
      }

      const nuxtApp = useNuxtApp()
      const router = nuxtApp.$router
      return new Promise<typeof top | false>((resolve) => {
        nuxtApp.hooks.hookOnce('page:loading:end', () => {
          resolve(router.currentRoute.value.fullPath === to.fullPath ? top : false)
        })
      })
    }

    if (savedPosition) {
      return savedPosition
    }

    if (from.matched.length && isLandingPath(to.path) && isLandingPath(from.path)) {
      return false
    }

    return { top: 0 }
  }
} satisfies RouterConfig
