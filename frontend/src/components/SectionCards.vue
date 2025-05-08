<script setup>
//DATA DA AGGIUNGERE
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white shadow rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold mb-2">Servizi Comune</h2>
        <p class="text-gray-600">Scopri i servizi offerti dal comune.</p>
      </div>
      <div class="bg-white shadow rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold mb-2">Aziende</h2>
        <p class="text-gray-600">Soluzioni per le imprese.</p>
      </div>
      <div class="bg-white shadow rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold mb-2">Servizi Università</h2>
        <p class="text-gray-600">Portale per studenti e docenti.</p>
      </div>
    </div>
  </template>
  
