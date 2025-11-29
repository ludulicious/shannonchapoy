export const useScrollToSection = () => {
  const route = useRoute()
  const router = useRouter()

  const scrollToSection = (sectionId: string, retryCount = 0) => {
    if (process.client) {
      const element = document.getElementById(sectionId)
      
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.height === 0 && retryCount < 20) {
          requestAnimationFrame(() => scrollToSection(sectionId, retryCount + 1))
          return
        }
        
        const offset = 80
        const elementPosition = rect.top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      } else if (retryCount < 20) {
        requestAnimationFrame(() => scrollToSection(sectionId, retryCount + 1))
      }
    }
  }

  const handleHashNavigation = () => {
    if (process.client) {
      const currentPath = route.path
      const homePageRoutes = ['/', '/about', '/services', '/philosophy', '/contact']
      const isHomePageRoute = homePageRoutes.includes(currentPath)

      if (isHomePageRoute) {
        if (currentPath === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          const sectionId = currentPath.substring(1)
          setTimeout(() => scrollToSection(sectionId), 100)
        }
      }
    }
  }

  return {
    scrollToSection,
    handleHashNavigation
  }
}

