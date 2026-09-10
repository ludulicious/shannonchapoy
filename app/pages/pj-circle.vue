<script setup lang="ts">
import { Users } from 'lucide-vue-next'

const { elementRef, isVisible: formVisible } = useScrollAnimation(0.2)

const {
  data: introData,
  pending: introPending,
  error: introError
} = await useAsyncData('content-pj-intro', () => queryCollection('content').path('/pj-circle-intro').first())

const {
  data: contentData,
  pending: contentPending,
  error: contentError
} = await useAsyncData('content-pj-circle', () => queryCollection('content').path('/pj-circle').first())

useHead({
  title: 'PJ Circle - Shannon Chapoy'
})
</script>

<template>
  <div class="flex-1 pt-24 pb-16">
    <!-- Title Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-brand-seaBlue flex-shrink-0">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-brand-seaBlue">Peace & Joy Circle (PJ Circle)</h1>
      </div>
    </div>

    <!-- Markdown Content Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div v-if="introPending" class="flex justify-center items-center py-12">
        <div class="text-brand-charcoal">Loading...</div>
      </div>
      <div v-else-if="introError" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 class="text-red-800 font-semibold mb-2">Error loading content</h2>
        <p class="text-red-600">{{ introError }}</p>
      </div>
      <article v-else-if="introData" class="prose prose-lg max-w-none">
        <ContentRenderer :value="introData" />
      </article>
    </div>

    <!-- Code Validation / Contact Form Section -->
    <section class="bg-brand-soft">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref="elementRef"
          :class="[
            'bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000',
            formVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          ]"
        >
          <div class="bg-brand-seaBlue p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <div>
                <h3 class="font-serif text-3xl font-bold mb-6">Start Your Journey</h3>
                <p class="text-white/80 mb-8">
                  Ready to start your journey? <br />
                  <br />
                  Sign up to join a PJ Circle and start your transformation of reconnecting to yourself and your divine
                  essence.
                </p>
              </div>
            </div>
          </div>

          <div class="md:w-4/5 min-h-[555px] bg-white">
            <iframe
              id="inline-6lN7WgzfJecJjmfppVfx"
              src="https://actions.shannonchapoy.com/widget/form/6lN7WgzfJecJjmfppVfx"
              style="width: 100%; height: 555px; border: none; border-radius: 4px"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Sign up for PJ Circle"
              data-height="555"
              data-layout-iframe-id="inline-6lN7WgzfJecJjmfppVfx"
              data-form-id="6lN7WgzfJecJjmfppVfx"
              title="Sign up for PJ Circle"
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
