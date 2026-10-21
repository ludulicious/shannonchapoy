<script setup lang="ts">
import { defaultThankYouCopy, resolveThankYouCopy, type ThankYouVariant } from '~~/shared/utils/thankYou'

const route = useRoute()
const templatePath = computed(() => `/thank-you-texts/${[route.params.template].flat().join('/')}`)
const { data: document } = await useAsyncData(templatePath.value, () =>
  queryCollection('thankYou').path(templatePath.value).first()
)
if (!document.value) {
  throw createError({ statusCode: 404, statusMessage: 'Thank-you text not found' })
}
const { data: allDocuments } = await useAsyncData('thank-you-preview-documents', () =>
  queryCollection('thankYou').all()
)
const slugInput = ref(String(route.query.slug || document.value.productSlug || document.value.previewSlug || ''))
const previewSlug = ref(slugInput.value.trim())
const frame = ref<HTMLIFrameElement>()
const frameError = ref(false)
const selectedVariant = ref<ThankYouVariant>(document.value.variant)
const portalUrl = new URL(useRuntimeConfig().public.portalUrl)
const previewUrl = computed(() => {
  if (!previewSlug.value || !document.value) {
    return ''
  }
  const url = new URL(`/store/thank-you-preview/${encodeURIComponent(previewSlug.value)}`, portalUrl.origin)
  url.searchParams.set('locale', document.value!.locale)
  url.searchParams.set('variant', selectedVariant.value)
  return url.toString()
})
const previewCopy = computed(() =>
  !document.value
    ? defaultThankYouCopy(selectedVariant.value, 'en')
    : resolveThankYouCopy(
        [document.value!, ...(allDocuments.value || []).filter((item) => item.id !== document.value!.id)],
        previewSlug.value,
        selectedVariant.value,
        document.value!.locale
      )
)
function sendCopy() {
  if (!document.value) {
    return
  }
  frame.value?.contentWindow?.postMessage(
    { type: 'products:thank-you-preview', copy: previewCopy.value, variant: selectedVariant.value },
    portalUrl.origin
  )
}
function receive(event: MessageEvent) {
  if (event.origin !== portalUrl.origin || event.source !== frame.value?.contentWindow) {
    return
  }
  if (event.data?.type === 'products:thank-you-preview-ready') {
    frameError.value = false
    sendCopy()
  }
}
function preview() {
  previewSlug.value = slugInput.value.trim()
  frameError.value = false
}
watch(previewCopy, sendCopy)
onMounted(() => {
  window.addEventListener('message', receive)
  sendCopy()
})
onBeforeUnmount(() => window.removeEventListener('message', receive))
useSeoMeta({ title: `Preview: ${document.value.title}`, robots: 'noindex, nofollow', referrer: 'no-referrer' })
</script>

<template>
  <main v-if="document" class="text-preview">
    <header class="text-preview__header">
      <p class="text-preview__label">Thank-you text preview</p>
      <h1>{{ document!.title }}</h1>
      <p>Choose a product slug to preview this text in the checkout page. No order will be placed.</p>
      <form class="text-preview__controls" @submit.prevent="preview">
        <label
          >Product slug
          <input v-model="slugInput" maxlength="200" placeholder="Enter a product slug" required />
        </label>
        <label
          >Order variant
          <select v-model="selectedVariant">
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <button type="submit">Preview product</button>
      </form>
      <p v-if="document!.productSlug" class="text-preview__hint">
        This text applies to {{ document!.productSlug }}. Blank fields inherit the {{ document!.variant }} default.
      </p>
      <p v-else class="text-preview__hint">
        This is the {{ document!.variant }} default. A product-specific text takes priority for that product.
      </p>
    </header>
    <p v-if="!previewUrl" class="text-preview__empty">Enter the product slug above to see its checkout page.</p>
    <p v-if="frameError" role="alert">
      The preview could not be loaded. Check the product slug and portal address, then try again.
    </p>
    <iframe
      v-if="previewUrl"
      ref="frame"
      :key="previewUrl"
      :src="previewUrl"
      title="Checkout thank-you page preview"
      class="text-preview__frame"
      sandbox="allow-scripts allow-same-origin"
      referrerpolicy="no-referrer"
      @load="sendCopy"
      @error="frameError = true"
    />
  </main>
</template>

<style scoped>
.text-preview {
  min-height: 100vh;
  padding: 8rem 1rem 3rem;
  background: var(--color-catalog-paper);
  color: var(--color-catalog-ink);
}
.text-preview__header,
.text-preview__empty {
  max-width: 70rem;
  margin: 0 auto 1.5rem;
}
.text-preview__label {
  color: var(--color-catalog-accent);
  font-weight: 700;
}
.text-preview h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--color-catalog-display);
  margin: 0.5rem 0;
}
.text-preview__controls {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}
.text-preview__controls label {
  display: grid;
  gap: 0.5rem;
  font-weight: 700;
}
.text-preview__controls input,
.text-preview__controls select {
  max-width: 100%;
  border: 1px solid var(--color-catalog-rule);
  border-radius: 0.5rem;
  background: var(--color-catalog-surface);
  padding: 0.75rem;
  font: inherit;
}
.text-preview__controls button {
  background: var(--color-catalog-action);
  color: var(--color-catalog-action-ink);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  white-space: nowrap;
  font-weight: 700;
}
.text-preview__controls :focus-visible {
  outline: 3px solid var(--color-catalog-focus);
  outline-offset: 3px;
}
.text-preview__hint {
  color: var(--color-catalog-muted);
}
.text-preview__frame {
  display: block;
  width: min(100%, 80rem);
  min-height: 70rem;
  margin: 0 auto;
  border: 1px solid var(--color-catalog-rule);
  border-radius: 0.75rem;
  background: var(--color-catalog-surface);
}
</style>
