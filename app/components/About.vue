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
          <h2 :class="[
            'font-serif text-4xl font-bold text-brand-dkPurple mb-6 transition-all duration-1000 delay-300',
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]">
            Hi, I'm Shannon
          </h2>
          <div :class="[
            'w-20 h-1 bg-brand-ltPurple mb-8 transition-all duration-1000 delay-400',
            contentVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          ]"></div>
          <p :class="[
            'text-lg text-brand-charcoal mb-6 leading-relaxed transition-all duration-1000 delay-500',
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]">
            I believe that every woman holds the power to transform her life, just as a butterfly emerges from its cocoon with vibrant new wings. My mission is to guide you through your own metamorphosis.
            With 30 years of experience in self development and love coaching, I specialize in helping women break free from limiting beliefs, discover their greatest love and light within, and create a life that feels as good on the inside as it looks on the outside.
          </p>
          <p :class="[
            'text-lg text-brand-charcoal mb-8 leading-relaxed transition-all duration-1000 delay-600',
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]">
            My own journey of self discovery and transformation led me to release old stories of being "unlucky in love and destined to be alone"  to expansive dreaming and creating an abundantly carefree life of love and fun adventures.  And now I'm happily married and living my best life.
            I'm passionate about supporting and guiding women to their greatest love and living their best life.  Let's connect and go on this journey together!
          </p>
          <div :class="[
            'grid grid-cols-2 gap-6 transition-all duration-1000 delay-700',
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          ]">
            <div class="flex items-start space-x-3 group">
              <Heart class="text-brand-ltPurple w-6 h-6 mt-1 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h4 class="font-bold text-brand-charcoal">Compassionate</h4>
                <p class="text-sm text-gray-500">Empathy first approach</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 group">
              <Sparkles class="text-brand-ltPurple w-6 h-6 mt-1 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h4 class="font-bold text-brand-charcoal">Empowering</h4>
                <p class="text-sm text-gray-500">Tools for real change</p>
              </div>
            </div>
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

const imgSrc = ref(`/shannon-cropped.png?v=${Date.now()}`)
const hasError = ref(false)

const handleImgError = () => {
  if (!hasError.value) {
    hasError.value = true
    imgSrc.value = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop'
  }
}
</script>

