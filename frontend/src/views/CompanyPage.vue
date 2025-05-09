<script setup>
import { ref, onMounted } from 'vue';
import CompanyInfo from '@/components/company/CompanyInfo.vue';
import CompanyContacts from '@/components/company/CompanyContacts.vue';
//import CompanyMap from '@/components/CompanyMap.vue';

// DUMMY DATA, PRENDERE DA API!!!
const company = ref({
  id: 1,
  name: 'Azienda Esempio SpA',
  description: 'Azienda leader nel settore tecnologico con sede a Milano. Specializzata in soluzioni innovative per la digitalizzazione delle imprese e servizi di consulenza IT. Fondata nel 2010, l\'azienda ha registrato una crescita costante ed è ora presente in tutta Italia con più di 200 dipendenti.',
  logo: '/company-logo.png',
  photo: '/company-photo.jpg',
  contacts: {
    email: 'info@aziendaesempio.it',
    phone: '+39 02 1234567',
    address: 'Via Roma 123, 20121 Milano'
  },
  location: {
    lat: 45.464664,
    lng: 9.188540
  }
});

onMounted(() => {
  // Qui potrebbe esserci la logica per caricare i dati dell'azienda da un'API
  // basandosi ad esempio sull'ID presente nell'URL
  console.log('Component mounted');
});
</script>

<template>
  <div class="bg-gray-50 flex-1">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Colonna sinistra con foto e informazioni principali -->
        <div class="lg:col-span-2">
          <CompanyInfo 
            :name="company.name" 
            :description="company.description" 
            :photo="company.photo"
          />
        </div>
        
        <!-- Colonna destra con contatti e mappa -->
        <div class="space-y-6">
          <CompanyContacts :contacts="company.contacts" />
          <CompanyMap 
            :address="company.contacts.address"
            :location="company.location"
          />
        </div>
      </div>
    </div>
  </div>
</template>