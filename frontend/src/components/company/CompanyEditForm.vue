<script setup>
import { ref, watch } from 'vue';
import { UploadClient } from '@uploadcare/upload-client';

const emit = defineEmits(['submit']);
const props = defineProps({ company: Object });

const imageFile = ref(null);
const form = ref({ ...props.company });
const isUploading = ref(false);

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

    //UPLOAD IMMAGE FIRST
    if (imageFile.value) {
      const fileInfo = await uploadClient.uploadFile(imageFile.value);
      form.value.picture = fileInfo.cdnUrl;
    }

    emit('submit', form.value);
    
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Errore durante il caricamento dell\'immagine. Riprova.');
  } finally {
    isUploading.value = false;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
  }
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
      <label class="block text-sm font-medium text-gray-700">Immagine Copertina (URL)</label>
      <input v-model="form.picture" class="border rounded w-full px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Immagine Copertina (FILE)</label>
      <input 
        type="file" 
        class="border rounded w-full px-3 py-2" 
        @change="handleFileUpload"
        accept="image/*"
        :disabled="isUploading"
      />
    </div>

    <button 
      type="submit"
      class="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      :disabled="isUploading"
    >
      {{ isUploading ? 'Caricamento...' : 'Salva Modifiche' }}
    </button>
  </form>
</template>