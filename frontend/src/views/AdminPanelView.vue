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
    content: 'Aggiungi, rimuovi o modifica le news comunali',
    color: 'bg-blue-500',
    size: 'md',
    route: '/adminNewsManager'
  },
  {
    id: 3,
    title: 'Gestisci pagina servizi comunali',
    icon: 'users',
    content: 'Aggiungi, rimuovi o modifica i servizi comunali',
    color: 'bg-blue-500',
    size: 'md',
    route: '/adminServicesManager'
  },
  {
    id: 4,
    title: 'Gestisci richieste di supporto',
    icon: 'users',
    content: 'Gestisci le richieste di supporto',
    color: 'bg-blue-500',
    size: 'md',
    route: '/adminSupportRequestManager'
  },
  {
    id: 5,
    title: 'Crea sondaggi',
    icon: 'users',
    content: 'Crea polls di interesse per i cittadini',
    color: 'bg-blue-500',
    size: 'md',
    route: '/adminPollCreate'
  },
  {
    id: 6,
    title: 'Monitora e chiudi sondaggi',
    icon: 'users',
    content: 'Quanti hanno votato? Devi chiudere il sondaggio prima del previsto?',
    color: 'bg-blue-500',
    size: 'md',
    route: '/AdminPollManager'
  }
]);

</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <AdminPanelHeader title = "Pannello di Controllo Admin" />
    <AdminPanelGrid :panels = "adminPanels" />
  </main>
</template>