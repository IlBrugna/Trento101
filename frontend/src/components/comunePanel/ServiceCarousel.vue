<script setup>
import { ref, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { fetchAllComuni } from '@/api/comuneServicesAPI';
import { fetchAllUniversitaServices } from '@/api/universitaServicesAPI'; // Corretto qui
import { useStats } from '@/api/statisticsAPI';

const props = defineProps({
  secondary: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'comune' // 'comune' o 'universita'
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
  try {
    await stats.trackServiceClick({
      serviceId: service._id,
      serviceName: service.title,
      serviceUrl: service.url,
      isPrimary: !props.secondary
    });
  } catch (error) {
    console.error('Failed to track service click:', error);
  }
};

// Handle service click
const handleServiceClick = async (service, e) => {
  e.preventDefault();                // blocca la navigazione
  await trackServiceClick(service);  // aspetta la POST
  window.open(service.url, '_blank'); // poi apri la pagina
};

// Fetch dei servizi
const loadServices = async () => {
  try {
    loading.value = true;
    let data = [];
    if (props.type === 'universita') {
      data = await fetchAllUniversitaServices();
    } else {
      data = await fetchAllComuni();
    }
    services.value = data.filter(service => service.isPrimary !== props.secondary);
  } catch (err) {
    console.error('Failed to fetch services:', err);
    error.value = 'Failed to load services. Please try again later.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadServices);
watch(() => [props.type, props.secondary], loadServices);
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
  <div
    v-else-if="!secondary"
    class="flex flex-nowrap gap-6 overflow-x-auto pb-4 snap-x"
    style="scroll-padding-left: 1rem;"
  >
    <a
      v-for="service in services"
      :key="service._id"
      :href="service.url"
      rel="noopener noreferrer"
      @click="handleServiceClick(service, $event)"
      class="flex-shrink-0 w-80 min-w-[20rem] max-w-[20rem] snap-start rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white border border-gray-100 hover:border-emerald-400 transform hover:-translate-y-1 duration-200 flex flex-col"
    >
      <div class="h-32 flex items-center justify-center" :style="{ backgroundColor: service.color }">
        <span class="material-icons text-5xl">{{ service.icon }}</span>
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between">
        <h3 class="font-bold text-xl mb-2 text-gray-900">{{ service.title }}</h3>
        <p class="text-gray-600 text-base mb-4 flex-1">{{ service.description }}</p>
        <div class="flex justify-end">
          <span class="text-xs font-medium text-emerald-700 flex items-center gap-1">
            Visita <span class="material-icons text-xs">arrow_forward</span>
          </span>
        </div>
      </div>
    </a>
  </div>
 
  <!-- Secondary Services (Grid) -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <a
      v-for="service in services"
      :key="service._id"
      :href="service.url"
      rel="noopener noreferrer"
      @click="handleServiceClick(service, $event)"
      class="rounded-xl bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-md transition flex flex-col items-center p-5 h-full min-h-[12rem]"
      style="min-width: 0;"
    >
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-3"
        :style="{ backgroundColor: service.color }"
      >
        <span class="material-icons text-2xl">{{ service.icon }}</span>
      </div>
      <h3 class="font-bold text-base text-gray-900 mb-1 text-center w-full">{{ service.title }}</h3>
      <p class="text-gray-600 text-sm text-center w-full flex-1">{{ service.description }}</p>
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