<script setup lang="ts">
const releaseLinkFocus = (event: MouseEvent) => {
  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    ;(event.currentTarget as HTMLAnchorElement).blur()
  }
}
</script>

<template>
  <footer class="bg-brand-charcoal text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      <div class="mb-6 md:mb-0 text-center md:text-left">
        <Logo variant="light" class-name="mx-auto md:mx-0 mb-2" />
        <p class="text-gray-400 text-sm">Helping women lead their best life</p>
      </div>

      <div class="flex space-x-8 mb-6 md:mb-0 text-sm text-gray-400">
        <NuxtLink to="/privacy" class="hover:text-brand-ltPurple transition-colors" @click="releaseLinkFocus"
          >Privacy Policy</NuxtLink
        >
        <NuxtLink to="/terms" class="hover:text-brand-ltPurple transition-colors" @click="releaseLinkFocus"
          >Terms of Service</NuxtLink
        >
      </div>

      <div class="text-gray-500 text-sm">
        &copy; {{ new Date().getFullYear() }} Shannon Chapoy. All rights reserved.
      </div>
    </div>
  </footer>
</template>
