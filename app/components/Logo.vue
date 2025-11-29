<template>
  <div :class="['flex items-center', showText ? 'gap-3' : '', className]">
    <svg 
      width="56" 
      height="56" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="w-12 h-12 md:w-14 md:h-14 drop-shadow-sm"
    >
      <!-- Left Upper Wing -->
      <path 
        d="M48 50 C 48 50, 25 25, 10 35 C 0 45, 15 60, 48 58" 
        :stroke="color1" 
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <!-- Inner Vein Left Upper -->
      <path d="M48 50 Q 25 40 18 45" :stroke="color1" stroke-width="1" opacity="0.5" />

      <!-- Left Lower Wing -->
      <path 
        d="M48 58 C 48 58, 15 65, 25 85 C 35 95, 45 80, 48 72" 
        :stroke="color1" 
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Right Upper Wing -->
      <path 
        d="M52 50 C 52 50, 75 25, 90 35 C 100 45, 85 60, 52 58" 
        :stroke="color2" 
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Inner Vein Right Upper -->
      <path d="M52 50 Q 75 40 82 45" :stroke="color2" stroke-width="1" opacity="0.5" />

      <!-- Right Lower Wing -->
      <path 
        d="M52 58 C 52 58, 85 65, 75 85 C 65 95, 55 80, 52 72" 
        :stroke="color2" 
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Body -->
      <path 
        d="M50 42 L50 75" 
        :stroke="bodyColor" 
        stroke-width="3" 
        stroke-linecap="round"
      />
      
      <!-- Antennae -->
      <path d="M50 42 C 50 42, 45 30, 35 35" :stroke="bodyColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M50 42 C 50 42, 55 30, 65 35" :stroke="bodyColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Head dot -->
      <circle cx="50" cy="42" r="2" :fill="bodyColor" />
    </svg>

    <div v-if="showText" class="flex flex-col leading-none justify-center">
      <span :class="['font-serif font-medium text-2xl md:text-3xl tracking-wide', textColorPrimary]">
        Shannon
      </span>
      <span :class="['font-serif font-bold text-2xl md:text-3xl tracking-wide -mt-1', textColorSecondary]">
        Chapoy
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'light' | 'dark' | 'color'
  className?: string
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'color',
  className: '',
  showText: true
})

const color1 = computed(() => props.variant === 'light' ? '#FFFFFF' : '#488B98')
const color2 = computed(() => props.variant === 'light' ? '#E0E7FF' : '#7D337D')
const bodyColor = computed(() => props.variant === 'light' ? '#FFFFFF' : '#543178')

const textColorPrimary = computed(() => props.variant === 'light' ? 'text-white' : 'text-brand-skyBlue')
const textColorSecondary = computed(() => props.variant === 'light' ? 'text-white/90' : 'text-brand-dkPurple')
</script>

