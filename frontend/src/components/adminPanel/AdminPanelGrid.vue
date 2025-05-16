<script setup>
import { useRouter } from 'vue-router';
import AdminPanelCard from '@/components/adminPanel/AdminPanelCard.vue';

defineProps({
  panels: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
    <AdminPanelCard 
      v-for="panel in panels" 
      :key="panel.id" 
      :panel="panel"
    />
  </div>
</template>