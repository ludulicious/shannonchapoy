<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { name: 'Offerings', path: '/offerings' },
  { name: 'Meet Shannon', path: '/about' },
  { name: 'Questions?', path: '/contact' }
]

const isActive = (path: string) => {
  return route.path === path
}

const pagePath = () => {
  if (import.meta.client) {
    return window.location.pathname
  }
  return route.path
}

const updateScrolled = () => {
  if (!import.meta.client) {
    return
  }
  if (pagePath() !== '/') {
    isScrolled.value = true
    return
  }
  isScrolled.value = window.scrollY > 50
}

const shouldShowBackground = computed(() => {
  void route.fullPath
  return pagePath() !== '/' || isScrolled.value
})

onMounted(() => {
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateScrolled)
  })
})

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
    updateScrolled()
  },
  { flush: 'sync' }
)
</script>

<template>
  <nav
    aria-label="Main navigation"
    :class="[
      'fixed w-full z-50',
      shouldShowBackground ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white lg:bg-transparent py-4 lg:py-6'
    ]"
    @keydown.esc="isMobileMenuOpen = false"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <NuxtLink to="/" class="hover:opacity-90 transition-opacity">
        <Logo variant="color" class-name="max-w-[7.5rem] lg:max-w-none" />
      </NuxtLink>

      <div class="flex items-center gap-1 sm:gap-3 xl:gap-6">
        <!-- Desktop Menu -->
        <div class="hidden lg:flex gap-3 xl:gap-6 items-center">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            active-class=""
            exact-active-class=""
            :aria-current="isActive(item.path) ? 'page' : undefined"
            :class="[
              'px-2 py-2 whitespace-nowrap rounded-md text-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
              isActive(item.path)
                ? 'text-brand-seaBlue hover:text-brand-seaBlue hover:bg-[#eee5f3]'
                : 'text-[#685574] hover:text-brand-dkPurple hover:bg-[#eee5f3]'
            ]"
          >
            {{ item.name }}
          </NuxtLink>
          <NuxtLink
            to="/offerings"
            :class="[
              'px-5 py-3 rounded-full text-lg font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
              route.path === '/offerings'
                ? 'bg-brand-skyBlue text-white hover:bg-brand-dkPurple hover:text-white'
                : 'bg-brand-dkPurple text-white hover:bg-brand-ltPurple hover:text-white'
            ]"
          >
            Book a session
          </NuxtLink>
        </div>

        <CatalogCurrencySelect compact />

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-current"
          aria-controls="mobile-navigation"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <X v-if="isMobileMenuOpen" class="text-brand-charcoal" />
          <Menu v-else class="text-brand-charcoal" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div
      v-if="isMobileMenuOpen"
      id="mobile-navigation"
      class="lg:hidden bg-white absolute w-full shadow-xl border-t border-gray-100"
    >
      <div class="px-4 pt-2 pb-6 space-y-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'block px-3 py-3 text-lg font-semibold rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dkPurple',
            isActive(item.path)
              ? 'text-brand-seaBlue hover:text-brand-seaBlue hover:bg-[#eee5f3]'
              : 'text-[#685574] hover:text-brand-dkPurple hover:bg-[#eee5f3]'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink to="/offerings" class="conversion-button w-full" @click="isMobileMenuOpen = false">
          Book a session
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
:deep(.currency-select) {
  flex-shrink: 0;
}
</style>
