<script setup lang="ts">
const route = useRoute()
const fullStory = computed(() => route.path === '/about')
const { data: contentData } = await useAsyncData('content-about', () => queryCollection('homepage_about').first())
</script>

<template>
  <section v-if="contentData" id="about" class="about-section" aria-label="About Shannon">
    <div class="about-layout">
      <img
        :src="contentData.image"
        :alt="contentData.imageAlt"
        width="600"
        height="700"
        loading="lazy"
        class="about-portrait"
      />
      <div>
        <ContentRenderer :value="contentData" />
        <NuxtLink v-if="!fullStory" to="/about" class="conversion-text-link">{{ contentData.storyLinkLabel }}</NuxtLink>
        <div class="about-action">
          <NuxtLink to="/offerings" class="conversion-button">{{ contentData.actionLabel }}</NuxtLink>
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
.about-section :deep(h2) {
  color: var(--color-catalog-display);
  font-family: var(--font-catalog-display);
  font-size: clamp(2rem, 3vw, 2.75rem);
  line-height: 1.2;
  font-weight: 700;
  overflow-wrap: anywhere;
  margin-bottom: var(--space-catalog-lg);
}
.about-section :deep(p) {
  color: var(--color-catalog-muted);
  line-height: 1.75;
  margin-bottom: var(--space-catalog-md);
}
.about-section :deep(.about-summary > p:last-child) {
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
