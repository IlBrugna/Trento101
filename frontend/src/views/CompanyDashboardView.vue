<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { fetchSpecificCompany, companyUpdate } from '@/api/companyApi';
import { useStats } from '@/api/statisticsAPI.js';
import CompanyEditForm from '@/components/company/CompanyEditForm.vue';
import { useRouter } from 'vue-router';
import { checkAuthOnAppLoad } from '@/api/authApi';

const auth = useAuthStore();
const router = useRouter();
const company = ref(null);
const error = ref(null);
const companyPageViews = ref(0);
const loadingStats = ref(false);
const statsError = ref(null);
const isClient = ref(false);

const companyPageUrl = computed(() => {
  if (!auth.user?._id) return null;
  return `azienda/${auth.user._id}`;
});

const fullCompanyPageUrl = computed(() => {
  if (!isClient.value || !companyPageUrl.value) return null;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/${companyPageUrl.value}`;
  }
  return companyPageUrl.value;
});

// Funzione per ottenere le statistiche della pagina aziendale
const fetchCompanyPageStats = async () => {
  if (!auth.user?._id) return;
  
  loadingStats.value = true;
  statsError.value = null;
  
  try {
    const api = useStats();
    const topPagesData = await api.getTopPages(10000); // Prendi fino a 10.000 pagine per essere sicuri di includere la pagina aziendale
    
    // Trova la pagina aziendale specifica
    const companyPage = topPagesData.find(page => {
      const pageUrl = page._id || '';
      // Controlla se l'URL della pagina contiene l'ID dell'azienda dell'utente autenticato
      return (pageUrl.includes(`companies/${auth.user._id}`) || 
        pageUrl.includes(`azienda/${auth.user._id}`)) && 
        !pageUrl.includes('companyDashboard');
    });
    
    companyPageViews.value = companyPage ? companyPage.views : 0;
  } catch (err) {
    console.error('Error fetching company page stats:', err);
    statsError.value = 'Impossibile caricare le statistiche delle visite';
    companyPageViews.value = 0;
  } finally {
    loadingStats.value = false;
  }
};

// Funzione per ottenere i dati dell'azienda specifica
const fetchCompanyData = async () => {
  if (!auth.user?._id) return;
  
  try {
    const data = await fetchSpecificCompany(auth.user._id);
    company.value = data;
    error.value = null;
  } catch (err) {
    console.error('Error fetching company data:', err);
    error.value = 'Errore nel caricamento dei dati aziendali';
  }
};

const loadStats = () => {
  fetchCompanyPageStats();
};

onMounted(async () => {
  // Per il caricamento iniziale, impostiamo isClient a true
  isClient.value = true;
  
  await checkAuthOnAppLoad();
  
  // Controlla se l'utente è autenticato
  if (!auth.user?._id) {
    router.push('/login');
    return;
  }
  
  fetchCompanyData();
  fetchCompanyPageStats();
});

const handleUpdate = async (updatedData) => {
  if (!auth.user?._id) {
    alert('Errore: utente non autenticato');
    return;
  }

  try {
    const response = await companyUpdate(auth.user._id, updatedData);
    company.value = response.data;
    alert('Dati aggiornati con successo!');
  } catch (err) {
    console.error('Error updating company:', err);
    const errorMessage = err.message || 'Errore durante l\'aggiornamento';
    alert(errorMessage);
  }
};

const retryStats = () => {
  fetchCompanyPageStats();
};

// Funzione per scrollare alla sezione del form di modifica
const scrollToEditForm = () => {
  const editForm = document.getElementById('company-edit-form');
  if (editForm) {
    editForm.scrollIntoView({ behavior: 'smooth' });
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('it-IT');
  } catch {
    return '-';
  }
};

const copyUrlToClipboard = async () => {
  if (!fullCompanyPageUrl.value) return;
  
  try {
    await navigator.clipboard.writeText(fullCompanyPageUrl.value);
    alert('URL copiato negli appunti!');
  } catch (err) {
    console.error('Failed to copy URL:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = fullCompanyPageUrl.value;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('URL copiato negli appunti!');
    } catch (fallbackErr) {
      alert('Impossibile copiare l\'URL automaticamente');
    }
    document.body.removeChild(textArea);
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Aziendale</h1>
      <p class="text-gray-600">Gestisci i dati della tua azienda e visualizza le statistiche</p>
    </div>

    <!-- Errore di autenticazione -->
    <div v-if="!auth.user?._id" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
      <div class="flex">
        <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <p class="text-yellow-800 text-sm">Utente non autenticato. Reindirizzamento al login...</p>
      </div>
    </div>

    <!-- Statistiche -->
    <div v-if="auth.user?._id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Statistiche della Pagina Aziendale</h2>
      
      <div v-if="loadingStats" class="flex items-center justify-center py-8">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">Caricamento statistiche...</span>
      </div>
      
      <!-- Errore statistiche -->
      <div v-else-if="statsError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-red-800 text-sm font-medium">{{ statsError }}</p>
            <button 
              @click="retryStats"
              class="mt-2 text-red-600 hover:text-red-800 text-sm underline focus:outline-none"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-700">Visite Totali</p>
              <p class="text-3xl font-bold text-blue-900">{{ companyPageViews.toLocaleString() }}</p>
              <p class="text-xs text-blue-600 mt-1">alla tua pagina aziendale</p>
              <button 
                @click="loadStats"
                class="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 focus:outline-none"
              >
                Aggiorna Statistiche
              </button>
            </div>
          </div>
        </div>

        <!-- Azienda -->
        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-700">Profilo Aziendale</p>
              <p class="text-lg font-semibold text-green-900">{{ company?.name || 'Nome Azienda' }}</p>
              <p class="text-xs text-green-600 mt-1">attivo dal {{ formatDate(company?.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Azione rapida -->
        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-purple-700">Azioni Rapide</p>
              <button 
                @click="scrollToEditForm"
                class="text-sm font-medium text-purple-900 hover:text-purple-700 underline focus:outline-none"
              >
                Modifica Profilo
              </button>
              <p class="text-xs text-purple-600 mt-1">aggiorna i tuoi dati</p>
            </div>
          </div>
        </div>
      </div>

      <!-- URL dell'azienda -->
      <div v-if="fullCompanyPageUrl" class="mt-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm text-gray-600 mb-2">
              <strong>URL della tua pagina aziendale:</strong>
            </p>
            <code class="block px-3 py-2 bg-gray-200 rounded text-xs font-mono break-all">{{ fullCompanyPageUrl }}</code>
          </div>
          <button 
            @click="copyUrlToClipboard"
            class="ml-4 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Copia
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
      <div class="flex">
        <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p class="text-red-800 text-sm font-medium">{{ error }}</p>
          <button 
            @click="fetchCompanyData"
            class="mt-2 text-red-600 hover:text-red-800 text-sm underline focus:outline-none"
          >
            Riprova a caricare
          </button>
        </div>
      </div>
    </div>

    <!-- Edit dell'azienda -->
    <div v-if="company && auth.user?._id" id="company-edit-form" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Modifica i Dati Aziendali</h2>
      <CompanyEditForm :company="company" @submit="handleUpdate" />
    </div>

    <!-- Caricamento -->
    <div v-else-if="!error && auth.user?._id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Caricamento dati aziendali...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
}
</style>