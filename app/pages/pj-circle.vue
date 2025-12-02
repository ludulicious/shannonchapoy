<template>
  <div class="flex-1 pt-24 pb-16">
    <!-- Title Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-brand-seaBlue flex-shrink-0">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-brand-seaBlue">Free first session inside a Peace & Joy Circle</h1>
      </div>
    </div>

    <!-- Markdown Content Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div v-if="introPending" class="flex justify-center items-center py-12">
        <div class="text-brand-charcoal">Loading...</div>
      </div>
      <div v-else-if="introError" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 class="text-red-800 font-semibold mb-2">Error loading content</h2>
        <p class="text-red-600">{{ introError }}</p>
      </div>
      <article v-else-if="introData" class="prose prose-lg max-w-none">
        <ContentRenderer :value="introData" />
      </article>
    </div>

    <!-- Code Validation / Contact Form Section -->
    <section class="bg-brand-soft">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Code Input Form (shown when code not validated) -->
        <div
          v-if="!codeValidated"
          ref="elementRef"
          :class="[
            'bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000',
            formVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          ]"
        >
          <div class="bg-brand-seaBlue p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <div>
                <h3 class="font-serif text-3xl font-bold mb-6">Start Your Journey</h3>
                <p class="text-white/80 mb-8">Enter your access code to continue and sign up for a free first session.</p>
              </div>
            </div>
          </div>

          <div class="md:w-4/5 p-10 flex flex-col justify-center">
            <form @submit.prevent="validateCode" class="space-y-6">
              <div>
                <label for="access-code" class="block text-sm font-medium text-gray-700 mb-2">
                  Access Code
                </label>
                <input
                  id="access-code"
                  v-model="code"
                  type="text"
                  required
                  :disabled="validating"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-seaBlue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your access code"
                />
              </div>
              
              <div v-if="validationError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800 text-sm">{{ validationError }}</p>
              </div>

              <button
                type="submit"
                :disabled="validating || !code.trim()"
                class="w-full bg-brand-seaBlue text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-seaBlue/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span v-if="validating">Validating...</span>
                <span v-else>Continue</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Registration Form (shown when code is validated) -->
        <div
          v-else
          ref="elementRef"
          :class="[
            'bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000',
            formVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          ]"
        >
          <div class="bg-brand-seaBlue p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <div>
                <h3 class="font-serif text-3xl font-bold mb-6">Start Your Journey</h3>
                <p class="text-white/80 mb-8">Ready to start your journey? <br/> <br/> Sign up for a free first session and start your transformation today.</p>
              </div>
            </div>
          </div>

          <div class="md:w-4/5">
            <iframe
              src="https://actions.shannonchapoy.com/widget/form/6lN7WgzfJecJjmfppVfx"
              style="width: 100%; height: 100%; border: none; border-radius: 4px;"
              id="inline-6lN7WgzfJecJjmfppVfx"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Sign up for PJ Circle"
              data-height="555"
              data-layout-iframe-id="inline-6lN7WgzfJecJjmfppVfx"
              data-form-id="6lN7WgzfJecJjmfppVfx"
              title="Sign up for PJ Circle"
            >
            </iframe>
          </div>
        </div>
      </div>
    </section>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div v-if="contentPending" class="flex justify-center items-center py-12">
        <div class="text-brand-charcoal">Loading...</div>
      </div>
      <div v-else-if="contentError" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 class="text-red-800 font-semibold mb-2">Error loading content</h2>
        <p class="text-red-600">{{ contentError }}</p>
      </div>
      <article v-else-if="contentData" class="prose prose-lg max-w-none">
        <ContentRenderer :value="contentData" />
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users } from 'lucide-vue-next'

const isVisible = ref(false)
const { elementRef, isVisible: formVisible } = useScrollAnimation(0.2)

// Code validation state
const code = ref('')
const codeValidated = ref(false)
const validating = ref(false)
const validationError = ref('')

// Validate code via API
const validateCode = async () => {
  if (!code.value.trim()) {
    validationError.value = 'Please enter an access code'
    return
  }

  validating.value = true
  validationError.value = ''

  try {
    const response = await $fetch('/api/validate-code', {
      method: 'POST',
      body: {
        code: code.value.trim(),
        formType: 'pj-circle'
      }
    })

    if (response.valid) {
      codeValidated.value = true
      validationError.value = ''
    } else {
      validationError.value = response.error || 'Invalid access code'
    }
  } catch (error: any) {
    validationError.value = error.data?.error || 'Failed to validate code. Please try again.'
  } finally {
    validating.value = false
  }
}

const { data: introData, pending: introPending, error: introError } = await useAsyncData('content-pj-intro', () => 
  queryCollection('content').path('/pj-circle-intro').first()
)

const { data: contentData, pending: contentPending, error: contentError } = await useAsyncData('content-pj-circle', () => 
  queryCollection('content').path('/pj-circle').first()
)

useHead({
  title: 'PJ Circle - Shannon Chapoy'
})

onMounted(() => {
  if (process.client) {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    isVisible.value = true
  }
})
</script>

