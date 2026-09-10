import { isLandingPath } from '../utils/landingRoutes'

export const useScrollToSection = () => {
  const route = useRoute()

  const scrollToSection = (sectionId: string, retryCount = 0) => {
    if (!import.meta.client) {
      return
    }

    const element = document.getElementById(sectionId)

    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.height === 0 && retryCount < 20) {
        requestAnimationFrame(() => scrollToSection(sectionId, retryCount + 1))
        return
      }

      const offset = 80
      const offsetPosition = rect.top + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else if (retryCount < 20) {
      requestAnimationFrame(() => scrollToSection(sectionId, retryCount + 1))
    }
  }

  const handleHashNavigation = () => {
    if (!import.meta.client || !isLandingPath(route.path)) {
      return
    }

    if (route.path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    scrollToSection(route.path.slice(1))
  }

  return {
    scrollToSection,
    handleHashNavigation
  }
}
