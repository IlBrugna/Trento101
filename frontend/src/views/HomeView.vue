<script setup>
import { ref } from 'vue';
import SectionCards from '@/components/common/SectionCards.vue';
import LatestSurvey from '@/components/common/LatestSurvey.vue';
</script>

<template>
  <main class="flex-1 container mx-auto px-2 py-2">
    <div class="flex justify-center mb-0">
      <img
        src="@/assets/logo-mountains.png"
        alt="Logo"
        class="w-full max-w-4xl h-48 md:h-64 object-contain"
        style="object-fit: contain;"
      />
    </div>
    <SectionCards />
    <LatestSurvey />
  </main>
</template>
