<script setup>
import { companyLogin } from '@/api/authApi';
import LoginForm from '@/components/login/LoginForm.vue'
import {ref} from 'vue'; 
import { useRouter } from 'vue-router';

const error = ref(''); // Messaggio di errore per il login
const router = useRouter(); // Hook per accedere al router
const companyLoginHandler = async (loginData) => {
  try {
    const response = await companyLogin(loginData);
    if (response.status === 200) { //SE SUCCESSO
      router.push(`/azienda/${response.data.companyData._id}`); // DA MODIFICARE CON DASHBOARD AZIENDALE
    }
  } catch (err) {
    // Gestisci gli errori di login
    error.value = 'Errore nel login. Riprova!';
  }
}

</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-start pt-16">
    <div class="max-w-md w-full mx-auto">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Area Aziendale
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Accedi con le tue credenziali aziendali
        </p>
      </div>
      
      <div class="mt-8">
        <LoginForm @submit="companyLoginHandler" :errorMessage="error"/>
      </div>
    </div>
  </div>
</template>


