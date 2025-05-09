<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE
import SectionCards from '@/components/SectionCards.vue';
import LatestSurvey from '@/components/LatestSurvey.vue';
</script>

<template>
    <main class="flex-1 container mx-auto px-4 py-6">
        <SectionCards />
        <LatestSurvey />
    </main>
</template>
