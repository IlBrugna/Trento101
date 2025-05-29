<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, LineElement, CategoryScale,
  LinearScale, PointElement, BarElement, ArcElement
} from 'chart.js';

import { useStats } from '@/api/statisticsAPI.js';
import { fetchSpecificCompany } from '@/api/companyAPI.js';

// ChartJS
ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, CategoryScale, LinearScale, PointElement,
  BarElement, ArcElement
);

const loading      = ref(false);
const error        = ref(null);
const hideStatsPages = ref(true);         // Nascondi pagine statistiche

const overview     = ref([]);             // overview data
const topPages     = ref([]);             // Top pagine
const breakdown    = ref([]);             // Eventi per tipo
const companyStats = ref({});             // Statistiche aziende
const serviceStats = ref([]);             // Statistiche servizi
const topPagesVisible = ref(5);           // Numero di pagine da mostrare (per il grafico)

const pieLabels   = computed(() => breakdown.value.map(b => b.type));
const pieCounts   = computed(() => breakdown.value.map(b => b.count));

// Funzione per identificare le pagine statistiche
const isStatsPage = (url) => {
  if (!url) return false;
  const cleanUrl = url.toLowerCase();
  return cleanUrl.includes('stats') || 
         cleanUrl.includes('statistic') || 
         cleanUrl.includes('dashboard') ||
         cleanUrl.includes('admin');
};

// Filtra le pagine
const filteredTopPages = computed(() => {
  if (!hideStatsPages.value) {
    return topPages.value;
  }
  return topPages.value.filter(page => !isStatsPage(page._id));
});

const barChartOptions = computed(() => ({
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Pagine Più Visitate'
    },
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Numero Visite'
      }
    }
  }
}));

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Distribuzione Eventi per Tipo'
    },
    legend: {
      position: 'bottom',
    }
  }
}));

const companyNameCache = ref({});

async function getCompanyName(id) {
  if (companyNameCache.value[id]) return companyNameCache.value[id];

  try {
    const company = await fetchSpecificCompany(id);   // 👉 your API call
    const name    = company?.name || id;
    companyNameCache.value[id] = name;
    console.log(`Company name for ${id}: ${name}`); // Debug log
    return name;
  } catch (_) {
    // fall-back ⇒ leave the raw id in the cache so we don’t retry forever
    companyNameCache.value[id] = id;
    return id;
  }
}

const formatUrl = (url) => {
  if (!url) return 'N/A';
  
  const cleanUrl = url
    .replace(/^\/api\/v1\//, '') // Rimuove API version prefix
    .replace(/\?.*$/, '') // Rimuove query params
    .replace(/\/\d+$/, '/:id') // Rimuove ID numerici finali
    .replace(/limit=\d+/, '') // Rimuove limit params
    .replace(/range=\w+/, ''); // Rimuove range params


    if (cleanUrl.startsWith('companies/')) {
    const id   = cleanUrl.split('/')[1];
    const name = companyNameCache.value[id] || id;        // reactive
    return `🏢 ${name}`;
  }
  
  // Mappatura URL a etichette più leggibili
  const urlMappings = {
    'polls': '📊 Sondaggi',
    'auth': '🔐 Autenticazione', 
    'companies': '🏢 Aziende',
    'stats/top-pages': '📈 Statistiche - Top Pagine',
    'comuneNews': '📰 News Comune',
    'serviziComune': '🏛️ Servizi Comunali',
    'stats/overview': '📊 Statistiche - Panoramica',
    'stats/event-breakdown': '📈 Statistiche - Eventi',
    'richiesteSupporto': '🎧 Richieste Supporto',
    '': '🏠 Home Page'
  };
  
  return urlMappings[cleanUrl] || cleanUrl || 'Pagina Sconosciuta';
};

const displayedTopPages = computed(() =>
  filteredTopPages.value.slice(0, topPagesVisible.value)
);

const barChartData = computed(() => ({
  labels: displayedTopPages.value.map(p => formatUrl(p._id)),
  datasets: [{
    label: 'Visite pagina',
    data: displayedTopPages.value.map(p => p.views),
    backgroundColor: 'rgba(147, 51, 234, 0.8)',
    borderColor: 'rgb(147, 51, 234)',
    borderWidth: 1
  }]
}));

const doughnutData = computed(() => ({
  labels: pieLabels.value.map(label => {
    const labelMappings = {
      'page_view': '👁️ Visualizzazioni Pagina',
      'login': '🔑 Login',
      'logout': '🚪 Logout', 
      'support_request_created': '🎧 Richieste Supporto',
      'company_created': '🏢 Aziende Registrate',
      'survey_vote': '📊 Voti Sondaggio',
      'service_click': '🔗 Click Servizi'
    };
    return labelMappings[label] || label;
  }),
  datasets: [{
    data: pieCounts.value,
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(34, 197, 94, 0.8)'
    ],
    borderColor: [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(239, 68, 68)',
      'rgb(245, 158, 11)',
      'rgb(139, 92, 246)',
      'rgb(236, 72, 153)',
      'rgb(34, 197, 94)'
    ],
    borderWidth: 2
  }]
}));


