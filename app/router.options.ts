import type { RouterConfig } from '@nuxt/schema'
import { isLandingPath } from './utils/landingRoutes'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (from.matched.length && isLandingPath(to.path) && isLandingPath(from.path)) {
      return false
    }

    return { top: 0 }
  }
} satisfies RouterConfig
