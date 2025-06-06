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
  <main class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Monitoraggio Sondaggi Attivi</h1>
    <p class="mb-6 text-gray-600">Visualizza e disattiva i sondaggi attivi.</p>
    <div v-if="loading" class="text-center py-10">Caricamento...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div v-if="polls.length === 0" class="text-gray-500">Nessun sondaggio attivo.</div>
      <div v-else class="space-y-8">
        <div v-for="poll in polls" :key="poll._id" class="border rounded-lg p-4 shadow-sm">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">{{ poll.title }}</h2>
            <button @click="deactivatePoll(poll._id)" class="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Disattiva</button>
          </div>
          <div class="mb-2 text-gray-700">{{ poll.description }}</div>
          <div class="mb-2 text-sm text-gray-500">
            Dal {{ poll.startDate ? new Date(poll.startDate).toLocaleDateString() : '-' }}
            al {{ poll.endDate ? new Date(poll.endDate).toLocaleDateString() : '-' }}
          </div>
          <div class="mb-2 font-medium">Voti totali: {{ totalVotes(poll.options) }}</div>
          <ul class="divide-y divide-gray-200">
            <li v-for="opt in poll.options" :key="opt._id || opt.text" class="py-1 flex justify-between">
              <span>{{ opt.text }}</span>
              <span class="font-mono">{{ opt.votes }} voti</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>