const totalStats = computed(() => {
  const totals = {
    visits: overview.value.visits || 0,
    logins: overview.value.logins || 0,
    requests: overview.value.supportRequests || 0
  };

  // Fixed for counter-based data
  const companyTotal = companyStats.value?.totalCompanies || 0;
  const newCompaniesInPeriod = companyStats.value?.totalCompanies || 0; // Same as total since we only track created
  const totalServiceClicks = serviceStats.value?.topServices?.reduce((sum, service) => sum + service.clicks, 0) || 0;

  return {
    ...totals,
    totalCompanies: companyTotal,
    newCompaniesInPeriod,
    totalServiceClicks
  };
});

const formattedVisits = computed(() => {
  const visits = totalStats.value.visits;
  if (typeof visits === 'object' && visits !== null) {
    return 0; // MongoDB object - return 0 for now
  }
  return Number(visits) || 0;
});

const formattedLogins = computed(() => {
  const logins = totalStats.value.logins;
  return Number(logins) || 0;
});

const formattedCompanies = computed(() => {
  const companies = totalStats.value.totalCompanies;
  return Number(companies) || 0;
});

const formattedRequests = computed(() => {
  const requests = totalStats.value.requests;
  return Number(requests) || 0;
});

const formattedServiceClicks = computed(() => {
  const clicks = totalStats.value.totalServiceClicks;
  return Number(clicks) || 0;
});

const serviceClicksChartData = computed(() => {
  if (!serviceStats.value?.topServices?.length) return null;
  
  return {
    labels: serviceStats.value.topServices.map(s => s.serviceName || s.serviceId || 'Servizio Sconosciuto'),
    datasets: [{
      label: 'Click sui Servizi',
      data: serviceStats.value.topServices.map(s => s.clicks),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1
    }]
  };
});

// Data Fetch
async function fetchStats() {
  loading.value = true; 
  error.value = null;
  
  try {
    const api = useStats();
    
    const [overviewData, topPagesData, breakdownData, companyData, serviceData] = await Promise.all([
      api.getOverview(),
      api.getTopPages(20), // Limita a 20 pagine
      api.getEventBreakdown(),
      api.getCompanyStats().catch(() => ({ events: [], totalCompanies: 0 })),
      api.getServiceStats().catch(() => ({ topServices: [], serviceEvents: [] }))
    ]);
    
    overview.value = overviewData || { visits: 0, logins: 0, supportRequests: 0 };
    topPages.value = topPagesData || [];
    breakdown.value = breakdownData || [];
    companyStats.value = companyData || { events: [], totalCompanies: 0 };
    serviceStats.value = serviceData || { topServices: [], serviceEvents: [] };

    const companyIds = Array.from(             // Set → Array to keep unique ids
    new Set(
        (topPages.value || [])
        .map(p => p._id || '')
        .map(id => id.split('?')[0])         // strip query-string
        .map(id => {
            // ogni “<24hex>” ➜ ritorna l’ID
            if (/^[a-f\d]{24}$/i.test(id)) return id;

            // ogni “…/companies/<24hex>/…” ➜ ritorna l’ID
            const m = id.match(/companies\/([a-f\d]{24})(?:\/|$)/i);
            return m ? m[1] : null;
        })
        .filter(Boolean)// Rimuove nulls
    )
    );

    console.log('Company IDs to fetch:', companyIds);  

    await Promise.all(companyIds.map(getCompanyName));
    
  } catch (e) {
    console.error('Error fetching statistics:', e);
    error.value = e.message || 'Impossibile caricare le statistiche';
  } finally {
    loading.value = false;
  }
}


