<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminPanelHeader from '@/components/adminPanel/AdminPanelHeader.vue';
import AdminPanelGrid from '@/components/adminPanel/AdminPanelGrid.vue';

const router = useRouter();

const adminPanels = ref([
  // Aziende
  {
    id: 1,
    category: 'Aziende',
    title: 'Gestione pagine aziendali',
    icon: 'office-building',
    content: 'Attiva, disattiva o modifica le pagine delle aziende registrate.',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/companyManager'
  },
  {
    id: 2,
    category: 'Aziende',
    title: 'Supporto aziende',
    icon: 'briefcase',
    content: 'Gestisci le richieste di supporto inviate dalle aziende.',
    color: 'bg-emerald-700',
    size: 'md',
    route: '/adminCompanySupportRequestManager'
  },
  // Cittadini
  {
    id: 3,
    category: 'Cittadini',
    title: 'Gestione news',
    icon: 'newspaper',
    content: 'Aggiungi, modifica o rimuovi le news comunali.',
    color: 'bg-blue-700',
    size: 'md',
    route: '/adminNewsManager'
  },
  {
    id: 4,
    category: 'Cittadini',
    title: 'Gestione servizi comunali',
    icon: 'building-library',
    content: 'Gestisci i servizi offerti dal Comune.',
    color: 'bg-blue-700',
    size: 'md',
    route: '/adminServicesManager'
  },
  {
    id: 5,
    category: 'Cittadini',
    title: 'Supporto cittadini',
    icon: 'chat-bubble-left-right',
    content: 'Gestisci le richieste di supporto inviate dai cittadini.',
    color: 'bg-blue-700',
    size: 'md',
    route: '/adminSupportRequestManager'
  },
  {
    id: 6,
    category: 'Cittadini',
    title: 'Crea sondaggio',
    icon: 'chart-bar',
    content: 'Crea nuovi sondaggi di interesse pubblico.',
    color: 'bg-blue-700',
    size: 'md',
    route: '/adminPollCreate'
  },
  {
    id: 7,
    category: 'Cittadini',
    title: 'Gestione sondaggi',
    icon: 'chart-pie',
    content: 'Monitora e chiudi i sondaggi attivi.',
    color: 'bg-blue-700',
    size: 'md',
    route: '/AdminPollManager'
  },
  // Università
  {
    id: 8,
    category: 'Università',
    title: 'Gestione servizi universitari',
    icon: 'academic-cap',
    content: 'Gestisci i servizi dedicati agli studenti UniTrento.',
    color: 'bg-yellow-700',
    size: 'md',
    route: '/adminUniversitaServicesManager'
  },
  // Sistema
  {
    id: 9,
    category: 'Sistema',
    title: 'Statistiche sito',
    icon: 'chart-bar-square',
    content: 'Visualizza statistiche di utilizzo della piattaforma.',
    color: 'bg-gray-700',
    size: 'md',
    route: '/adminStatisticsManager'
  },
  {
    id: 10,
    category: 'Sistema',
    title: 'Log eventi',
    icon: 'clipboard-document-list',
    content: 'Consulta i log degli eventi di sistema.',
    color: 'bg-gray-700',
    size: 'md',
    route: '/adminLogManager'
  }
]);

// Raggruppa per categoria
const groupedPanels = computed(() => {
  const groups = {};
  adminPanels.value.forEach(panel => {
    if (!groups[panel.category]) groups[panel.category] = [];
    groups[panel.category].push(panel);
  });
  return groups;
});
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <AdminPanelHeader title="Pannello di Controllo Admin" />
    <div v-for="(panels, category) in groupedPanels" :key="category" class="mb-8">
      <h2 class="text-xl font-bold mb-4">{{ category }}</h2>
      <AdminPanelGrid :panels="panels" />
    </div>
  </main>
</template>