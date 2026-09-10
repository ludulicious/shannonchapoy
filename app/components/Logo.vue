<script setup lang="ts">
interface Props {
  variant?: 'light' | 'dark' | 'color'
  className?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'color',
  className: ''
})
</script>

<template>
  <img
    src="/images/shannon-chapoy-logo.png"
    alt="Shannon Chapoy"
    width="1880"
    height="837"
    :class="['block w-40 md:w-48 h-auto', variant === 'light' ? 'brightness-0 invert' : '', className]"
  />
</template>
