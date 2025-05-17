<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { fetchCompanies, companyDelete, companyUpdate } from '@/api/companyApi';

const allCompanies = ref([]);
const filteredCompanies = ref([]);
const loading = ref(false);
const error = ref(null);

const searchQuery = ref('');

//RECUPERA TUTTE AZIENDE DAL SERVER
const fetchAndSetCompanies = async () => {
  loading.value = true;
  try {
    const data = await fetchCompanies();
    allCompanies.value = data;
    
    filteredCompanies.value = [...data];
    applySearchFilter();
  } catch (err) {
    error.value = err.message || 'Errore durante il recupero delle aziende';
  } finally {
    loading.value = false;
  }
};

//FUNZIONE DI MODIFICA DELLO STATO
const handleUpdateCompanyStatus = async (companyId, isActive) => {
  loading.value = true;
  try {
    const response = await companyUpdate(companyId, { isActive });
    console.log('Risposta aggiornamento:', response);
    await fetchAndSetCompanies();
  } catch (err) {
    console.error('Errore completo:', err);
    error.value = `Errore durante l'aggiornamento dell'azienda: ${err.message || 'Errore sconosciuto'}`;
  } finally {
    loading.value = false;
  }
};

// FUNZIONE DI ELIMINAZIONE AZIENDA
const deleteCompany = async (companyId) => {
  if (!confirm('Sei sicuro di voler eliminare questa azienda?')) {
    return;
  }
  
  loading.value = true;
  try {
    await companyDelete(companyId);
    await fetchAndSetCompanies(); // Aggiorna la lista dopo l'eliminazione
  } catch (err) {
    console.error('Errore durante l\'eliminazione:', err);
    error.value = `Errore durante l'eliminazione dell'azienda: ${err.message || 'Errore sconosciuto'}`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAndSetCompanies();
});

// Applica filtri di ricerca
const applySearchFilter = () => {
  if (!allCompanies.value || allCompanies.value.length === 0) return;
  
  filteredCompanies.value = allCompanies.value.filter(company => {
    //Filtro ricerca
    return searchQuery.value === '' || 
      (company.name && company.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (company.description && company.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
  });
};

// Eventi dei componenti
const handleSearchInput = (query) => {
  searchQuery.value = query;
  applySearchFilter();
};

const handleResetFilters = () => {
  searchQuery.value = '';
  applySearchFilter();
};

const disabledCompanies = computed(() => {
  return allCompanies.value.filter(company => !company.isActive);
});

//ATTIVA AZIENDA
const enableCompany = async (companyId) => {
  await handleUpdateCompanyStatus(companyId, true);
};
//DISATTIVA AZIENDA
const disableCompany = async (companyId) => {
  await handleUpdateCompanyStatus(companyId, false);
};

// Watch per aggiornare filtri quando cambiano le aziende
watch(allCompanies, () => {
  applySearchFilter();
}, { deep: true });
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Gestione Aziende</h1>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Errore!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-if="!loading || allCompanies.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sezione aziende disattivate -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Aziende Disattivate</h2>
        
        <div v-if="disabledCompanies.length === 0" class="py-4 text-gray-500 text-center">
          Nessuna azienda disattivata.
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div v-for="company in disabledCompanies" :key="company._id" class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-800">{{ company.name }}</p>
              <p v-if="company.email" class="text-sm text-gray-500">{{ company.email }}</p>
            </div>
            <div class="flex space-x-2">
            <button 
              @click="enableCompany(company._id)" 
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              :disabled="loading">
              Riattiva
            </button>
              <button 
                @click="deleteCompany(company._id)"
                class="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md text-sm transition-colors"
                :disabled="loading"
                title="Elimina azienda">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sezione ricerca aziende -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Cerca Aziende</h2>
        
        <!-- Riutilizzo del componente SearchFilter, ma con meno opzioni -->
        <div class="mb-6">
          <div class="relative">
            <input
              :value="searchQuery"
              @input="handleSearchInput($event.target.value)"
              type="text"
              placeholder="Cerca aziende..."
              class="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <div class="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Reset button -->
          <button 
            @click="handleResetFilters"
            class="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-md text-sm"
          >
            Reset
          </button>
        </div>
        
        <!-- Lista delle aziende cercate -->
        <div v-if="filteredCompanies.length === 0" class="py-4 text-gray-500 text-center">
          Nessuna azienda trovata.
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div v-for="company in filteredCompanies" :key="company._id" class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-800">{{ company.name }}</p>
              <p v-if="company.email" class="text-sm text-gray-500">{{ company.email }}</p>
            </div>
            <button 
              v-if="company.isActive"
              @click="disableCompany(company._id)" 
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              :disabled="loading">
              Disattiva
            </button>
            <button 
              v-else
              @click="enableCompany(company._id)" 
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              :disabled="loading">
              Riattiva
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>