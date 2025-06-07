<script setup>
import { defineProps, defineEmits, toRefs } from 'vue';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  filters: {
    type: Object,
    default: () => ({
      sector: ''
    })
  },
  sectorOptions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update-search', 'update-filters', 'reset']);

// Utilizziamo toRefs per mantenere la reattività
const { searchQuery, filters } = toRefs(props);

// Handlers
const handleSearchInput = (event) => {
  emit('update-search', event.target.value);
};

const handleFilterChange = (type, value) => {
  const newFilters = { ...filters.value, [type]: value };
  emit('update-filters', newFilters);
};

const resetFilters = () => {
  emit('reset');
};
</script>

<template>
  <div class="bg-white shadow rounded-lg p-4 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Barra di ricerca -->
      <div class="flex-grow relative">
        <input
          :value="searchQuery"
          @input="handleSearchInput"
          type="text"
          placeholder="Cerca aziende..."
          class="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="absolute left-3 top-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <!-- Filtri per tipo di settore -->
      <div class="w-full md:w-1/4">
        <select 
          :value="filters.sector"
          @change="handleFilterChange('sector', $event.target.value)"
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tutti i settori</option>
          <option v-for="option in sectorOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      
      <!-- Reset filters button -->
      <button 
        @click="resetFilters"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md"
      >
        Reset
      </button>
    </div>
  </div>
</template>