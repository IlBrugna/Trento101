<script setup>
import { ref, onMounted } from 'vue';
import { fetchAllNews } from '@/api/newsAPI';

const news     = ref([]);
const loading  = ref(true);
const errorMsg = ref(null);

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

onMounted(async () => {
  try {
    news.value = await fetchAllNews();     
  } catch (err) {
    errorMsg.value =
      err?.message || 'Errore nel caricamento delle news';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <!-- Stato di caricamento/errore -->
  <p v-if="loading" class="text-sm text-gray-500">Caricamento…</p>
  <p v-else-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>

  <div
    v-else
    class="flex flex-nowrap gap-4 overflow-x-auto pb-2 snap-x"
  >
    <a
      v-for="item in news"
      :key="item._id"
      :href="item.url"
      class="flex-shrink-0 w-80 snap-start bg-white rounded-lg shadow hover:shadow-md transition p-4"
    >
      <div class="flex justify-between items-start">
        <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
        <span class="text-xs text-gray-500">
          {{ formatDate(item.date) }}
        </span>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        {{ item.summary }}
      </p>
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
