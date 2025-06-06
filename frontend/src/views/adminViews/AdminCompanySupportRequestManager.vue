<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Gestione Richieste Supporto Aziende</h1>

    <div v-if="loading" class="text-gray-600">Caricamento richieste...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="!loading && requests.length === 0" class="text-gray-500">
      Nessuna richiesta trovata.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead class="bg-gray-50">
          <tr class="text-left text-sm font-semibold text-gray-700">
            <th class="px-4 py-3">Data</th>
            <th class="px-4 py-3">Problema</th>
            <th class="px-4 py-3">Descrizione</th>
            <th class="px-4 py-3">Richiedente</th>
            <th class="px-4 py-3">Priorità</th>
            <th class="px-4 py-3">Stato</th>
            <th class="px-4 py-3">Ultima risposta</th>
            <th class="px-4 py-3">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm">
          <tr v-for="req in requests" :key="req._id">
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(req.createdAt) }}</td>
            <td class="px-4 py-3 font-medium">{{ req.problema }}</td>
            <td class="px-4 py-3">{{ req.descrizione }}</td>
            <td class="px-4 py-3">{{ req.nome }} ({{ req.email }})</td>
            <td class="px-4 py-3">
              <span :class="chipColor(req.priority, true)">{{ labels.priority[req.priority] }}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="chipColor(req.status, false)">{{ labels.status[req.status] }}</span>
            </td>
            <td class="px-4 py-3">
              {{ req.lastReplyAt ? formatDate(req.lastReplyAt) : '—' }}
            </td>
            <td class="px-4 py-3 space-x-2">
              <button @click="openEditModal(req)" class="text-indigo-600 hover:underline text-xs">Modifica</button>
              <button
                @click="openEmailModal(req)"
                class="text-blue-600 hover:underline text-xs"
                :disabled="loading"
              >
                Rispondi
              </button>
              <button @click="removeItem(req._id)" class="text-red-600 hover:underline">Elimina</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODALE EMAIL -->
    <div v-if="showEmailModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-4">Invia risposta a {{ emailModalData.to }}</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Oggetto</label>
          <input v-model="emailModalData.subject" class="w-full border px-3 py-2 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Messaggio</label>
          <textarea v-model="emailModalData.message" rows="4" class="w-full border px-3 py-2 rounded"></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="closeEmailModal" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Annulla</button>
          <button @click="sendEmailResponse" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Invia</button>
        </div>
      </div>
    </div>

    <!-- MODALE MODIFICA -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-4">Modifica richiesta</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Problema</label>
          <input v-model="editData.problema" class="w-full border px-3 py-2 rounded" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Descrizione</label>
          <textarea v-model="editData.descrizione" rows="3" class="w-full border px-3 py-2 rounded"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Priorità</label>
          <select v-model="editData.priority" class="w-full border px-3 py-2 rounded">
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Stato</label>
          <select v-model="editData.status" class="w-full border px-3 py-2 rounded">
            <option value="in_attesa">In Attesa</option>
            <option value="in_corso">In Corso</option>
            <option value="risolto">Risolto</option>
          </select>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Annulla</button>
          <button @click="submitEditRequest" class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded">Salva</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  getAllCompanySupportRequests,
  updateCompanySupportRequest,
  deleteCompanySupportRequest,
} from '@/api/richiestaSupportoAziendaleAPI';
import { sendSupportEmailAzienda } from '@/api/emailAPI.js';

const requests = ref([]);
const loading = ref(false);
const error = ref(null);
const showEmailModal = ref(false);
const showEditModal = ref(false);

const emailModalData = reactive({
  requestId: null,
  to: '',
  subject: '',
  message: '',
});

const editData = reactive({
  _id: null,
  problema: '',
  descrizione: '',
  priority: '',
  status: '',
});

const labels = {
  status: {
    in_attesa: 'In Attesa',
    in_corso: 'In Corso',
    risolto: 'Risolto',
  },
  priority: {
    bassa: 'Bassa',
    media: 'Media',
    alta: 'Alta',
  },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const chipColor = (val, isPriority = false) => {
  const map = isPriority
    ? {
        bassa: 'bg-green-100 text-green-800 px-2 py-1 rounded',
        media: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded',
        alta: 'bg-red-100 text-red-800 px-2 py-1 rounded',
      }
    : {
        in_attesa: 'bg-gray-200 text-gray-700 px-2 py-1 rounded',
        in_corso: 'bg-blue-100 text-blue-800 px-2 py-1 rounded',
        risolto: 'bg-green-100 text-green-800 px-2 py-1 rounded',
      };
  return map[val] || 'px-2 py-1';
};

const fetchRequests = async () => {
  loading.value = true;
  error.value = null;
  try {
    requests.value = await getAllCompanySupportRequests();
  } catch (e) {
    error.value = 'Errore durante il caricamento delle richieste.';
  } finally {
    loading.value = false;
  }
};

const openEmailModal = (req) => {
  emailModalData.requestId = req._id;
  emailModalData.to = req.email;
  emailModalData.subject = `Re: ${req.subject}`;
  emailModalData.message = "";
  error.value = null;
  showEmailModal.value = true;
};

const closeEmailModal = () => {
  showEmailModal.value = false;
  Object.assign(emailModalData, {
    requestId: null,
    to: '',
    subject: '',
    message: '',
  });
};

const sendEmailResponse = async () => {
  try {
    loading.value = true;
    error.value = null;

    await sendSupportEmailAzienda({
      requestId: emailModalData.requestId,
      to: emailModalData.to,
      subject: emailModalData.subject,
      message: emailModalData.message,
    });

    await updateCompanySupportRequest(emailModalData.requestId, {
      status: "in_corso",
    });

    await fetchRequests();
    closeEmailModal();
  } catch (e) {
    error.value = e.message || "Errore durante l'invio della email.";
  } finally {
    loading.value = false;
  }
};

const openEditModal = (req) => {
  Object.assign(editData, {
    _id: req._id,
    problema: req.problema,
    descrizione: req.descrizione,
    priority: req.priority,
    status: req.status,
  });
  showEditModal.value = true;
};

const submitEditRequest = async () => {
  try {
    loading.value = true;
    await updateCompanySupportRequest(editData._id, {
      problema: editData.problema,
      descrizione: editData.descrizione,
      priority: editData.priority,
      status: editData.status,
    });
    showEditModal.value = false;
    await fetchRequests();
  } catch (e) {
    error.value = e.message || "Errore durante la modifica.";
  } finally {
    loading.value = false;
  }
};

const removeItem = async (id) => {
  if (!confirm('Eliminare definitivamente la richiesta?')) return;
  loading.value = true;
  error.value = null;
  try {
    await deleteCompanySupportRequest(id);
    await fetchRequests();
  } catch (e) {
    error.value = e.message || 'Errore durante l\'eliminazione.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRequests);
</script>

<style scoped>
</style>
