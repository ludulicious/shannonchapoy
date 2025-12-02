<template>
  <section id="services" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div
        ref="headerRef"
        :class="[
          'transition-all duration-1000',
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        ]"
      >
        <h2 class="font-serif text-2xl font-bold text-brand-charcoal mb-4">Ways I support you</h2>
        <h3 class="font-serif text-3xl font-bold text-brand-dkPurple mb-4">Choose the path that best fits your journey</h3>
        <p class="text-brand-charcoal max-w-2xl mx-auto mb-16">Whether you prefer a small group support and transformation journey or a private deeper love journey, I have a program for you.</p>
      </div>

      <div
        ref="cardsRef"
        class="grid md:grid-cols-3 gap-8"
      >
        <NuxtLink
          v-for="(service, index) in services"
          :key="index"
          :to="service.link"
          :class="[
            'group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 flex flex-col block',
            cardsVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-10 scale-95'
          ]"
          :style="{
            transitionDelay: `${index * 150}ms`,
            animationDelay: `${index * 150}ms`
          }"
        >
          <div :class="['h-3', service.color, 'transition-all duration-300 group-hover:h-4']"></div>
          <div class="p-8 flex flex-col flex-grow">
            <div :class="['w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-md', service.color, 'group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6']">
              <component :is="service.iconComponent" class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-serif text-2xl font-bold text-brand-charcoal mb-4">{{ service.title }}</h3>
            <p class="text-gray-600 mb-6 flex-grow">{{ service.description }}</p>
            <div :class="['inline-flex items-center', service.textColor, 'font-semibold hover:brightness-75 transition-all duration-300 group-hover:gap-2 mt-auto']">
              Learn More <ArrowRight class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart, Users, Sun, ArrowRight } from 'lucide-vue-next'

const services = [
  {
    title: "Peace & Joy Circle",
    description: "Start your journey and join one of our PJ Circles, a community of like-minded women who are committed to living a life of peace and joy. Share experiences, grow together, and build lasting connections.",
    iconComponent: Users,
    color: "bg-brand-seaBlue",
    textColor: "text-brand-seaBlue",
    link: "/pj-circle"
  }, 
  {
    title: "1:1 Love Coaching",
    description: "Personalized guidance tailored to your unique goals and challenges. We'll work together to unlock your potential.",
    iconComponent: Heart,
    color: "bg-brand-ltPurple",
    textColor: "text-brand-ltPurple",
    link: "/one-on-one-love-coaching"
  },
  {
    title: "The Art of Dating Yourself",
    description: "A series of workshops designed to help you date yourself better. We'll cover topics like self-love, self-care, and self-improvement.",
    iconComponent: Sun,
    color: "bg-brand-skyBlue",
    textColor: "text-brand-skyBlue",
    link: "/art-of-dating-yourself"
  },
]

const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation(0.2)
const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1)
</script>

