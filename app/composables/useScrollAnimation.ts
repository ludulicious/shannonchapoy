export const useScrollAnimation = (threshold: number = 0.1) => {
  // Server-rendered content stays visible even before JavaScript starts.
  const isVisible = ref(true)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (
      !elementRef.value ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    // Only hide offscreen elements after hydration, for their entrance animation.
    const bounds = elementRef.value.getBoundingClientRect()
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
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

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { elementRef, isVisible }
}
