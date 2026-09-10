<script setup lang="ts">
const { elementRef: contentRef, isVisible } = useScrollAnimation(0.2)
</script>

<template>
  <section id="philosophy" class="py-32 md:py-24 relative bg-brand-dkPurple text-white overflow-hidden">
    <div class="philosophy-background absolute inset-0">
      <!-- Background Image -->
      <picture>
        <source media="(max-width: 767px)" srcset="/images/philosophy-butterflies-mobile.jpg" />
        <img
          src="/images/philosophy-butterflies.jpg"
          alt=""
          width="2172"
          height="724"
          loading="lazy"
          class="philosophy-image w-full h-full object-cover"
        />
      </picture>
      <!-- Keep the quote crisp while preserving the butterflies around the edges. -->
      <div class="absolute inset-0 bg-black/15"></div>
    </div>

    <div
      ref="contentRef"
      :class="[
        'relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      ]"
    >
      <span
        :class="[
          'inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold tracking-wider mb-6 text-white transition-all duration-1000 delay-200',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        ]"
      >
        MY PHILOSOPHY
      </span>
      <h2
        :class="[
          'font-serif text-3xl md:text-5xl font-bold mb-8 leading-tight text-balance drop-shadow-lg transition-all duration-1000 delay-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        ]"
      >
        "Transformation is not about becoming someone new, it's about becoming who you were always meant to be."
      </h2>
      <p
        :class="[
          'text-xl text-white/90 mb-10 italic font-serif transition-all duration-1000 delay-500',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        ]"
      >
        - Shannon Chapoy
      </p>
      <div
        :class="[
          'flex justify-center space-x-2 transition-all duration-1000 delay-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        ]"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="w-3 h-3 bg-white rounded-full opacity-50"
          :style="{ animationDelay: `${700 + i * 100}ms` }"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Preserve the full butterfly border where the panoramic image would crop at the sides. */
@media (min-width: 768px) and (max-width: 1535px) {
  .philosophy-background {
    background: #211529;
  }

  .philosophy-image {
    position: absolute;
    top: 50%;
    width: 100%;
    height: auto;
    transform: translateY(-50%);
    mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
  }
}
</style>
