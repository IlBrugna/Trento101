<script setup>
import HeroSection from '@/components/comunePanel/HeroSection.vue';
import ServiceCarousel from '@/components/comunePanel/ServiceCarousel.vue';
import NewsCarousel from '@/components/comunePanel/NewsCarousel.vue';
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <HeroSection />
    
    <!-- Servizi principali -->
    <section id="servizi" class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Servizi Principali</h2>
      </div>
      <ServiceCarousel/>
    </section>

    <!-- Altri servizi -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Altri Servizi</h2>
      </div>
      <ServiceCarousel :secondary="true"/>
    </section>

    <!-- Ultime News -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Ultime Notizie</h2>
        <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Tutte le notizie</a>
      </div>
      <NewsCarousel/>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>