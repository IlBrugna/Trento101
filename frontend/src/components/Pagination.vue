<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-change']);

// Metodi per la navigazione
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};

// Array di numeri di pagina da mostrare
const pageNumbers = computed(() => {
  const pages = [];
  const maxPagesToShow = 5; // Massimo numero di pagine da mostrare nel paginatore
  
  if (props.totalPages <= maxPagesToShow) {
    // Se il totale delle pagine è minore o uguale al massimo da mostrare, mostra tutte le pagine
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Altrimenti mostra un sottinsieme di pagine con la pagina corrente al centro quando possibile
    let startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > props.totalPages) {
      endPage = props.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});
</script>

<template>
  <div class="flex justify-center mt-8">
    <nav class="flex justify-center">
      <ul class="flex items-center">
        <!-- Pulsante Previous -->
        <li class="mx-1">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
            ]"
          >
            &laquo;
          </button>
        </li>
        
        <!-- Pagina 1 (sempre visibile) -->
        <li v-if="!pageNumbers.includes(1)" class="mx-1">
          <button
            @click="goToPage(1)"
            class="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50"
          >
            1
          </button>
        </li>
        
        <!-- Ellipsis se necessario -->
        <li v-if="!pageNumbers.includes(1) && !pageNumbers.includes(2)" class="mx-1 text-gray-500">...</li>
        
        <!-- Numeri pagina -->
        <li v-for="page in pageNumbers" :key="page" class="mx-1">
          <button
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === page ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
            ]"
          >
            {{ page }}
          </button>
        </li>
        
        <!-- Ellipsis se necessario -->
        <li v-if="!pageNumbers.includes(totalPages - 1) && !pageNumbers.includes(totalPages)" class="mx-1 text-gray-500">...</li>
        
        <!-- Ultima pagina (sempre visibile) -->
        <li v-if="totalPages > 1 && !pageNumbers.includes(totalPages)" class="mx-1">
          <button
            @click="goToPage(totalPages)"
            class="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50"
          >
            {{ totalPages }}
          </button>
        </li>
        
        <!-- Pulsante Next -->
        <li class="mx-1">
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
            ]"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>