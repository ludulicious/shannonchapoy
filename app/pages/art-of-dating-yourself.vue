<script setup lang="ts">
import { Sun } from 'lucide-vue-next'

const isVisible = ref(false)
const { elementRef, isVisible: formVisible } = useScrollAnimation(0.2)

const {
  data: contentData,
  pending: contentPending,
  error: contentError
} = await useAsyncData('content-art-of-dating', () =>
  queryCollection('content').path('/art-of-dating-yourself').first()
)

useHead({
  title: 'The Art of Dating Yourself - Shannon Chapoy'
})

onMounted(() => {
  if (import.meta.client) {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    isVisible.value = true
  }
})
</script>

<template>
  <div class="flex-1 pt-24 pb-16">
    <!-- Title Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-brand-skyBlue flex-shrink-0">
          <Sun class="w-8 h-8 text-white" />
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-brand-skyBlue">The Art of Dating Yourself</h1>
      </div>
    </div>

    <!-- Markdown Content Section -->
    <p class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      A series of workshops designed to help you date yourself better. We'll cover topics like self-love, self-care, and
      self-improvement.
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
          <div class="bg-brand-skyBlue p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <div>
                <h3 class="font-serif text-3xl font-bold mb-6">Sign up for my waiting list</h3>
                <p class="text-white/80 mb-8">
                  Be the first to know when I launch my The Art of Dating Yourself program.
                </p>
                <p class="text-white/80 mb-8">
                  While I'm still working on the program, You will receive some emails with inspirational content and
                  tips to help you on your journey.
                </p>
              </div>
            </div>
          </div>

          <div class="md:w-4/5 min-h-[555px] bg-white">
            <iframe
              id="inline-OuOANmqGsixnQg0en5oF"
              src="https://actions.shannonchapoy.com/widget/form/OuOANmqGsixnQg0en5oF"
              style="width: 100%; height: 555px; border: none; border-radius: 4px"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Waiting Art of Dating Yourself"
              data-height="555"
              data-layout-iframe-id="inline-OuOANmqGsixnQg0en5oF"
              data-form-id="OuOANmqGsixnQg0en5oF"
              title="Waiting Art of Dating Yourself"
              allow="autoplay; payment"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
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
