<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminPanelHeader from '@/components/adminPanel/AdminPanelHeader.vue';
import AdminPanelGrid from '@/components/adminPanel/AdminPanelGrid.vue';

const router = useRouter();

const adminPanels = ref([
  {
    id: 1,
    title: 'Test Titolo Pannello',
    icon: 'users',
    content: 'contenuto del pannello',
    color: 'bg-blue-500',
    size: 'md',
    route: '/admin/paginatest'
  }
]);
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <AdminPanelHeader title = "Pannello di Controllo Admin" />
    <AdminPanelGrid :panels = "adminPanels" />
  </main>
</template>