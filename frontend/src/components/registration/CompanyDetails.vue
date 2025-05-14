<script setup>
import { ref } from 'vue';

const name = ref('');
const phoneNumber = ref('');
const website = ref('');
const address = ref('');
const description = ref('');
const picture = ref('');

const emit=defineEmits(['submit-registration']);

const handleFileDrop = async (event) => {

};

</script>

<template>
  <div class="bg-white py-8 px-6 shadow rounded-lg">
    <form @submit.prevent="emit('submit-registration', {name,phoneNumber,address,website,description,picture})">
      <div class="mb-6">
        <label for="name" class="block text-sm font-medium text-gray-700">Nome Azienda</label>
        <div class="mt-1">
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
            v-model="name"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
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
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
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
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
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
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
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
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
          ></textarea>
        </div>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Immagine Azienda</label>
        <div 
          @drop.prevent="handleFileDrop" 
          @dragover.prevent 
          class="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400">
          <input type="file" accept="image/*" class="hidden" @change="handleFileDrop" id="fileInput" />
          <label for="fileInput" class="text-center text-gray-500">
            Trascina un'immagine qui o clicca per selezionarla
          </label>
        </div>
        <div v-if="previewUrl" class="mt-4">
          <p class="text-sm text-gray-600 mb-2">Anteprima:</p>
          <img :src="previewUrl" alt="Anteprima immagine" class="max-h-40 rounded-md shadow" />
        </div>
      </div>
      <div>
        <button 
          type="submit" 
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Completa Registrazione
        </button>
      </div>
    </form>
  </div>
</template>