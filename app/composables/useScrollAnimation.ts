export const useScrollAnimation = (threshold: number = 0.1) => {
  // Server-rendered content stays visible even before JavaScript starts.
  const isVisible = ref(true)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null
  let isMounted = false

  const observeElement = (element: HTMLElement | null) => {
    observer?.disconnect()
    observer = null

    if (
      !isMounted ||
      !element ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    // Only hide offscreen elements after hydration, for their entrance animation.
    const bounds = element.getBoundingClientRect()
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      isVisible.value = true
      return
    }
    isVisible.value = false

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
  }

  watch(elementRef, observeElement, { flush: 'post' })

  onMounted(() => {
    isMounted = true
    observeElement(elementRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { elementRef, isVisible }
}
