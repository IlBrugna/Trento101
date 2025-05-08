<script setup>
import { ref } from 'vue';

const items = ref([
  { title: 'SONDAGGIO 001', date: '2025-05-01' },
  { title: 'RISPOSTA 1', date: '2025-04-28' },
  { title: 'RISPOSTA 2', date: '2025-04-25' }
]);
</script>

<template>
    <section>
      <h3 class="text-lg font-medium mb-4">Ultimi Sondaggi</h3>
      <ul class="bg-white shadow rounded-lg divide-y">
        <li v-for="(item, idx) in items" :key="idx" class="px-4 py-3 hover:bg-gray-50 flex justify-between">
          <span>{{ item.title }}</span>
          <span class="text-gray-500 text-sm">{{ item.date }}</span>
        </li>
      </ul>
    </section>
  </template>
  
