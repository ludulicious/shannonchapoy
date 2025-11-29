<template>
  <div class="flex-1 pt-24 pb-16">
    <!-- Title Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-brand-ltPurple flex-shrink-0">
          <Heart class="w-8 h-8 text-white" />
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-brand-ltPurple">1:1 Love Coaching</h1>
      </div>
    </div>

    <!-- Markdown Content Section -->
    <p class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      Transform your love life with personalized, one-on-one coaching sessions designed to help you find and maintain meaningful relationships.
    </p>

    <!-- Contact Form Section -->
    <section class="bg-brand-soft">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref="elementRef"
          :class="[
            'bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000',
            formVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          ]"
        >
          <div class="bg-brand-ltPurple p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <h3 class="font-serif text-3xl font-bold mb-6">Sign up for my waiting list</h3>
              <p class="text-white/80 mb-8">Be the first to know when I launch my one-on-one love coaching program.</p>
              <p class="text-white/80 mb-8">While I'm  still working on the program, You will receive some emails with inspirational content and tips to help you on your journey.</p>
            </div>
          </div>

          <div class="md:w-4/5">
            <iframe
              src="https://actions.shannonchapoy.com/widget/form/5fdGTG9XZ2bT8OBLidJk"
              style="width: 100%; height: 100%; border: none; border-radius: 4px;"
              id="inline-5fdGTG9XZ2bT8OBLidJk"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Waiting List 1:1 Love Coaching"
              data-height="555"
              data-layout-iframe-id="inline-5fdGTG9XZ2bT8OBLidJk"
              data-form-id="5fdGTG9XZ2bT8OBLidJk"
              title="Waiting List 1:1 Love Coaching"
            >
            </iframe>
          </div>
        </div>
      </div>
    </section>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div v-if="contentPending" class="flex justify-center items-center py-12">
        <div class="text-brand-charcoal">Loading...</div>
      </div>
      <div v-else-if="contentError" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 class="text-red-800 font-semibold mb-2">Error loading content</h2>
        <p class="text-red-600">{{ contentError }}</p>
      </div>
      <article v-else-if="contentData" class="prose prose-lg max-w-none">
        <ContentRenderer :value="contentData" />
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

const isVisible = ref(false)
const { elementRef, isVisible: formVisible } = useScrollAnimation(0.2)

const { data: contentData, pending: contentPending, error: contentError } = await useAsyncData('content-one-on-one', () => 
  queryCollection('content').path('/one-on-one-love-coaching').first()
)

useHead({
  title: '1:1 Love Coaching - Shannon Chapoy'
})

onMounted(() => {
  if (process.client) {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    isVisible.value = true
  }
})
</script>
