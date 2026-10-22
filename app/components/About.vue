<script setup lang="ts">
const route = useRoute()
const fullStory = computed(() => route.path === '/about')
const { data: contentData } = await useAsyncData('content-about', () =>
  queryCollection('content').path('/about').first()
)
</script>

<template>
  <section id="about" class="about-section" aria-labelledby="about-title">
    <div class="about-layout">
      <img
        src="/shannon-cropped.png"
        alt="Shannon Chapoy"
        width="600"
        height="700"
        loading="lazy"
        class="about-portrait"
      />
      <div>
        <template v-if="fullStory && contentData">
          <h2 id="about-title" class="sr-only">Meet Shannon</h2>
          <article class="prose prose-lg max-w-none"><ContentRenderer :value="contentData" /></article>
        </template>
        <template v-else>
          <h2 id="about-title">I've been where you are.</h2>
          <p>
            After more than 30 years in international business, my life looked successful on paper. But I felt lonely
            and disconnected from myself.
          </p>
          <p>
            Learning to enjoy my own company changed how I showed up in my life and relationships. Now I support other
            women as they reconnect with themselves, understand what they need, and decide what comes next.
          </p>
          <p class="about-signature">Shannon Chapoy · Self-love &amp; relationship coach</p>
          <NuxtLink to="/about" class="conversion-text-link">Read my story</NuxtLink>
        </template>
        <div class="about-action">
          <NuxtLink to="/offerings" class="conversion-button">Find your next step</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  background: var(--color-catalog-surface);
  padding: var(--space-catalog-section) var(--space-catalog-lg);
}
.about-layout {
  max-width: 68rem;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: var(--space-catalog-xl);
}
.about-portrait {
  width: 100%;
  max-height: 28rem;
  object-fit: cover;
  object-position: left center;
  border-radius: var(--radius-catalog-card);
}
.about-section h2 {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: clamp(2rem, 3vw, 2.75rem);
  line-height: 1.2;
  font-weight: 700;
  overflow-wrap: anywhere;
  margin-bottom: var(--space-catalog-lg);
}
.about-section p {
  color: var(--color-catalog-muted);
  line-height: 1.75;
  margin-bottom: var(--space-catalog-md);
}
.about-section .about-signature {
  color: var(--color-catalog-display);
  font-weight: 700;
  font-size: var(--text-catalog-sm);
}
.about-action {
  margin-top: var(--space-catalog-lg);
}
@media (min-width: 48rem) {
  .about-layout {
    grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
    gap: var(--space-catalog-2xl);
  }
}
</style>
