<script setup lang="ts">
defineProps<{ items?: { question: string; answer: string }[] }>()
</script>

<template>
  <section
    v-if="items?.length"
    id="faq"
    class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    aria-label="Frequently asked questions"
  >
    <h2 class="font-serif text-3xl text-brand-dkPurple mb-6">Frequently asked questions</h2>
    <div v-for="item in items" :key="item.question" class="mb-6">
      <h3 class="font-semibold text-xl text-brand-charcoal mb-2">{{ item.question }}</h3>
      <p class="text-brand-charcoal leading-relaxed">{{ item.answer }}</p>
    </div>
  </section>
</template>
