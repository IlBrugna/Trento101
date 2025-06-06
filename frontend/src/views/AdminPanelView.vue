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
    color: 'bg-emerald-700',
    size: 'md',
    route: '/companyManager'
  },
  {
    id: 2,
    title: 'Gestisci news',
    icon: 'users',
    content: 'Gestisci le news comunali',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminNewsManager'
  },
  {
    id: 3,
    title: 'Gestisci pagina servizi',
    icon: 'users',
    content: 'Gestisci i servizi comunali',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminServicesManager'
  },
  {
    id: 4,
    title: 'Gestisci sondaggi',
    icon: 'users',
    content: 'Crea polls di interesse per i cittadini',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminPollManager'
  },
  {
    id: 5,
    title: 'Gestisci richieste di supporto',
    icon: 'users',
    content: 'Gestisci le richieste di supporto',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminSupportRequestManager'
  },
  {
    id: 6,
    title: 'Gestisci pagina servizi universitari',
    icon: 'school',
    content: 'Gestione CRUD dei servizi UniTrento',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminUniversitaServicesManager'
  },
  {
  id: 7,
  title: 'Gestisci richieste di supporto aziendali',
  icon: 'users',
  content: 'Gestione delle richieste inviate dalle aziende',
  color: 'bg-emerald-700',
  size: 'md',
  route: '/adminCompanySupportRequestManager'
  },
  {
    id: 8,
    title: 'Visualizza statistiche',
    icon: 'users',
    content: 'Visualizza le statistiche del sito',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminStatisticsManager'
  },
  {
    id: 9,
    title: 'Visualizza log',
    icon: 'users',
    content: 'Visualizza i log degli eventi',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminLogManager'
  }
]);

</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <AdminPanelHeader title = "Pannello di Controllo Admin" />
    <AdminPanelGrid :panels = "adminPanels" />
  </main>
</template>