function retryFetch() {
  fetchStats();
}

onMounted(fetchStats);
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Statistiche Dashboard</h1>
      <p class="text-gray-600">Panoramica delle attività e metriche del sistema</p>
    </div>

    <!-- Controlli -->
    <div class="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex gap-4 items-center flex-wrap">

        <!-- Checkbox per nascondere -->
        <div class="flex items-center">
          <input 
            id="hide-stats-checkbox"
            v-model="hideStatsPages"
            type="checkbox" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="hide-stats-checkbox" class="ml-2 text-sm font-medium text-gray-700">
            Nascondi pagine statistiche
          </label>
        </div>
      </div>
      
      <button 
        v-if="error && !loading"
        @click="retryFetch"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Riprova
      </button>
    </div>

    <!-- Caricamento -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Caricamento statistiche...</p>
    </div>

    <!-- Errore -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div class="text-red-600 mb-2">
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-semibold">Errore nel caricamento</h3>
        <p class="text-sm mt-1">{{ error }}</p>
      </div>
    </div>

    <!-- Contenuto Principale -->
    <template v-else-if="!loading && !error">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Visite Totali</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formattedVisits.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Login Totali</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formattedLogins.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Aziende Totali</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formattedCompanies.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">{{ formattedCompanies }} totali create</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Richieste di Supporto Create</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formattedRequests.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Click sui Servizi</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formattedServiceClicks.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">totali</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <label for="tp-count" class="text-sm text-gray-700">
            Numero di pagine da mostrare:
        </label>
        <input
            id="tp-count"
            v-model.number="topPagesVisible"
            type="number"
            min="1"
            :max="filteredTopPages.length"
            class="w-20 border-gray-300 rounded-md text-sm"
        />
        </div>

      <!-- Grafici -->
      <div class="space-y-8">
        <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <Bar
            :data="barChartData"
            :options="barChartOptions"
            class="h-96"
          />
        </div>

        <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div class="max-w-md mx-auto">
            <Doughnut
              :data="doughnutData"
              :options="doughnutOptions"
              class="h-80"
            />
          </div>
        </div>

        <div v-if="serviceClicksChartData" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <Bar
            :data="serviceClicksChartData"
            :options="{
              responsive: true,
              indexAxis: 'y',
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Servizi Più Cliccati'
                },
                legend: { display: false }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Numero Click'
                  }
                }
              }
            }"
            class="h-80"
          />
        </div>

        <div v-if="serviceStats.length > 0" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <Bar
            :data="{
              labels: serviceStats.map(s => s.serviceName || s._id),
              datasets: [{
                label: 'Click sui Servizi',
                data: serviceStats.map(s => s.clicks),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
              }]
            }"
            :options="{
              responsive: true,
              indexAxis: 'y',
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Servizi Più Cliccati'
                },
                legend: { display: false }
              }
            }"
            class="h-80"
          />
        </div>
      </div>

      <!-- Tabelle -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mt-8">
        <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Top Pagine
            <span v-if="hideStatsPages" class="text-xs text-gray-500 font-normal">(escluse pagine statistiche)</span>
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visite</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="page in displayedTopPages" :key="page._id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatUrl(page._id) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ page.views.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Eventi per Tipo</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conteggio</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="event in breakdown" :key="event.type">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {{ event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ event.count.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Servizi Più Cliccati</h3>
          <div v-if="serviceStats.topServices && serviceStats.topServices.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servizio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="service in serviceStats.topServices.slice(0, 5)" :key="service.serviceId || service._id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ service.serviceName || service.serviceId || service._id || 'Servizio Sconosciuto' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {{ service.clicks.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <p class="text-sm">Nessun click sui servizi nel periodo selezionato</p>
          </div>
        </div>
        
        <div v-if="companyStats.events && companyStats.events.length > 0" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Eventi Aziende</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Evento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conteggio</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="event in companyStats.events" :key="event.type">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ event.type === 'company_created' ? '🏢 Creazione' : 
                        event.type === 'company_updated' ? '✏️ Aggiornamento' : 
                        event.type === 'company_deleted' ? '🗑️ Eliminazione' : event.type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ event.count.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="serviceStats.serviceEvents && serviceStats.serviceEvents.length > 0" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Eventi Servizi</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Evento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conteggio</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="event in serviceStats.serviceEvents" :key="event.type">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ event.count.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
}
</style>