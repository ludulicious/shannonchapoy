<script setup lang="ts">
const { elementRef: contentRef, isVisible } = useScrollAnimation(0.2)
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden flex items-center justify-center bg-brand-charcoal">
    <!-- Background Image -->
    <img
      src="/images/hero-flowers-butterflies.jpg"
      alt=""
      width="1536"
      height="1024"
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <!-- A restrained plum shade preserves the flowers and contrast behind the white copy. -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-brand-dkPurple/30 via-brand-dkPurple/20 to-brand-dkPurple/40 z-10"
    ></div>
    <div class="absolute inset-0 bg-black/10 z-10"></div>

    <!-- Main Content -->
    <div
      ref="contentRef"
      :class="[
        'relative z-20 text-center px-4 max-w-5xl mx-auto transition-all duration-1000',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      ]"
    >
      <h1
        :class="[
          'font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight text-white',
          isVisible ? 'animate-slide-in-top-bounce' : ''
        ]"
        :style="!isVisible ? { transform: 'translateY(-200px)' } : undefined"
      >
        Are you ready to begin your greatest love journey?
      </h1>
      <p
        :class="[
          'font-sans font-semibold text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-4 drop-shadow-lg transition-all duration-1000 delay-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        ]"
      >
        It starts with learning to date yourself first.<br />
        I went from buying a single bed to finding <br />soulmate love in just one year.<br />
        <br />If I can - you can too!
      </p>
      <div
        :class="[
          'flex flex-col sm:flex-row gap-5 justify-center transition-all duration-1000 delay-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        ]"
      >
        <NuxtLink
          to="/pj-circle"
          class="px-10 py-4 bg-brand-ltPurple text-white rounded-full font-bold text-lg hover:bg-brand-dkPurple transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
        >
          Start Your Journey
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
