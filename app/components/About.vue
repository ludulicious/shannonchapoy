<template>
  <section id="about" class="py-20 bg-brand-soft relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-brand-ltPurple/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float" style="animation-delay: 0s"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-seaBlue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-float" style="animation-delay: 1.5s"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div
          ref="imageRef"
          :class="[
            'relative transition-all duration-1000',
            imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          ]"
        >
          <div class="absolute inset-0 bg-brand-dkPurple/5 transform translate-x-2 translate-y-2 rounded-2xl transition-all duration-1000 delay-200"></div>
          <img
            :src="imgSrc"
            alt="Shannon Chapoy"
            @error="handleImgError"
            :class="[
              'relative rounded-2xl shadow-xl w-full object-cover object-left h-[450px] md:h-[600px] lg:h-[600px] bg-gray-200 -translate-x-2 transition-all duration-1000 delay-300',
              imageVisible ? 'scale-100' : 'scale-95'
            ]"
          />
        </div>

        <div
          ref="contentRef"
          :class="[
            'transition-all duration-1000 delay-200',
            contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          ]"
        >
          <div v-if="contentPending" class="flex justify-center items-center py-12">
            <div class="text-brand-charcoal">Loading...</div>
          </div>
          <div v-else-if="contentError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 class="text-red-800 font-semibold mb-2">Error loading content</h2>
            <p class="text-red-600">{{ contentError }}</p>
          </div>
          <div v-else-if="contentData" :class="[
            'transition-all duration-1000 delay-300',
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]">
            <article class="prose prose-lg max-w-none about-content">
              <ContentRenderer :value="contentData" />
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart, Sparkles } from 'lucide-vue-next'

const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation(0.2)
const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation(0.2)

const { data: contentData, pending: contentPending, error: contentError } = await useAsyncData('content-about', () => 
  queryCollection('content').path('/about').first()
)

const imgSrc = ref(`/shannon-cropped.png?v=${Date.now()}`)
const hasError = ref(false)

const handleImgError = () => {
  if (!hasError.value) {
    hasError.value = true
    imgSrc.value = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop'
  }
}
</script>

<style scoped>
.about-content :deep(h1) {
  color: #488B98; /* brand-seaBlue */
}
</style>

