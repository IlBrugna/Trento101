<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import HeaderNav from './components/common/HeaderNav.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-emerald-50">
    <HeaderNav />
    <RouterView class="flex-grow"/>
    <footer class="bg-emerald-700 py-4 text-center text-sm text-white border-t border-emerald-900 relative">
      TRENTO 101 &copy; {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>
<style scoped>
iframe.goog-te-banner-frame {
  display: none !important;
}

body {
  top: 0px !important;
}

.goog-logo-link {
  display: none !important;
}

.goog-te-gadget {
  color: transparent !important;
  font-size: 0;
}

</style>