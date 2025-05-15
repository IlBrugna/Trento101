<script setup>
//DATA DA AGGIUNGERE
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import { useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/store/authStore.js'; //IMPORT STORE AUTENTICAZIONE
import { companyLogout } from '@/api/authApi';

const router = useRouter()

const AuthStore = useAuthStore(); //HOOK PER ACCEDERE ALLO STORE DI AUTENTICAZIONE
async function handleLogout() {
  await companyLogout()
  router.push('/')
}
</script>

<template>
  <header class="bg-white shadow">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div class="flex items-center space-x-6">
        <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
        <nav class="flex space-x-4">
          <RouterLink to="/" class="text-gray-700 hover:text-blue-600">Home</RouterLink>
          <RouterLink to="/aziende" class="text-gray-700 hover:text-blue-600">Aziende</RouterLink>
          <a href="#" class="text-gray-700 hover:text-blue-600">Servizi</a>
          <a href="#" class="text-gray-700 hover:text-blue-600">Contatti</a>
        </nav>
      </div>
      <div v-if="AuthStore.isLoggedIn" class="flex items-center space-x-4">

        <RouterLink to="/aziende" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
          <span >Modifica la tua pagina</span>
        </RouterLink>

        <button @click="handleLogout" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1" />
          </svg>
          <span>Logout</span>
        </button>

      </div>
      <div v-else>
        <RouterLink to="/login" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.355 1.112 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span >Login</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

