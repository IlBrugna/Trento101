<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { fetchAllComuni } from '@/api/comuneServicesAPI';
import { useStats } from '@/api/statisticsAPI';

const props = defineProps({
  secondary: {
    type: Boolean,
    default: false
  }
});

// Stato per i servizi
const services = ref([]);
const loading  = ref(true);
const error    = ref(null);

// Stats API
const stats = useStats();

// Function to track service clicks
const trackServiceClick = async (service) => {
  console.log('CHIAMATO2');
  try {
    await stats.trackServiceClick({
      serviceId: service._id,
      serviceName: service.title,
      serviceUrl: service.url,
      isPrimary: !props.secondary
    });
  } catch (error) {
    console.log('CHIAMATOERROR');
    console.error('Failed to track service click:', error);
  }
};

// Handle service click
const handleServiceClick = async (service, e) => {
  e.preventDefault();                // blocca la navigazione
  console.log('CHIAMATO1');
  await trackServiceClick(service);  // aspetta la POST
  console.log('CHIAMATO4');
  window.open(service.url, '_blank'); // poi apri la pagina
};

// Fetch dei servizi
const loadServices = async () => {
  try {
    loading.value = true;
   
    const data = await fetchAllComuni();
    services.value = data.filter(service => service.isPrimary !== props.secondary);
   
  } catch (err) {
    console.error('Failed to fetch services:', err);
    error.value = 'Failed to load services. Please try again later.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadServices);
</script>

<template>
  <!-- Stato di caricamento -->
  <div v-if="loading" class="p-4 text-center">
    <div class="animate-pulse flex space-x-4 justify-center">
      <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
      <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
      <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
    </div>
    <p class="mt-2 text-gray-600">Caricamento...</p>
  </div>
 
  <!-- Stato di errore -->
  <div v-else-if="error" class="p-4 text-center text-red-500">
    {{ error }}
  </div>
 
  <!-- Primary Services (Carousel) -->
  <div v-else-if="!secondary" class="flex flex-nowrap gap-4 overflow-x-auto pb-2 snap-x">
    <a
      v-for="service in services"
      :key="service._id"
      :href="service.url"
      rel="noopener noreferrer"
      @click="handleServiceClick(service, $event)"
      class="flex-shrink-0 w-80 snap-start rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white"
    >
      <div class="flex items-center h-24 ">
        <div :class="`h-full w-24 flex items-center justify-center`" :style="{ backgroundColor: service.color }">
            <span class="material-icons text-4xl">{{ service.icon }}</span>
        </div>
        <div class="p-4 flex-1">
          <h3 class="font-bold text-lg">{{ service.title }}</h3>
          <div class="mt-2 flex justify-end">
            <span class="text-xs font-medium text-blue-600 flex items-center">
              Visita <span class="material-icons ml-1 text-xs">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 bg-gray-50 border-t border-gray-100">
        <p class="text-gray-600 text-sm">{{ service.description }}</p>
      </div>
    </a>
  </div>
 
  <!-- Secondary Services (Grid) -->
  <div v-else class="flex flex-wrap gap-3">
    <a
      v-for="service in services"
      :key="service._id"
      :href="service.url"
      rel="noopener noreferrer"
      @click="handleServiceClick(service, $event)"
      class="flex-grow-0 flex-shrink-0 basis-auto w-full md:w-auto p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition"
    >
      <div class="flex items-center">
        <div :class="`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 `" :style="{ backgroundColor: service.color }">
            <span class="material-icons text-lg">{{ service.icon }}</span>
        </div>
        <div class="ml-3">
          <h3 class="font-bold">{{ service.title }}</h3>
          <p class="text-gray-600 text-sm mt-1">{{ service.description }}</p>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
/* Scrollbar custom */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 6px;
}
</style>