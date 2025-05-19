<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['submit']);
const props = defineProps({ company: Object });

const form = ref({ ...props.company });

watch(() => props.company, (newVal) => {
  form.value = { ...newVal };
}, { immediate: true });

const submitForm = () => {
  emit('submit', form.value);
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

    <button type="submit"
      class="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
      Salva Modifiche
    </button>
  </form>
</template>
