<script setup>
import { ref, onMounted } from 'vue';
import CompanyInfo from '@/components/company/CompanyInfo.vue';
import CompanyContacts from '@/components/company/CompanyContacts.vue';
import { useRoute } from 'vue-router';
//import CompanyMap from '@/components/CompanyMap.vue';
import { fetchSpecificCompany } from '@/api/companyApi.js';

const company = ref({});
const route = useRoute();
const companyID = route.params.companyID;
const badRequest = ref({});

onMounted(async () => {
  try {
    const companyDetails = await fetchSpecificCompany(companyID);
    company.value = companyDetails; // Update the reactive variable
  } catch (error) {
    badRequest.value = error;
    console.error('Error fetching company details:', error);
  }
});
</script>

<template>
  <div class="bg-gray-50 flex-1">
    <div class="container mx-auto px-4 py-8">
      <div v-if="badRequest" class="text-red-500 text-center">
        <p>Errore {{badRequest.status}} {{ badRequest.message }}</p>
        </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Colonna sinistra con foto e informazioni principali -->
        <div class="lg:col-span-2">
          <CompanyInfo 
            :name="company.name"
            :description="company.description" 
            :picture="company.picture"
          />
        </div>
        <div v-if="!badRequest" class="space-y-6">
          <CompanyContacts 
            :email="company.email" 
            :phoneNumber="company.phoneNumber"
            :address="company.address"
            :website="company.website"
           />
        </div>
        <!-- FUTURA MAPPA QUI -->
    
      </div>
    </div>
  </div>
</template>