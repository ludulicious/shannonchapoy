<script setup lang="ts">
import { Mail, Instagram, Facebook, Linkedin } from 'lucide-vue-next'

const { elementRef, isVisible } = useScrollAnimation(0.2)
</script>

<template>
  <section id="contact" class="py-20 bg-brand-soft">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref="elementRef"
        :class="[
          'bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000',
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        ]"
      >
        <div class="bg-brand-dkPurple p-10 md:w-2/5 text-white flex flex-col justify-between">
          <div>
            <h3 class="font-serif text-3xl font-bold mb-6">Let's Talk</h3>
            <p class="text-white/80 mb-8">
              Ready to start your transformation? Send me a message and let's discuss how we can work together.
            </p>
          </div>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <Mail class="w-5 h-5" />
              <span>hello@shannonchapoy.com</span>
            </div>
            <div class="flex space-x-4 mt-8">
              <a href="#" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Instagram class="w-5 h-5" />
              </a>
              <a href="#" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Facebook class="w-5 h-5" />
              </a>
              <a href="#" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Linkedin class="w-5 h-5" />
              </a>
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
