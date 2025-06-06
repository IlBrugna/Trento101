<script setup>
import { ref } from 'vue';
import SectionCards from '@/components/common/SectionCards.vue';
</script>

<template>
  <main class="flex-1 container mx-auto px-2 py-2 bg-emerald-50 relative">
    
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
