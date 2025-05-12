<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from "@/services/api";
import CompanyCard from '@/components/companySearch/CompanyCard.vue';
import SearchFilter from '@/components/companySearch/SearchFilter.vue';
import Pagination from '@/components/companySearch/Pagination.vue';

const companies = ref([]);
const allFilteredCompanies = ref([]);
const loading = ref(false);
const error = ref(null);

// Variabili reattive per la ricerca e i filtri
const searchQuery = ref('');
const filters = ref({
  industry: '',
  location: '',
});

// Opzioni per i filtri
const industryOptions = ['Technology', 'IT Services', 'Energy', 'Healthcare', 'Finance', 'Manufacturing', 'Education'];
const locationOptions = ['Milano, IT', 'Roma, IT', 'Bologna, IT', 'Napoli, IT', 'Torino, IT', 'Firenze, IT'];

// Paginazione
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 15, 20];

// Funzione per recuperare le aziende dal server
const fetchCompanies = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("/company");
    companies.value = data;
    allFilteredCompanies.value = [...data];
    applyFilters(); // Applica eventuali filtri iniziali
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
};

// Chiamata all'API quando il componente viene montato
onMounted(() => {
  fetchCompanies();
});

// Applica filtri alla lista completa
const applyFilters = () => {
  if (!companies.value || companies.value.length === 0) return;
  
  allFilteredCompanies.value = companies.value.filter(company => {
    // Filtro ricerca
    const matchesSearch = searchQuery.value === '' || 
      (company.name && company.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (company.description && company.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    // Filtro settore
    const matchesIndustry = filters.value.industry === '' || 
      company.industry === filters.value.industry;
    
    // Filtro locazione
    const matchesLocation = filters.value.location === '' || 
      (company.location === filters.value.location) || 
      (company.address && company.address.includes(filters.value.location));
    
    return matchesSearch && matchesIndustry && matchesLocation;
  });
  
  // Reset alla prima pagina quando cambia il filtro
  currentPage.value = 1;
};

// Eventi dei componenti
const handleFilterChange = (newFilters) => {
  filters.value = newFilters;
  applyFilters();
};

const handleSearchInput = (query) => {
  searchQuery.value = query;
  applyFilters();
};

const handleResetFilters = () => {
  filters.value.industry = '';
  filters.value.location = '';
  searchQuery.value = '';
  applyFilters();
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleItemsPerPageChange = (items) => {
  itemsPerPage.value = items;
  currentPage.value = 1; // Torna alla prima pagina
};

// Calcolo delle aziende da mostrare nella pagina corrente
const paginatedCompanies = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return allFilteredCompanies.value.slice(startIndex, endIndex);
});

// Calcolo del numero totale di pagine
const totalPages = computed(() => {
  return Math.ceil(allFilteredCompanies.value.length / itemsPerPage.value);
});

// Watch per aggiornare i filtri quando cambia companies
watch(companies, () => {
  applyFilters();
}, { deep: true });
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading indicator -->
    <template>
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </template>
    
    <!-- Error message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Errore!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-if="!loading">
      <!-- Sezione ricerca e filtri -->
      <SearchFilter 
        :search-query="searchQuery"
        :filters="filters"
        :industry-options="industryOptions"
        :location-options="locationOptions"
        @update-search="handleSearchInput"
        @update-filters="handleFilterChange"
        @reset="handleResetFilters"
      />

      <!-- Debug info - può essere rimosso in produzione -->
      <div class="mb-4 text-sm text-gray-600">
        Aziende caricate: {{ companies.length }}
      </div>

      <!-- Controllo elementi per pagina -->
      <div v-if="allFilteredCompanies.length > 0" class="flex justify-between items-center mb-4">
        <div class="text-sm text-gray-600">
          Visualizzazione {{ Math.min((currentPage - 1) * itemsPerPage + 1, allFilteredCompanies.length) }} - 
          {{ Math.min(currentPage * itemsPerPage, allFilteredCompanies.length) }} 
          di {{ allFilteredCompanies.length }} aziende
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Aziende per pagina:</span>
          <select 
            :value="itemsPerPage"
            @change="handleItemsPerPageChange($event.target.value)" 
            class="p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <!-- Grid delle compagnie -->
      <div v-if="allFilteredCompanies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CompanyCard 
          v-for="company in paginatedCompanies" 
          :key="company._id"
          :company="company"
        />
      </div>

      <!-- Se non ci sono compagnie per il filtro selezionato -->
      <div v-if="allFilteredCompanies.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Nessuna azienda trovata</h3>
        <p class="text-gray-500">Prova a modificare i filtri di ricerca.</p>
      </div>

      <!-- Paginazione -->
      <Pagination 
        v-if="allFilteredCompanies.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>