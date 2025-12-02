<template>
  <nav :class="[
    'fixed w-full z-50 transition-all duration-300 animate-fade-in',
    shouldShowBackground ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-6'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <NuxtLink to="/" class="hover:opacity-90 transition-opacity">
        <Logo :variant="shouldShowBackground ? 'color' : 'light'" />
      </NuxtLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8 items-center">
        <NuxtLink 
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'text-sm font-medium transition-colors',
            isActive(item.path)
              ? 'text-brand-seaBlue font-semibold'
              : shouldShowBackground
                ? 'text-brand-charcoal hover:text-brand-ltPurple'
                : 'text-white drop-shadow-sm hover:text-brand-ltPurple'
          ]"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink 
          to="/pj-circle"
          :class="[
            'px-6 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105',
            route.path === '/pj-circle'
              ? 'bg-brand-seaBlue text-white hover:bg-brand-seaBlue/90'
              : shouldShowBackground
                ? 'bg-brand-dkPurple text-white hover:bg-brand-ltPurple'
                : 'bg-white/90 text-brand-dkPurple hover:bg-white'
          ]"
        >
          Start Your Journey
        </NuxtLink>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden" 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <X v-if="isMobileMenuOpen" :class="shouldShowBackground ? 'text-brand-charcoal' : 'text-white'" />
        <Menu v-else :class="shouldShowBackground ? 'text-brand-charcoal' : 'text-white'" />
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white absolute w-full shadow-xl border-t border-gray-100">
      <div class="px-4 pt-2 pb-6 space-y-2">
        <NuxtLink 
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'block px-3 py-2 text-base font-medium rounded-md transition-colors',
            isActive(item.path)
              ? 'text-brand-seaBlue bg-brand-seaBlue/10 font-semibold'
              : 'text-brand-charcoal hover:text-brand-ltPurple hover:bg-brand-soft'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Philosophy', path: '/philosophy' },
  { name: 'Contact', path: '/contact' }
]

const isHomePage = computed(() => {
  return ['/', '/about', '/services', '/philosophy', '/contact'].includes(route.path)
})

const shouldShowBackground = computed(() => {
  return !isHomePage.value || isScrolled.value
})

const isActive = (path: string) => {
  return route.path === path
}

onMounted(() => {
  if (process.client) {
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }
    window.addEventListener('scroll', handleScroll)
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  }
})
</script>

