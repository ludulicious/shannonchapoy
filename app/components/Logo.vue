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
  <span
    v-if="variant === 'light'"
    role="img"
    aria-label="Shannon Chapoy"
    :class="['logo-pastel block w-40 md:w-48 aspect-[1880/837]', className]"
  ></span>
  <img
    v-else
    src="/images/shannon-chapoy-logo.png"
    alt="Shannon Chapoy"
    width="1880"
    height="837"
    :class="['block w-40 md:w-48 h-auto', className]"
  />
</template>

<style scoped>
.logo-pastel {
  background: linear-gradient(110deg, #b6efff 0%, #d5eaff 35%, #e4d5ff 68%, #edcfff 100%);
  -webkit-mask: url('/images/shannon-chapoy-logo.png') center / contain no-repeat;
  mask: url('/images/shannon-chapoy-logo.png') center / contain no-repeat;
}
</style>
