<script setup>
import { ref } from 'vue';
import SectionCards from '@/components/common/SectionCards.vue';
import LatestSurvey from '@/components/common/LatestSurvey.vue';
</script>

<template>
  <main class="flex-1 container mx-auto px-2 py-2 bg-emerald-50 relative">
    <!-- Sidebar fixed at the far right on desktop, lower to avoid navbar -->
    <aside
      class="hidden md:block fixed top-24 left-8 w-[360px] z-10"
      style="max-width:95vw;"
    >
      <div class="bg-white/80 border border-emerald-100 rounded-xl shadow-sm p-6">
        <LatestSurvey 
          type="recent-ended"
          :limit="3"
          :detailed="false"
          :show-voting="false"
          title="Ultimi Sondaggi"
        />
      </div>
    </aside>
    <!-- Main content, truly centered -->
    <div class="flex justify-center">
      <div class="w-full max-w-[1800px]">
        <div class="flex justify-center mb-0">
          <img
            src="@/assets/logo-mountains.png"
            alt="Trento101 Logo"
            class="w-full max-w-7xl h-56 md:h-80 object-contain"
            style="object-fit: contain;"
          />
        </div>
        <SectionCards />
      </div>
    </div>
  </main>
</template>
