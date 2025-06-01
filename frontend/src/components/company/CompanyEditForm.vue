<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['submit']);
const props = defineProps({ company: Object });
const imageFile = ref(null);
const form = ref({ ...props.company });

watch(() => props.company, (newVal) => {
  form.value = { ...newVal };
}, { immediate: true });

const submitForm = () => {
  const formData = new FormData();

  //TUTTI CAMPI FORM
  for (const key in form.value) {
    formData.append(key, form.value[key]);
  }

  //FILE SE PRESENTE
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  emit('submit', formData);
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
      <input type="file" class="border rounded w-full px-3 py-2" @change="handleFileUpload"/>
    </div>

    

    <button type="submit"
      class="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
      Salva Modifiche
    </button>
  </form>
</template>
