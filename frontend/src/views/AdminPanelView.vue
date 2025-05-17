<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminPanelHeader from '@/components/adminPanel/AdminPanelHeader.vue';
import AdminPanelGrid from '@/components/adminPanel/AdminPanelGrid.vue';

const router = useRouter();

const adminPanels = ref([
  {
    id: 1,
    title: 'Gestisci pagine aziendali',
    icon: 'users',
    content: 'Attivare, disattivare le pagine aziendali!',
    color: 'bg-blue-500',
    size: 'md',
    route: '/companyManager'
  },
  {
    id: 2,
    title: 'Gestisci news',
    icon: 'users',
    content: 'Gestisci le news comunali',
    color: 'bg-blue-500',
    size: 'md',
    route: '/adminNewsManager'
  }
]);

</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <AdminPanelHeader title = "Pannello di Controllo Admin" />
    <AdminPanelGrid :panels = "adminPanels" />
  </main>
</template>