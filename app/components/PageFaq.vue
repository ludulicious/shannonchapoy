<script setup lang="ts">
defineProps<{ groups: { title: string; items: { slug: string; question: string; answer: string }[] }[] }>()
</script>

<template>
  <section
    v-if="groups.length"
    id="faq"
    class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    aria-label="Frequently asked questions"
  >
    <h2 class="font-serif text-3xl text-brand-dkPurple mb-6">Frequently asked questions</h2>
    <div v-for="group in groups" :key="group.title" class="mb-8">
      <h3 v-if="group.title" class="font-serif text-2xl text-brand-dkPurple mb-4">{{ group.title }}</h3>
      <div v-for="item in group.items" :key="item.slug" class="mb-6">
        <component :is="group.title ? 'h4' : 'h3'" class="font-semibold text-xl text-brand-charcoal mb-2">{{
          item.question
        }}</component>
        <p class="text-brand-charcoal leading-relaxed">{{ item.answer }}</p>
      </div>
    </div>
  </section>
</template>
