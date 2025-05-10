<script setup>
import { defineProps, defineEmits, toRefs, reactive } from 'vue';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  filters: {
    type: Object,
    default: () => ({
      industry: '',
      location: ''
    })
  },
  industryOptions: {
    type: Array,
    default: () => []
  },
  locationOptions: {
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
      
      <!-- Filtri per tipo di industria -->
      <div class="w-full md:w-1/4">
        <select 
          :value="filters.industry"
          @change="handleFilterChange('industry', $event.target.value)"
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tutti i settori</option>
          <option v-for="option in industryOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      
      <!-- Filtri per locazione -->
      <div class="w-full md:w-1/4">
        <select 
          :value="filters.location"
          @change="handleFilterChange('location', $event.target.value)"
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tutte le località</option>
          <option v-for="option in locationOptions" :key="option" :value="option">
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