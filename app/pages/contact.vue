<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

definePageMeta({ pageTransition: false })

const { data: content } = await useAsyncData('content-contact', () =>
  queryCollection('content').path('/contact').first()
)
usePageSeo(content)
</script>

<template>
  <main class="pt-32 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="contact-page-card">
        <div class="contact-intro">
          <div>
            <p class="text-sm font-semibold tracking-widest uppercase text-white/80 mb-4">Contact Shannon</p>
            <h1 class="font-serif text-4xl md:text-5xl font-bold mb-6">{{ content?.title || "Let's talk." }}</h1>
            <p class="text-lg leading-relaxed text-white/90">
              {{
                content?.description ||
                'Have a question about a session? Send me a message and I’ll help you find the right fit.'
              }}
            </p>
          </div>
          <div class="mt-10 md:mt-16">
            <p class="text-white/80 mb-3">Prefer to email me directly?</p>
            <a
              href="mailto:hello@shannonchapoy.com"
              class="inline-flex items-start gap-3 underline underline-offset-4 break-all"
            >
              <Mail class="w-5 h-5 shrink-0 mt-1" aria-hidden="true" />
              hello@shannonchapoy.com
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  </main>
</template>

<style scoped>
.contact-page-card {
  display: grid;
  overflow: hidden;
  border: 1px solid var(--color-catalog-rule);
  border-radius: 1.5rem;
  background: white;
  box-shadow: var(--shadow-catalog-card);
}
.contact-intro {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--color-catalog-display);
  color: white;
}
@media (min-width: 64rem) {
  .contact-page-card {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  }
}
</style>
