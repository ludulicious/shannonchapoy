<script setup lang="ts">
import { loadTurnstile } from '~/utils/turnstile'

const config = useRuntimeConfig()
const model = defineModel<string>({ default: '' })
const container = useTemplateRef<HTMLDivElement>('container')
const error = ref('')
const loading = ref(false)
let widgetId: string | undefined
let disposed = false
let compact: MediaQueryList | undefined

function renderWidget() {
  if (disposed || !container.value || !window.turnstile) {
    return
  }
  model.value = ''
  if (widgetId !== undefined) {
    window.turnstile.remove(widgetId)
  }
  widgetId = window.turnstile.render(container.value, {
    sitekey: config.public.turnstileSiteKey,
    action: 'contact',
    theme: 'light',
    size: compact?.matches ? 'compact' : 'flexible',
    'response-field': false,
    callback: (token) => {
      model.value = token
      error.value = ''
    },
    'expired-callback': () => {
      model.value = ''
    },
    'error-callback': () => {
      model.value = ''
      error.value = 'The security check could not load. Please try again.'
    },
    'timeout-callback': () => {
      model.value = ''
      error.value = 'The security check timed out. Please try again.'
    }
  })
}

async function start() {
  if (loading.value || !config.public.turnstileSiteKey) {
    return
  }
  loading.value = true
  error.value = ''
  try {
    await loadTurnstile()
    renderWidget()
  } catch {
    if (!disposed) {
      error.value = 'The security check could not load. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

function reset() {
  model.value = ''
  error.value = ''
  if (widgetId !== undefined && window.turnstile) {
    window.turnstile.reset(widgetId)
  }
}

defineExpose({ reset })

onMounted(() => {
  compact = window.matchMedia('(max-width: 479px)')
  compact.addEventListener('change', renderWidget)
  void start()
})

onBeforeUnmount(() => {
  disposed = true
  model.value = ''
  compact?.removeEventListener('change', renderWidget)
  if (widgetId !== undefined && window.turnstile) {
    window.turnstile.remove(widgetId)
  }
})
</script>

<template>
  <div class="min-w-0">
    <div ref="container" />
    <p v-if="loading" class="text-sm text-brand-charcoal" role="status">Loading security check…</p>
    <div v-if="error" class="text-sm mt-2" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="conversion-text-link mt-2" :disabled="loading" @click="start">Try again</button>
    </div>
  </div>
</template>
