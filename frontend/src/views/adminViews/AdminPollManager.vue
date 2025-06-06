<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createPoll, downloadAllPolls } from '@/api/pollsApi.js';
const router = useRouter();

const form = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  options: [
    { text: '' },
    { text: '' }
  ]
});

const loading = ref(false);
const error = ref('');
const success = ref('');

const addOption = () => {
  form.value.options.push({ text: '' });
};

const removeOption = (index) => {
  if (form.value.options.length > 2) {
    form.value.options.splice(index, 1);
  }
};

// Submit form
const submitSurvey = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';

    if (!form.value.title.trim()) { //VALIDAZIONE DI BASE
      throw new Error('Il titolo è obbligatorio');
    }

    const validOptions = form.value.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      throw new Error('Sono necessarie almeno 2 opzioni');
    }

    // PREPARAZIONE DATI
    const surveyData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      options: validOptions.map(opt => ({ text: opt.text.trim() })),
      startDate: form.value.startDate || null,
      endDate: form.value.endDate || null
    };
    
    await createPoll(surveyData);
    
    success.value = 'Sondaggio creato con successo!';

    form.value = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      options: [{ text: '' }, { text: '' }]
    };

  } catch (err) {
    error.value = err.message || 'Errore durante la creazione del sondaggio';
  } finally {
    loading.value = false;
  }
};

const selectedFormat = ref('json');

const downloadPolls = async () => {
  try {
    loading.value = true;
    const blob = await downloadAllPolls(selectedFormat.value);
    
    // formato
    const extensions = {
      json: 'json',
      csv: 'csv',
      excel: 'xlsx'
    };
    
    const extension = extensions[selectedFormat.value];
    const fileName = `sondaggi_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    // Crea un link per il download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    success.value = `Download ${selectedFormat.value.toUpperCase()} completato!`;
  } catch (err) {
    error.value = 'Errore durante il download dei sondaggi';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-gray-50 flex-1">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Crea Nuovo Sondaggio</h1>
        </div>

        <div class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center space-x-3">
              <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <span class="text-green-600 text-lg">📥</span>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Esporta Sondaggi</h3>
                <p class="text-xs text-gray-500">Scarica tutti i sondaggi esistenti</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <label for="format-select" class="text-sm font-medium text-gray-700">Formato:</label>
                <select 
                  id="format-select"
                  v-model="selectedFormat"
                  class="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
              
              <button
                @click="downloadPolls"
                :disabled="loading"
                class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                <span v-if="loading" class="flex items-center space-x-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Scaricando...</span>
                </span>
                <span v-else class="flex items-center space-x-2">
                  <span>Scarica</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
        
        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {{ success }}
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form @submit.prevent="submitSurvey" class="space-y-6">
            
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Titolo del Sondaggio *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Inserisci il titolo del sondaggio"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descrizione (opzionale)
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrivi il sondaggio (opzionale)"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Opzioni di Risposta *
              </label>
              <div class="space-y-3">
                <div 
                  v-for="(option, index) in form.options" 
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <span class="text-sm text-gray-500 w-8">{{ index + 1 }}.</span>
                  <input
                    v-model="option.text"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="`Opzione ${index + 1}`"
                  />
                  <button
                    v-if="form.options.length > 2"
                    type="button"
                    @click="removeOption(index)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Rimuovi opzione"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                @click="addOption"
                class="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                + Aggiungi Opzione
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Data di Inizio (opzionale)
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Data di Fine (opzionale)
                </label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="goBack"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Annulla
              </button>
              
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading">Creazione...</span>
                <span v-else>Crea Sondaggio</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>