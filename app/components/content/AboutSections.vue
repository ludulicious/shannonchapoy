<script setup lang="ts">
import { aboutStoryKey } from '~/utils/aboutContent'

const fullStory = inject(aboutStoryKey, ref(false))
</script>

<template>
  <Transition name="about-copy" mode="out-in">
    <article v-if="fullStory" key="story" class="prose prose-lg max-w-none">
      <slot name="story" />
    </article>
    <div v-else key="summary" class="about-summary prose prose-lg max-w-none">
      <slot name="summary" />
    </div>
  </Transition>
</template>

<style scoped>
.about-copy-enter-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}
.about-copy-leave-active {
  transition: opacity 120ms ease;
}
.about-copy-enter-from,
.about-copy-leave-to {
  opacity: 0;
}
.about-copy-enter-from {
  transform: translateY(4px);
}
@media (prefers-reduced-motion: reduce) {
  .about-copy-enter-active,
  .about-copy-leave-active {
    transition: none;
  }
  .about-copy-enter-from {
    transform: none;
  }
}
</style>
