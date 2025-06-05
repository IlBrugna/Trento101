<script setup>
import { ref } from 'vue';
import { UploadClient } from '@uploadcare/upload-client'; 
const name = ref('');
const phoneNumber = ref('');
const website = ref('');
const address = ref('');
const description = ref('');
const picture = ref('');
const imageFile = ref(null);
const isDragOver = ref(false);

//UPLOADCARE INIT
const uploadClient = new UploadClient({ 
  publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY 
});

const emit=defineEmits(['submit-registration']);

const handleFileUpload = (file) => {
  if (file && file.type.startsWith('image/')) {
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

const handleSubmit = async () => {
  let finalPicture = picture.value;

  if (imageFile.value) {
    try {
      const fileInfo = await uploadClient.uploadFile(imageFile.value);
      finalPicture = fileInfo.cdnUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }

  emit('submit-registration', {
    name: name.value,
    phoneNumber: phoneNumber.value,
    website: website.value,
    address: address.value,
    description: description.value,
    picture: finalPicture
  });
 };

</script>

<template>
  <div class="bg-white py-8 px-6 shadow rounded-lg">
    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label for="name" class="block text-sm font-medium text-gray-700">Nome Azienda</label>
        <div class="mt-1">
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
            v-model="name"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm" 
          />
        </div>
      </div>
      <div class="mb-6">
        <label for="interests" class="block text-sm font-medium text-gray-700">Indirizzo</label>
        <div class="mt-1">
          <input 
            id="address" 
            name="address" 
            type="text" 
            v-model="address"
            required
            placeholder="Via Nazionale, 23, Trento"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm" 
          />
        </div>
      </div>
      <div class="mb-6">
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Numero di Telefono</label>
        <div class="mt-1">
          <input 
            id="phoneNumber" 
            name="phoneNumber" 
            type="tel" 
            v-model="phoneNumber"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm" 
          />
        </div>
      </div>
      <div class="mb-6">
        <label for="website" class="block text-sm font-medium text-gray-700">Sito Web</label>
        <div class="mt-1">
          <input 
            id="website" 
            name="website" 
            type="url" 
            v-model="website"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm" 
          />
        </div>
      </div>
      <div class="mb-6">
        <label for="description" class="block text-sm font-medium text-gray-700">Descrizione</label>
        <div class="mt-1">
          <textarea
            id="description"
            name="description"
            v-model="description"
            rows="4"
            required
            placeholder="Scrivi una descrizione della tua azienda..."
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm resize-none"
          ></textarea>
        </div>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700">Carica Immagine personalizzata</label>
        <div class="mt-1">
          <div 
            @drop="onDrop"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            :class="[
              'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragOver ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            <input 
              type="file" 
              @change="onFileChange"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="space-y-2">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-gray-600">
                <p class="text-sm">
                  <span class="font-medium text-emerald-700">Clicca per caricare</span> o trascina qui
                </p>
              </div>
              <div v-if="imageFile" class="text-sm text-green-600 font-medium">
                File selezionato: {{ imageFile.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button 
          type="submit" 
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600">
          Completa Registrazione
        </button>
      </div>
    </form>
  </div>
</template>