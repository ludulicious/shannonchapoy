<script setup lang="ts">
definePageMeta({ pageTransition: false })

const { data, pending, error } = await useAsyncData('content-terms', () =>
  queryCollection('content').path('/terms').first()
)

useHead({
  title: 'Terms of Service - Shannon Chapoy'
})
</script>

<template>
  <div class="flex-1 pt-32 md:pt-40 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="text-brand-charcoal">Loading...</div>
      </div>
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 class="text-red-800 font-semibold mb-2">Error loading content</h2>
        <p class="text-red-600">{{ error }}</p>
      </div>
      <article v-else-if="data" class="prose prose-lg max-w-none">
        <ContentRenderer :value="data" />
      </article>
    </div>
  </div>
</template>
