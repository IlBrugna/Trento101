<script setup>
import { ref, onMounted } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import HeaderNav from './components/common/HeaderNav.vue';
import { RouterView } from 'vue-router';
import { checkAuthOnAppLoad } from './api/authApi.js';

onMounted(() => {
  checkAuthOnAppLoad();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderNav />
    <RouterView class="flex-grow"/>
    <footer class="bg-gray-100 py-4 text-center text-sm">
      TRENTO 101 
    </footer>
  </div>
</template>
<style scoped>
</style>