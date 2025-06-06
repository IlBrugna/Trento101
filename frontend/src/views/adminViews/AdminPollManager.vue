<script setup>
import { ref, onMounted } from 'vue';
import { fetchAllPolls } from '@/api/pollsApi';
import api from '@/services/api';

const polls = ref([]);
const loading = ref(true);
const error = ref(null);

async function loadPolls() {
  try {
    loading.value = true;
    const all = await fetchAllPolls();
    polls.value = all.filter(p => p.status === 'attivo');
  } catch (err) {
    error.value = err.message || 'Errore nel caricamento dei sondaggi';
  } finally {
    loading.value = false;
  }
}

onMounted(loadPolls);

function totalVotes(options) {
  return options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
}

async function deactivatePoll(pollId) {
  try {
    await api.put(`api/v1/polls/${pollId}`, { status: 'chiuso' });
    await loadPolls();
  } catch (err) {
    error.value = err.message || 'Errore nella disattivazione del sondaggio';
  }
}
</script>

<template>
  <main class="container mx-auto px-2 py-4">
    <h1 class="text-xl font-bold mb-2 text-gray-800">Monitoraggio Sondaggi Attivi</h1>
    <p class="mb-4 text-gray-500">Visualizza e disattiva i sondaggi attivi.</p>
    <div v-if="loading" class="text-center py-6 text-primary-600">Caricamento...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div v-if="polls.length === 0" class="text-gray-400">Nessun sondaggio attivo.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div
          v-for="poll in polls"
          :key="poll._id"
          class="border border-gray-200 rounded-lg p-2 shadow bg-gray-50 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-center mb-1">
            <h2 class="text-base font-semibold text-gray-700 truncate">{{ poll.title }}</h2>
            <button
              @click="deactivatePoll(poll._id)"
              class="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors border border-red-300 font-semibold"
            >
              Disattiva
            </button>
          </div>
          <div class="mb-1 text-gray-600 text-xs truncate">{{ poll.description }}</div>
          <div class="mb-1 text-xs text-gray-400">
            Dal {{ poll.startDate ? new Date(poll.startDate).toLocaleDateString() : '-' }}
            al {{ poll.endDate ? new Date(poll.endDate).toLocaleDateString() : '-' }}
          </div>
          <div class="mb-1 font-medium text-xs text-primary-700">Voti totali: {{ totalVotes(poll.options) }}</div>
          <ul class="divide-y divide-gray-100">
            <li v-for="opt in poll.options" :key="opt._id || opt.text" class="py-0.5 flex justify-between text-xs">
              <span class="truncate text-gray-700">{{ opt.text }}</span>
              <span class="font-mono text-gray-900">{{ opt.votes }} voti</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>