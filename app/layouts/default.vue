<script setup></script>

<template>
  <div class="antialiased text-brand-charcoal bg-brand-soft min-h-screen flex flex-col">
    <Navigation />
    <div class="flex-1">
      <slot />
    </div>
    <Footer />
  </div>
</template>
