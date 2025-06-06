<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  fetchAllNews,
  createNews,
  updateNews,
  deleteNews
} from '@/api/newsAPI';

// ───────────────── state
const news        = ref([]);
const loading     = ref(false);
const error       = ref(null);
const editingId   = ref(null);        // null → create mode
const formData    = reactive({
  title: '',
  date:  '',
  summary: '',
  url: ''
});

// ───────────────── helpers
const resetForm = () => {
  editingId.value = null;
  Object.assign(formData, { title:'', date:'', summary:'', url:'' });
};

const fetchAndFill = async () => {
  loading.value = true;
  try {
    news.value = await fetchAllNews();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  loading.value = true;
  try {
    if (!editingId.value) {
      await createNews({ ...formData, date: new Date(formData.date) });
    } else {
      await updateNews(editingId.value, { ...formData, date: new Date(formData.date) });
    }
    await fetchAndFill();
    resetForm();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const editItem = (item) => {
  editingId.value = item._id;
  Object.assign(formData, {
    title:   item.title,
    date:    item.date.slice(0,10),
    summary: item.summary,
    url:     item.url
  });
};

const removeItem = async (id) => {
  if (!confirm('Eliminare questa news?')) return;
  loading.value = true;
  try {
    await deleteNews(id);
    await fetchAndFill();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAndFill);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Gestione News</h1>

    <!-- form -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingId ? 'Modifica News' : 'Nuova News' }}
      </h2>
      <div class="grid md:grid-cols-2 gap-4">
        <input v-model="formData.title"  placeholder="Titolo" class="border p-2 rounded" />
        <input v-model="formData.date"   type="date" class="border p-2 rounded" />
        <input v-model="formData.url"    placeholder="URL" class="border p-2 rounded md:col-span-2" />
        <textarea v-model="formData.summary" placeholder="Sommario"
                  class="border p-2 rounded md:col-span-2" rows="3" />
      </div>
      <div class="mt-4 flex gap-3">
        <button @click="submitForm"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                :disabled="loading">
          {{ editingId ? 'Aggiorna' : 'Crea' }}
        </button>
        <button v-if="editingId" @click="resetForm"
                class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                :disabled="loading">
          Annulla
        </button>
      </div>
    </div>

    <!-- list -->
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
    <table v-if="news.length" class="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-100 text-left text-sm uppercase tracking-wider">
        <tr>
          <th class="px-4 py-2">Titolo</th>
          <th class="px-4 py-2">Data</th>
          <th class="px-4 py-2 w-32"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in news" :key="item._id" class="divide-y">
          <td class="px-4 py-2">{{ item.title }}</td>
          <td class="px-4 py-2">{{ item.date.slice(0,10) }}</td>
          <td class="px-4 py-2 flex gap-2">
            <button @click="editItem(item)"
                    class="text-blue-600 hover:underline text-sm">Modifica</button>
            <button @click="removeItem(item._id)"
                    class="text-red-600 hover:underline text-sm">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!loading">Nessuna news presente.</p>
  </div>
</template>
