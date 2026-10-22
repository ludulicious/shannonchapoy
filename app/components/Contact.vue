<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

const route = useRoute()
const showForm = computed(() => route.path === '/contact')

const { elementRef, isVisible } = useScrollAnimation(0.2)
</script>

<template>
  <section id="contact" :class="showForm ? 'py-20 bg-brand-soft' : 'py-10 bg-brand-soft'">
    <div v-if="!showForm" class="max-w-4xl mx-auto px-6 text-center">
      <h2 class="font-serif text-2xl text-brand-dkPurple mb-2">A question before you book?</h2>
      <p class="text-brand-charcoal mb-2">I'm here to help you find the right fit.</p>
      <NuxtLink to="/contact" class="conversion-text-link">Ask Shannon</NuxtLink>
    </div>
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref="elementRef"
        :class="[
          'bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000',
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        ]"
      >
        <div class="bg-brand-dkPurple p-6 md:w-2/5 min-w-0 text-white flex flex-col justify-between">
          <div>
            <h3 class="font-serif text-3xl font-bold mb-6">Let's Talk</h3>
            <p class="text-white/80 mb-8">
              Have a question about a session? Send me a message and I’ll help you find the right fit.
            </p>
          </div>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <Mail class="w-5 h-5" />
              <a href="mailto:hello@shannonchapoy.com" class="break-all underline">hello@shannonchapoy.com</a>
            </div>
          </div>
        </div>

        <div class="md:w-4/5 min-h-[542px] bg-white">
          <iframe
            id="inline-WQ1oAQmkwYDHYsFWlOV9"
            src="https://actions.shannonchapoy.com/widget/form/WQ1oAQmkwYDHYsFWlOV9"
            style="width: 100%; height: 542px; border: none; border-radius: 4px"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Website Contact Form"
            data-height="542"
            data-layout-iframe-id="inline-WQ1oAQmkwYDHYsFWlOV9"
            data-form-id="WQ1oAQmkwYDHYsFWlOV9"
            title="Website Contact Form"
            allow="autoplay; payment"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          >
          </iframe>
        </div>
      </div>
    </div>
  </section>
</template>
