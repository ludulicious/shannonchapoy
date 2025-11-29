<template>
  <div class="flex-1 pt-24 pb-16">
    <!-- Title Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-brand-seaBlue flex-shrink-0">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-brand-seaBlue">Free first session inside a Peace & Joy Circle</h1>
      </div>
    </div>

    <!-- Markdown Content Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <ContentDoc path="/pj-circle-intro" />
    </div>

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
          <div class="bg-brand-seaBlue p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <div>
                <h3 class="font-serif text-3xl font-bold mb-6">Start Your Journey</h3>
                <p class="text-white/80 mb-8">Ready to start your journey? <br/> <br/> Sign up for a free first session and start your transformation today.</p>
              </div>
            </div>
          </div>

          <div class="md:w-4/5">
            <iframe
              src="https://actions.shannonchapoy.com/widget/form/6lN7WgzfJecJjmfppVfx"
              style="width: 100%; height: 100%; border: none; border-radius: 4px;"
              id="inline-6lN7WgzfJecJjmfppVfx"
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
            >
            </iframe>
          </div>
        </div>
      </div>
    </section>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <ContentDoc path="/pj-circle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users } from 'lucide-vue-next'

const isVisible = ref(false)
const { elementRef, isVisible: formVisible } = useScrollAnimation(0.2)

useHead({
  title: 'Start Your Journey - Shannon Chapoy'
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

