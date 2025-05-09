<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-4 flex flex-col h-full">
      <div class="w-16 h-16 mx-auto mb-4">
        <img :src="company.logo || '/placeholder-logo.png'" 
             alt="Company Logo" 
             class="w-full h-full object-contain rounded-md" 
             @error="$event.target.src='/placeholder-logo.png'" />
      </div>
      
      <!-- Nome -->
      <h3 class="text-lg font-bold text-center mb-2 text-gray-800">{{ company.name }}</h3>
      
      <!-- Descrizione -->
      <p class="text-sm text-gray-600 flex-grow mb-4">{{ company.description }}</p>
      
      <!-- Dettagli -->
      <div class="mt-auto">
        <div v-if="company.address" class="flex items-center text-sm text-gray-500 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ company.address }}
        </div>
        <div v-if="company.website" class="flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a :href="company.website" target="_blank" class="hover:text-blue-500">{{ company.website }}</a>
        </div>
        <div v-if="company.email" class="flex items-center text-sm text-gray-500 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a :href="`mailto:${company.email}`" class="hover:text-blue-500">{{ company.email }}</a>
        </div>
      </div>
      
      <!-- Bottone per visualizzare i dettagli -->
      <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md w-full transition-colors duration-300">
        Visualizza dettagli
      </button>
    </div>
  </div>
</template>