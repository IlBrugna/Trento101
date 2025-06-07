<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['submit'])

const props = defineProps({
  errorMessage: String  // Prop per ricevere messaggi di errore dal padre
});
//VARIABILI REATTIVE
const email = ref('')
const password = ref('')

const onSubmit = () => {
  const loginData = {
    email: email.value,
    password: password.value,
  }
  emit('submit', loginData) //INVIO EVENTO CON PAYLOAD
}

</script>

<template>
  <div class="bg-white py-8 px-6 shadow rounded-lg">
    <form @submit.prevent="onSubmit">
      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700">Indirizzo Email</label>
        <div class="mt-1">
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            v-model="email"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm" 
            placeholder="azienda@email.com"
          />
        </div>
      </div>

      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            v-model="password"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm" 
          />
        </div>
      </div>

      <div v-if="props.errorMessage" class="text-red-600 text-sm mt-2">
        {{ props.errorMessage }}
      </div>

      <div>
        <button 
          type="submit" 
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600">
          Accedi
        </button>
      </div>
    </form>
  </div>
</template>