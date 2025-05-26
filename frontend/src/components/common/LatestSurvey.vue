<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchAllPolls } from '@/api/pollsApi';

//PROPS PER RENDERLO RIUTILIZZABILE
const props = defineProps({
  // Type of polls to show: 'recent-ended', 'active', 'completed', 'all'
  type: {
    type: String,
    default: 'recent-ended'
  },
  // Maximum number of polls to show
  limit: {
    type: Number,
    default: 3
  },
  // Custom title for the section
  title: {
    type: String,
    default: null
  },
  // Show voting interface for active polls
  showVoting: {
    type: Boolean,
    default: false
  },
  // Detailed view (shows more info)
  detailed: {
    type: Boolean,
    default: false
  }
});

const allPolls = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateString, detailed = false) => {
  if (!dateString) return 'Data non disponibile';
  const options = detailed ? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } : {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('it-IT', options);
};

const getTotalVotes = (options) => {
  if (!options || options.length === 0) return 0;
  return options.reduce((total, option) => total + option.votes, 0);
};

const isActivePoll = (poll) => {
  if (poll.status === 'chiuso') return false;
  if (poll.endDate && new Date(poll.endDate) < new Date()) return false;
  return true;
};

const displayedPolls = computed(() => {
  let filtered = [];
  
  switch (props.type) {
    case 'active':
      filtered = allPolls.value.filter(poll => isActivePoll(poll));
      break;
    case 'completed':
      filtered = allPolls.value.filter(poll => !isActivePoll(poll));
      break;
    case 'recent-ended':
      filtered = allPolls.value.filter(poll => !isActivePoll(poll));
      break;
    case 'all':
      filtered = allPolls.value;
      break;
    default:
      filtered = allPolls.value.filter(poll => !isActivePoll(poll));
  }
  
  // Sort by date (most recent first)
  const sorted = filtered.sort((a, b) => {
    const dateA = new Date(a.endDate || a.updatedAt || a.createdAt);
    const dateB = new Date(b.endDate || b.updatedAt || b.createdAt);
    return dateB - dateA;
  });
  
  // Apply limit
  return props.limit > 0 ? sorted.slice(0, props.limit) : sorted;
});

const sectionTitle = computed(() => {
  if (props.title) return props.title;
  
  switch (props.type) {
    case 'active':
      return 'Sondaggi Attivi';
    case 'expired':
      return 'Sondaggi Conclusi';
    case 'recent-ended':
      return 'Ultimi Sondaggi Conclusi';
    case 'all':
      return 'Tutti i Sondaggi';
    default:
      return 'Sondaggi';
  }
});

const loadPolls = async () => {
  try {
    loading.value = true;
    allPolls.value = await fetchAllPolls();
  } catch (err) {
    error.value = 'Errore nel caricamento dei sondaggi';
    console.error('Error loading polls:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPolls();
});
</script>

<template>
  <section>
    <h3 :class="[detailed ? 'text-2xl font-bold' : 'text-lg font-medium', 'mb-4']">
      {{ sectionTitle }}
    </h3>
    
    <div v-if="loading" class="bg-white shadow rounded-lg p-4">
      <p class="text-gray-500">Caricamento sondaggi...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
    </div>
    
    <div v-else-if="displayedPolls.length === 0" class="bg-white shadow rounded-lg p-4">
      <p class="text-gray-500">
        {{ type === 'active' ? 'Nessun sondaggio attivo al momento' : 'Nessun sondaggio disponibile' }}
      </p>
    </div>
    
    <div v-else :class="[detailed ? 'space-y-6' : 'bg-white shadow rounded-lg divide-y']">
      <div v-for="poll in displayedPolls" :key="poll._id" 
           :class="[detailed ? 'bg-white shadow rounded-lg p-6' : 'p-4']">
        
        <!-- Poll Header -->
        <div class="mb-4">
          <div class="flex justify-between items-start mb-2">
            <h4 :class="[detailed ? 'text-xl font-semibold' : 'font-medium', 'text-gray-900']">
              {{ poll.title }}
            </h4>
            <div class="flex items-center space-x-2">
              <span v-if="detailed" 
                    :class="[
                      'text-xs font-medium px-2.5 py-0.5 rounded',
                      isActivePoll(poll) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    ]">
                {{ isActivePoll(poll) ? 'Attivo' : 'Concluso' }}
              </span>
              <span v-if="!detailed" class="text-sm text-gray-500">
                {{ formatDate(poll.endDate || poll.createdAt) }}
              </span>
            </div>
          </div>
          
          <p v-if="poll.description" 
             :class="[detailed ? 'text-gray-600 mb-3' : 'text-gray-600 text-sm mb-3']">
            {{ poll.description }}
          </p>
          
          <div v-if="detailed" class="text-sm text-gray-500 space-y-1">
            <p v-if="poll.startDate">Iniziato: {{ formatDate(poll.startDate, true) }}</p>
            <p v-if="poll.endDate">
              {{ isActivePoll(poll) ? 'Termina' : 'Terminato' }}: {{ formatDate(poll.endDate, true) }}
            </p>
          </div>
        </div>

        <!-- Active Poll Voting Interface -->
        <div v-if="isActivePoll(poll) && showVoting" class="space-y-3">
          <div v-for="option in poll.options" :key="option._id" 
               class="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer">
            <div class="flex items-center">
              <input type="radio" :name="`poll-${poll._id}`" class="h-4 w-4 text-blue-600 mr-3" disabled>
              <span>{{ option.text }}</span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400" disabled>
              Vota (Funzionalità in arrivo)
            </button>
          </div>
        </div>
        
        <!-- Results Display -->
        <div v-else-if="!isActivePoll(poll) || !showVoting" class="space-y-2">
          <h5 v-if="detailed" class="font-medium text-gray-900 mb-3">Risultati:</h5>
          
          <div v-for="option in poll.options" :key="option._id" 
               :class="[detailed ? 'space-y-2' : 'flex justify-between items-center']">
            
            <div v-if="detailed" class="flex justify-between items-center">
              <span class="text-sm font-medium">{{ option.text }}</span>
              <span class="text-sm text-gray-600">
                {{ option.votes }} voti 
                <span v-if="getTotalVotes(poll.options) > 0" class="text-gray-500">
                  ({{ Math.round((option.votes / getTotalVotes(poll.options)) * 100) }}%)
                </span>
              </span>
            </div>
            
            <template v-else>
              <span class="text-sm">{{ option.text }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium">{{ option.votes }} voti</span>
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: getTotalVotes(poll.options) > 0 ? (option.votes / getTotalVotes(poll.options) * 100) + '%' : '0%' }"
                  ></div>
                </div>
              </div>
            </template>
            
            <div v-if="detailed" class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                :style="{ width: getTotalVotes(poll.options) > 0 ? (option.votes / getTotalVotes(poll.options) * 100) + '%' : '0%' }"
              ></div>
            </div>
          </div>
          
          <div :class="[detailed ? 'pt-2 border-t border-gray-100' : 'mt-2']">
            <p :class="[detailed ? 'text-sm text-gray-600 font-medium' : 'text-xs text-gray-500']">
              Totale {{ detailed ? 'partecipanti' : 'voti' }}: {{ getTotalVotes(poll.options) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>