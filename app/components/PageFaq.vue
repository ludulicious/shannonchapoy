<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { ChevronDown } from 'lucide-vue-next'
import type { FaqGroup } from '~/utils/managedContent'

withDefaults(
  defineProps<{
    groups: FaqGroup[]
    heading?: string
    intro?: Collections['homepage_faq'] | null
  }>(),
  { heading: 'Frequently asked questions' }
)
const expanded = ref<string | null>(null)
const faqId = useId()
const toggle = (slug: string) => {
  expanded.value = expanded.value === slug ? null : slug
}
</script>

<template>
  <section
    v-if="groups.length"
    id="faq"
    class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    aria-label="Frequently asked questions"
  >
    <h2 class="font-serif text-3xl text-brand-dkPurple mb-6">{{ heading }}</h2>
    <div v-if="intro" class="prose prose-lg max-w-none mb-6"><ContentRenderer :value="intro" /></div>
    <div v-for="group in groups" :key="group.title" class="mb-8">
      <h3 v-if="group.title" class="font-serif text-2xl text-brand-dkPurple mb-4">{{ group.title }}</h3>
      <div v-for="item in group.items" :key="item.slug" class="border-b border-brand-dkPurple/20">
        <component :is="group.title ? 'h4' : 'h3'" class="font-semibold text-xl text-brand-charcoal">
          <button
            :id="`${faqId}-${item.slug}-question`"
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dkPurple"
            :aria-expanded="expanded === item.slug"
            :aria-controls="`${faqId}-${item.slug}-answer`"
            @click="toggle(item.slug)"
          >
            {{ item.question }}
            <ChevronDown
              class="h-5 w-5 shrink-0 text-brand-dkPurple transition-transform duration-200 motion-reduce:transition-none"
              :class="{ 'rotate-180': expanded === item.slug }"
              aria-hidden="true"
            />
          </button>
        </component>
        <div
          :id="`${faqId}-${item.slug}-answer`"
          class="faq-answer"
          :class="{ 'is-open': expanded === item.slug }"
          :aria-hidden="expanded !== item.slug"
          :inert="expanded !== item.slug"
          :aria-labelledby="`${faqId}-${item.slug}-question`"
          role="region"
        >
          <div class="min-h-0 overflow-hidden">
            <div class="prose prose-lg max-w-none pb-5 pr-9 text-brand-charcoal"><ContentRenderer :value="item" /></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 220ms ease,
    opacity 180ms ease;
}
.faq-answer.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .faq-answer {
    transition: none;
  }
}
</style>
