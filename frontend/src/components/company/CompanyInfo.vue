<script setup>
import { ref } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: '/placeholder-logo.png'
  }
});
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- FOTO AZIENDA -->
    <div class="h-64 bg-gray-300 relative">
      <img 
        :src="picture" 
        :alt="name" 
        class="w-full h-full object-cover"
      />
    </div>
    
    <!-- INFORMAZIONI AZIENDA -->
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">{{ name }}</h1>
      
      <div class="mb-6">
        <h2 class="text-lg font-medium text-gray-700 mb-2">Descrizione</h2>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </div>
  </div>
</template>