<script setup>
//DATA DA AGGIUNGERE
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/store/authStore.js'; //IMPORT STORE AUTENTICAZIONE

const AuthStore = useAuthStore(); //HOOK PER ACCEDERE ALLO STORE DI AUTENTICAZIONE
</script>

<template>
  <header class="bg-white shadow">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div class="flex items-center space-x-6">
        <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
        <nav class="flex space-x-4">
          <RouterLink to="/" class="text-gray-700 hover:text-blue-600">Home</RouterLink>
          <a href="#" class="text-gray-700 hover:text-blue-600">Ricerca</a>
          <RouterLink to="/aziende" class="text-gray-700 hover:text-blue-600">Aziende</RouterLink>
          <a href="#" class="text-gray-700 hover:text-blue-600">Servizi</a>
          <a href="#" class="text-gray-700 hover:text-blue-600">Contatti</a>
        </nav>
      </div>
      <div v-if="AuthStore.isLoggedIn">
        <RouterLink :to="`/azienda/${ AuthStore.user._id }`" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.355 1.112 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span >Il mio profilo</span>
        </RouterLink>
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

