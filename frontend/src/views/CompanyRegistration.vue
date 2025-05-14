<script setup>
import { ref } from 'vue';
import InitialRegistration from '@/components/registration/InitialRegistration.vue';
import CompanyDetails from '@/components/registration/CompanyDetails.vue';
import { companyRegistration } from '@/api/companyApi.js';
import { checkEmailExists } from '@/api/authApi.js';
import { useRouter } from 'vue-router';

const router = useRouter()
const partialCompanyData= ref({});
const companyData = ref({});

const currentStep = ref(1);

const goToDetails = async (data) => {
  try {
    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      alert('Questo indirizzo email è già registrato. Prova con un altro.');
    } else {
      currentStep.value = 2;
      partialCompanyData.value = data;
    }
  } catch (error) {
    alert('Errore durante la verifica dell\'email: ' + error.message);
  }
};

const submitRegistration = async (data) => {
  companyData.value = { ...partialCompanyData.value, ...data };
  await companyRegistration(companyData.value).then(() => {
    alert('Registrazione riuscita! Ora puoi accedere!');
    router.push('/login');
  }).catch((error) => {
    alert('Errore nella registrazione: ' + error.message);
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-start pt-6">
    <div class="max-w-md w-full mx-auto">
      <div class="text-center">
        <h2 v-if="currentStep === 1" class="text-3xl font-extrabold text-gray-900">
          Crea un profilo per la tua azienda!
        </h2>
        <h2 v-else class="text-3xl font-extrabold text-gray-900">
          Ci servono altre informazioni
        </h2>
      </div>
      
      <div class="mt-8">
        <InitialRegistration v-if="currentStep === 1" @next-step="goToDetails" />
        <CompanyDetails v-else @submit-registration="submitRegistration" />
        <div v-if="error" class="mt-4 text-center text-red-600 text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>