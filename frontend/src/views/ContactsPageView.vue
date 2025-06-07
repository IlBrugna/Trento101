<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Contattaci</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Hai domande o hai bisogno di supporto? Siamo qui per aiutarti. 
          Compila il modulo sottostante e ti risponderemo il prima possibile.
        </p>
      </div>

      <!-- Form di contatto -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Invia la tua richiesta</h2>
        
        <form @submit.prevent="onSubmit" novalidate class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div class="relative">
                <input
                  id="email"
                  v-model="form.requesterEmail"
                  type="email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  :class="{ 'border-red-500 focus:ring-red-500': errors.requesterEmail }"
                  placeholder="tua@email.com"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
              </div>
              <p v-if="errors.requesterEmail" class="text-red-500 text-sm mt-1">{{ errors.requesterEmail }}</p>
            </div>

            <!-- Oggetto -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Oggetto *
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                :class="{ 'border-red-500 focus:ring-red-500': errors.subject }"
                placeholder="Oggetto della tua richiesta"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none"
              :class="{ 'border-red-500 focus:ring-red-500': errors.description }"
              placeholder="Descrivi la tua richiesta nel dettaglio..."
              required
            ></textarea>
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
          </div>

          <!-- Bottone per inviare la richiesta -->
          <div class="flex justify-center pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="px-8 py-3 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-800 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Invio in corso...
              </span>
              <span v-else>Invia richiesta</span>
            </button>
          </div>
        </form>

        <!-- Messaggio di errore/successo -->
        <div v-if="serverError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700">{{ serverError }}</p>
          </div>
        </div>

        <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-green-700">Richiesta inviata con successo! Ti risponderemo a breve.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createSupportRequest } from '@/api/richiestaSupportoAPI';

const form = ref({
  subject: '',
  description: '',
  requesterEmail: '',
  is_company: false,
});

const errors = ref({});
const loading = ref(false);
const serverError = ref('');
const success = ref(false);

function validate() {
  errors.value = {};
  
  if (!form.value.subject.trim()) {
    errors.value.subject = "L'oggetto è obbligatorio";
  }
  
  if (!form.value.description.trim()) {
    errors.value.description = 'La descrizione è obbligatoria';
  }
  
  if (!form.value.requesterEmail.trim()) {
    errors.value.requesterEmail = "L'email è obbligatoria";
  } else if (!isValidEmail(form.value.requesterEmail)) {
    errors.value.requesterEmail = 'Inserisci un indirizzo email valido';
  }
  
  return Object.keys(errors.value).length === 0;
}

// Funzione per validare l'email
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim().toLowerCase());
}

async function onSubmit() {
  serverError.value = '';
  success.value = false;
  
  if (!validate()) return;
  
  loading.value = true;
  
  try {
    await createSupportRequest(form.value);
    success.value = true;
    form.value = { subject: '', description: '', requesterEmail: '', is_company: false };
  } catch (err) {
    serverError.value = err.message || 'Si è verificato un errore imprevisto. Riprova più tardi.';
  } finally {
    loading.value = false;
  }
}
</script>