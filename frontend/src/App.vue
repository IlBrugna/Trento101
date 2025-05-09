<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import HeaderNav from './components/common/HeaderNav.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderNav />
    <RouterView />
    <footer class="bg-gray-100 py-4 text-center text-sm">
      TRENTO 101 
    </footer>
  </div>
</template>
<style scoped>
</style>