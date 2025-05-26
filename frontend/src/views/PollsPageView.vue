<script setup>
import { ref, computed } from 'vue';
import LatestSurvey from '@/components/common/LatestSurvey.vue';

const activeTab = ref('active'); // 'active' o 'expired'
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Sondaggi</h1>
      <p class="text-gray-600">Partecipa ai sondaggi attivi o visualizza i risultati di quelli conclusi</p>
    </div>

    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'active'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'active' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]">
            Sondaggi Attivi 
          </button>
          <button
            @click="activeTab = 'expired'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'expired' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Sondaggi Conclusi
          </button>
        </nav>
      </div>
    </div>

    <!-- TAB ATTIVI -->
    <LatestSurvey 
      v-if="activeTab === 'active'"
      type="active" 
      :limit="0" 
      :detailed="true" 
      :show-voting="true"
      title=""
    />

    <!-- TAB SCADUTI -->
    <LatestSurvey 
      v-else-if="activeTab === 'expired'"
      type="expired" 
      :limit="0" 
      :detailed="true" 
      :show-voting="false"
      title=""
    />
  </main>
</template>