<script setup>
import UniversitaHeroSection from '@/components/universitaPanel/UniversitaHeroSection.vue';
import UniversitaServiceCarousel from '@/components/universitaPanel/UniversitaServiceCarousel.vue';
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <UniversitaHeroSection />

    <section id="servizi" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Servizi Offerti</h2>
      <UniversitaServiceCarousel />
    </section>
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Altri Servizi</h2>
      <UniversitaServiceCarousel :secondary="true" />
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
