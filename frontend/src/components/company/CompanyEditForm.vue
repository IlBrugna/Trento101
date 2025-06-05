<script setup>
import { ref, watch } from 'vue';
import { UploadClient } from '@uploadcare/upload-client';

const emit = defineEmits(['submit']);
const props = defineProps({ company: Object });

const imageFile = ref(null);
const form = ref({ ...props.company });
const isUploading = ref(false);
const isDragOver = ref(false);

//UPLOADCARE INIT
const uploadClient = new UploadClient({ 
  publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY 
});

watch(() => props.company, (newVal) => {
  form.value = { ...newVal };
}, { immediate: true });

const submitForm = async () => {
  try {
    isUploading.value = true;
    const modifiedFields = {};
    
    for (const key in form.value) {
      if (form.value[key] !== props.company[key]) {
        modifiedFields[key] = form.value[key];
      }
    }

    //UPLOAD IMMAGE FIRST
    if (imageFile.value) {
      const fileInfo = await uploadClient.uploadFile(imageFile.value);
      modifiedFields.picture = fileInfo.cdnUrl;
    }

    //SE NESSUN CAMBIAMENTO, NON INVIO EMIT
    if (Object.keys(modifiedFields).length > 0) {
      emit('submit', modifiedFields);
    } else {
      alert("Nessuna modifica da salvare.");
    }
   
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Errore durante il caricamento dell\'immagine. Riprova.');
  } finally {
    isUploading.value = false;
  }
};

const handleFileUpload = (file) => {
  if (file) {
    imageFile.value = file;
  }
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  handleFileUpload(file);
};

const onDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  const file = event.dataTransfer.files[0];
  handleFileUpload(file);
};

const onDragOver = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const onDragLeave = (event) => {
  event.preventDefault();
  isDragOver.value = false;
};
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nome</label>
      <input v-model="form.name" class="border rounded w-full px-3 py-2" required />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Descrizione</label>
      <textarea v-model="form.description" class="border rounded w-full px-3 py-2" required rows="4" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Indirizzo</label>
      <input v-model="form.address" class="border rounded w-full px-3 py-2" required />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Sito Web</label>
      <input v-model="form.website" class="border rounded w-full px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Immagine Copertina (FILE)</label>
      <div 
        @drop="onDrop"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        :class="[
          'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <input 
          type="file" 
          @change="onFileChange"
          accept="image/*"
          :disabled="isUploading"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div class="space-y-2">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="text-gray-600">
            <p class="text-sm">
              <span class="font-medium text-blue-600">Clicca per caricare</span> o trascina qui
            </p>
            <p class="text-xs text-gray-500">PNG, JPG, GIF fino a 10MB</p>
          </div>
          <div v-if="imageFile" class="text-sm text-green-600 font-medium">
            File selezionato: {{ imageFile.name }}
          </div>
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="bg-emerald-700 text-white font-semibold px-4 py-2 rounded hover:bg-emerald-800 disabled:bg-gray-400"
      :disabled="isUploading"
    >
      {{ isUploading ? 'Caricamento...' : 'Salva Modifiche' }}
    </button>
  </form>
</template>