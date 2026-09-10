<script setup lang="ts">
const { elementRef: contentRef, isVisible } = useScrollAnimation(0.2)
</script>

<template>
  <div
    class="relative min-h-[100svh] md:min-h-screen w-full overflow-hidden flex items-start md:items-center justify-center bg-brand-charcoal pt-32 pb-64 md:py-32"
  >
    <!-- Background Image -->
    <picture class="absolute inset-0 z-0">
      <source media="(max-width: 767px)" srcset="/images/hero-flowers-butterflies-mobile.jpg" />
      <img
        src="/images/hero-flowers-butterflies.jpg"
        alt=""
        width="1536"
        height="1024"
        fetchpriority="high"
        class="w-full h-full object-cover"
      />
    </picture>

    <!-- A restrained plum shade preserves the flowers and contrast behind the white copy. -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-brand-dkPurple/30 via-brand-dkPurple/20 to-brand-dkPurple/40 z-10"
    ></div>
    <div class="absolute inset-0 bg-black/10 z-10"></div>

    <!-- Main Content -->
    <div
      ref="contentRef"
      :class="[
        'relative z-20 w-full text-center px-6 md:px-4 max-w-5xl mx-auto transition-all duration-1000',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      ]"
    >
      <h1
        :class="[
          'font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight text-white text-balance',
          isVisible ? 'animate-slide-in-top-bounce' : ''
        ]"
        :style="!isVisible ? { transform: 'translateY(-200px)' } : undefined"
      >
        Are you ready to begin your greatest love journey?
      </h1>
      <div
        :class="[
          'font-sans font-semibold text-lg md:text-2xl lg:text-3xl text-white/95 mb-8 md:mb-10 leading-relaxed max-w-sm md:max-w-2xl mx-auto md:px-4 drop-shadow-lg transition-all duration-1000 delay-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        ]"
      >
        <p class="text-balance">It starts with learning to date yourself first.</p>
        <p class="mt-3 md:mt-0 text-pretty">
          I went from buying a single bed to finding soulmate love in just one year.
        </p>
        <p class="mt-5 md:mt-8">If I can - you can too!</p>
      </div>
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
