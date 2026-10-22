<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { catalogOfferDeadline } from '~/utils/catalogOffer'
import type { CatalogProduct } from '~/utils/catalogProduct'

defineProps<{ product?: CatalogProduct; offerDeadline?: ReturnType<typeof catalogOfferDeadline> }>()
</script>

<template>
  <section class="conversion-hero" aria-labelledby="hero-title">
    <picture class="conversion-hero__background" aria-hidden="true">
      <source media="(max-width: 1023px)" srcset="/images/hero-botanical-white-mobile.jpg" width="1024" height="1536" />
      <img src="/images/hero-botanical-white.jpg" alt="" width="1942" height="809" fetchpriority="high" />
    </picture>
    <div class="conversion-hero__layout">
      <h1 id="hero-title">Ready for your greatest love?</h1>
      <p class="conversion-hero__copy">
        Start by dating yourself. I went from a single bed to soulmate love in a year. If I can, you can too!
      </p>
      <FeaturedSessionCard v-if="product" id="offerings" :product="product" :offer-deadline="offerDeadline" />
      <NuxtLink v-else to="/offerings" class="conversion-button">
        Explore offerings <ArrowRight aria-hidden="true" />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: hero · theme: inherited · anchor hue: purple
 * pre-emit critique: P4 H5 E5 S5 R5 V4 · white botanical artwork, clear copy, one booking action */
.conversion-hero {
  position: relative;
  isolation: isolate;
  background: var(--color-catalog-surface);
  color: var(--color-catalog-muted);
  padding: 6.5rem var(--space-catalog-lg) clamp(16rem, 75vw, 22rem);
}
.conversion-hero__background {
  position: absolute;
  inset: 0;
  z-index: -1;
}
.conversion-hero__background img {
  position: absolute;
  right: 0;
  bottom: 0;
  width: min(100%, 28rem);
  height: auto;
}
.conversion-hero__layout {
  max-width: 76rem;
  margin-inline: auto;
  min-width: 0;
}
.conversion-hero h1 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: clamp(2.25rem, 5.2vw, 4.25rem);
  font-weight: 700;
  font-style: normal;
  letter-spacing: -0.035em;
  line-height: 1.08;
  max-width: 20ch;
  min-width: 0;
  overflow-wrap: anywhere;
}
.conversion-hero__copy {
  max-width: 54ch;
  font-size: clamp(var(--text-catalog-base), 2vw, var(--text-catalog-md));
  line-height: 1.5;
  margin-block: var(--space-catalog-sm) var(--space-catalog-lg);
}
@media (min-width: 64rem) {
  .conversion-hero {
    padding: 9rem var(--space-catalog-xl) var(--space-catalog-2xl);
  }
  .conversion-hero__background {
    inset-block-start: 7rem;
    clip-path: inset(0 0 0 50%);
  }
  .conversion-hero__background img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: right bottom;
  }
}
</style>
