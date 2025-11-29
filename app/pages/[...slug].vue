<template>
  <div class="flex-1 pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl font-bold mb-8 text-brand-charcoal">Page Not Found</h1>
      <p class="text-brand-charcoal mb-8">The page you're looking for doesn't exist.</p>
      <NuxtLink to="/" class="px-6 py-3 bg-brand-ltPurple text-white rounded-full font-semibold hover:bg-brand-dkPurple transition-all">
        Go Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '404 - Page Not Found - Shannon Chapoy'
})
</script>

