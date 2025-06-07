<script setup>
import { ref, onMounted, nextTick } from 'vue';

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: 'https://www.example.com'
  },
  companyName: {
    type: String,
    required: true
  }
});

const mapContainer = ref(null);
const isLoading = ref(true);

const initMap = async () => {
  try {
    if (!mapContainer.value) {
      console.error('Container della mappa non trovato');
      return;
    }

    // Geocoding usando Nominatim
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(props.address)}`);
    const data = await response.json();

    if (data && data[0]) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      //INIT
      const map = L.map(mapContainer.value).setView([lat, lon], 15);

      //LAYER OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      //MARKER
      L.marker([lat, lon])
        .addTo(map)

      //Forza il ridimensionamento della mappa
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
    } else {
      console.error('Indirizzo non trovato');
    }
  } catch (error) {
    console.error('Errore caricamento mappa:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  //ASPETTARE CHE DOM SIA PRONTO
  await nextTick();
  
  // TIMEOUT PER GARANTIRE CHE SIA PRONTO
  setTimeout(() => {
    initMap();
  }, 400);
});
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-800 mb-4">Contatti</h2>
    
    <ul class="space-y-3 mb-6">
      <li class="flex items-start">
        <div class="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Email</p>
          <p class="text-sm text-gray-600">{{ email }}</p>
        </div>
      </li>
      
      <li class="flex items-start">
        <div class="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Telefono</p>
          <p class="text-sm text-gray-600">{{ phoneNumber }}</p>
        </div>
      </li>
      
      <li class="flex items-start">
        <div class="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Indirizzo</p>
          <p class="text-sm text-gray-600">{{ address }}</p>
        </div>
      </li>

      <li v-if="website" class="flex items-start">
        <div class="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Sito Web</p>
          <p class="text-sm text-gray-600">{{ website }}</p>
        </div>
      </li>
    </ul>

    <!-- SEZIONE MAPPA -->
    <div class="border-t pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-md font-medium text-emerald-800">Posizione</h3>
      </div>

      <!-- Mappa -->
      <div class="relative">
        <div v-if="isLoading" class="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p class="text-sm text-gray-600">Caricamento mappa...</p>
          </div>
        </div>

        <div v-show="!isLoading" ref="mapContainer" class="h-48 w-full rounded-lg border" style="min-height: 192px;"></div>
      </div>
    </div>
  </div>
</template>