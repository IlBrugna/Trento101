<template>
  <div class="bg-white rounded-2xl shadow-xl p-8">
    <h2 class="text-2xl font-bold text-gray-900 text-center">Richiesta di supporto tecnico aziendale</h2>
      <p class="text-center text-gray-600 text-sm mt-2 mb-6">
        Stai avendo difficoltà tecniche con Trento101? Compila il form, descrivendo la problematica e la contatteremo il prima possibile.
      </p>

    <form @submit.prevent="onSubmit" novalidate class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Oggetto -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
            Oggetto *
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.subject }"
            placeholder="Oggetto della richiesta"
            required
          />
          <p v-if="errors.subject" class="text-red-500 text-sm mt-1">{{ errors.subject }}</p>
        </div>
      </div>

      <!-- Descrizione -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Descrizione *
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="6"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          :class="{ 'border-red-500 focus:ring-red-500': errors.description }"
          placeholder="Descrivi nel dettaglio la tua richiesta aziendale..."
          required
        ></textarea>
        <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
      </div>

      <!-- Pulsante invio -->
      <div class="flex justify-center pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Invio in corso...
          </span>
          <span v-else>Invia richiesta</span>
        </button>
      </div>
    </form>

    <!-- Messaggi di esito -->
    <div v-if="serverError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700">{{ serverError }}</p>
      </div>
    </div>

    <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-green-700">Richiesta inviata con successo! Ti ricontatteremo a breve.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { createCompanySupportRequest } from '@/api/richiestaSupportoAziendaleAPI';

const authStore = useAuthStore();

const form = ref({
  subject: '',
  description: '',
});

const errors = ref({});
const loading = ref(false);
const serverError = ref('');
const success = ref(false);

function validate() {
  errors.value = {};
  if (!form.value.subject.trim()) errors.value.subject = "L'oggetto è obbligatorio";
  if (!form.value.description.trim()) errors.value.description = 'La descrizione è obbligatoria';
  return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
  serverError.value = '';
  success.value = false;
  if (!validate()) return;
  loading.value = true;

  const requestPayload = {
    nome: authStore.user?.name || 'Azienda anonima',
    email: authStore.user?.email || '',
    problema: form.value.subject,
    descrizione: form.value.description,
  };

  try {
    await createCompanySupportRequest(requestPayload);
    success.value = true;
    form.value = { subject: '', description: '' };
  } catch (err) {
    serverError.value = err.response?.data?.message || 'Errore durante l’invio della richiesta';
  } finally {
    loading.value = false;
  }
}
</script>
