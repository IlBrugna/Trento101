<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    
    <router-link
      to="/serviziComune"
      class="relative rounded-lg overflow-hidden shadow hover:shadow-xl transition aspect-[4/5] bg-cover bg-center transform hover:scale-105 border border-emerald-100"
      style="background-image: url('/serviziComune.jpg');"
    >
      <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-6 text-center">
        <h2 class="text-2xl font-semibold text-white drop-shadow mb-2">Servizi Comune</h2>
        <p class="text-white text-xl drop-shadow">I servizi del nostro comune</p>
      </div>
    </router-link>

    <router-link
      to="/aziende"
      class="relative rounded-lg overflow-hidden shadow hover:shadow-xl transition aspect-[4/5] bg-cover bg-center transform hover:scale-105 border border-emerald-100"
      style="background-image: url('/aziende.jpg');"
    >
      <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-6 text-center">
        <h2 class="text-2xl font-semibold text-white drop-shadow mb-2">Aziende</h2>
        <p class="text-white text-xl drop-shadow">Le imprese sul territorio</p>
      </div>
    </router-link>

    <router-link
      to="/serviziUniversita"
      class="relative rounded-lg overflow-hidden shadow hover:shadow-xl transition aspect-[4/5] bg-cover bg-center transform hover:scale-105 border border-emerald-100"
      style="background-image: url('/serviziUniversita.jpg');"
    >
      <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-6 text-center">
        <h2 class="text-2xl font-semibold text-white drop-shadow mb-2">Servizi Università</h2>
        <p class="text-white text-xl drop-shadow">Portale per studenti e docenti</p>
      </div>
    </router-link>

  </div>
</template>


