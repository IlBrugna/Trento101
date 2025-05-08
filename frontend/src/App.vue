<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import HeaderNav from './components/HeaderNav.vue';
import SectionCards from './components/SectionCards.vue';
import LatestList from './components/LatestSurvey.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderNav />
    <main class="flex-1 container mx-auto px-4 py-6">
      <SectionCards />
      <LatestList />
    </main>
    <footer class="bg-gray-100 py-4 text-center text-sm">
      TRENTO 101 
    </footer>
  </div>
</template>

<script>
// Test per vedere se funziona il collegamento frontend-backend
// Ritorna il messagio su testRoute.js (ovvero "API is working") sennò da errore
export default {
  name: 'TestApp',
  mounted() {
    fetch('/api/test')
        .then(res => res.text()) // change from res.json() to res.text()
        .then(data => {
            console.log('Raw response:', data);
        })
        .catch(err => console.error('API call failed:', err));
  }
}
</script>

<style scoped>
</style>