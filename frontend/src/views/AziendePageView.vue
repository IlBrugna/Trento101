<script setup>
import { ref, onMounted } from 'vue';
import CompanyInfo from '@/components/company/CompanyInfo.vue';
import CompanyContacts from '@/components/company/CompanyContacts.vue';
//import CompanyMap from '@/components/CompanyMap.vue';
import { fetchSpecificCompany } from '@/api/companyApi.js';

const company = ref({});

onMounted(async () => {
  try {
    const companyDetails = await fetchSpecificCompany("681dff3c21b0deb8e7af95f0");

    company.value = companyDetails; // Update the reactive variable
  } catch (error) {
    console.error(error.message);
  }
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
            :picture="company.picture"
          />
        </div>
        <div class="space-y-6">
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