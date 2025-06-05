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
  <div class="min-h-screen flex flex-col bg-emerald-50">
    <HeaderNav />
    <RouterView class="flex-grow"/>
    <footer class="bg-emerald-700 py-4 text-center text-sm text-white border-t border-emerald-900 relative">
      TRENTO 101 &copy; {{ new Date().getFullYear() }}
      <button
        @click="window.scrollTo({top:0,behavior:'smooth'})"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-800 text-white px-3 py-1 rounded shadow transition"
        title="Torna su"
      >
        ↑
      </button>
    </footer>
  </div>
</template>
<style scoped>
</style>