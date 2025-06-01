<script setup>
import { ref } from 'vue';
import InitialRegistration from '@/components/registration/InitialRegistration.vue';
import EmailVerification from '@/components/registration/EmailVerification.vue';
import CompanyDetails from '@/components/registration/CompanyDetails.vue';
import { companyRegistration } from '@/api/companyApi.js';
import { checkEmailExists } from '@/api/companyApi.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const currentStep = ref(1); // 1: email/password, 2: verifica email, 3: dettagli azienda
const userData = ref({
  email: '',
  password: ''
});

const error = ref(''); 
const isLoading = ref(false);

const handleFirstStep = async (data) => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Controlla se l'email esiste già
    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      error.value = 'Questa email è già registrata';
      return;
    }
    
    // Salva i dati e procedi alla verifica
    userData.value = { ...data };
    currentStep.value = 2;
    
  } catch (err) {
    error.value = err.message || 'Errore durante la verifica dell\'email';
  } finally {
    isLoading.value = false;
  }
};

const handleEmailVerified = () => {
  currentStep.value = 3;
};


const handleRegistration = async (companyData) => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const fullData = {
      ...userData.value,
      ...companyData
    };
    
    await companyRegistration(fullData);
    
    alert('Registrazione completata con successo! Puoi ora effettuare il login.');
    router.push({ name: 'login' });
    
  } catch (err) {
    error.value = err.message || 'Errore durante la registrazione';
  } finally {
    isLoading.value = false;
  }
};

//OTTIENE STAGE CORRENTE
const getStepTitle = () => {
  switch (currentStep.value) {
    case 1: return 'Crea il tuo account';
    case 2: return 'Verifica la tua email';
    case 3: return 'Completa la registrazione';
    default: return 'Registrazione';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ getStepTitle() }}
      </h2>
      
      <!-- Indicatore dei passi -->
      <div class="mt-6 flex justify-center">
        <div class="flex space-x-4">
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            ]">
              1
            </div>
            <span class="ml-2 text-sm text-gray-600">Account</span>
          </div>
          
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            ]">
              2
            </div>
            <span class="ml-2 text-sm text-gray-600">Verifica</span>
          </div>
          
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            ]">
              3
            </div>
            <span class="ml-2 text-sm text-gray-600">Dettagli</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Messaggio di errore generale -->
      <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="text-sm text-red-700">{{ error }}</div>
      </div>

      <!-- Step 1: Email e Password -->
      <InitialRegistration 
        v-if="currentStep === 1"
        @next-step="handleFirstStep"
        :is-loading="isLoading"
      />
      
      <!-- Step 2: Verifica Email -->
      <EmailVerification 
        v-else-if="currentStep === 2"
        :email="userData.email"
        @email-verified="handleEmailVerified"
      />
      
      <!-- Step 3: Dettagli Azienda -->
      <CompanyDetails 
        v-else-if="currentStep === 3"
        @submit-registration="handleRegistration"
        :is-loading="isLoading"
      />
    </div>

  </div>
</template>