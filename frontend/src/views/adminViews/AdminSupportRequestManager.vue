<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Gestione Richieste di Supporto</h1>

    <!-- Loading spinner -->
    <div v-if="loading" class="mb-4 text-center">
      <span class="inline-block p-2">Caricamento...</span>
    </div>

    <!-- Global error -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
    </div>

    <!-- === Email Response Modal === -->
    <div
      v-if="showEmailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">
          Rispondi alla richiesta: {{ emailModalData.subject }}
        </h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">A:</label>
          <input
            v-model="emailModalData.to"
            class="w-full border p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Oggetto:</label>
          <input
            v-model="emailModalData.emailSubject"
            class="w-full border p-2 rounded"
            placeholder="Re: Richiesta di supporto"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Messaggio:</label>
          <textarea
            v-model="emailModalData.message"
            rows="10"
            class="w-full border p-2 rounded"
            placeholder="Scrivi la tua risposta qui..."
          />
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="closeEmailModal"
            class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            :disabled="loading"
          >
            Annulla
          </button>
          <button
            @click="sendEmailResponse"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            :disabled="loading || !emailModalData.message.trim()"
          >
            <span v-if="loading">Invio...</span>
            <span v-else>Invia Risposta</span>
          </button>
        </div>
      </div>
    </div>

    <!-- === Edit / detail panel === -->
    <div
      v-if="editingId !== null"
      class="bg-white shadow rounded-lg p-6 mb-8 transition-all duration-300"
    >
      <h2 class="text-xl font-semibold mb-4">Modifica Richiesta</h2>

      <div class="grid md:grid-cols-2 gap-4">
        <!-- Oggetto (DISABLED) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Oggetto</label>
          <input
            v-model="formData.subject"
            disabled
            class="w-full border p-2 rounded
                  bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <!-- Email richiedente (DISABLED) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Richiedente</label>
          <input
            v-model="formData.requesterEmail"
            disabled
            class="w-full border p-2 rounded
                  bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <!-- Descrizione (DISABLED) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
          <textarea
            v-model="formData.description"
            rows="4"
            disabled
            class="w-full border p-2 rounded
                  bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <!-- Stato (ENABLED) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stato</label>
          <select
            v-model="formData.status"
            class="w-full border p-2 rounded bg-white"
          >
            <option v-for="s in statusOptions" :key="s" :value="s">
              {{ labels.status[s] }}
            </option>
          </select>
        </div>

        <!-- Priorità (ENABLED) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
          <select
            v-model="formData.priority"
            class="w-full border p-2 rounded bg-white"
          >
            <option v-for="p in priorityOptions" :key="p" :value="p">
              {{ labels.priority[p] }}
            </option>
          </select>
        </div>

        <!-- È azienda? -->
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            v-model="formData.is_company"
            class="h-5 w-5"
            disabled
          />
          <span>Richiesta da azienda</span>
        </div>
      </div>

      <div class="mt-4 flex gap-3">
        <button
          @click="submitForm"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          :disabled="loading"
        >
          <span v-if="loading">Salvataggio...</span>
          <span v-else>Salva Modifiche</span>
        </button>
        <button
          @click="resetForm"
          class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          :disabled="loading"
        >
          Annulla
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-100 text-left text-xs uppercase tracking-wide">
          <tr>
            <th class="px-4 py-2">Tipo</th>
            <th class="px-4 py-2">Oggetto</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Stato</th>
            <th class="px-4 py-2">Priorità</th>
            <th class="px-4 py-2">Creato</th>
            <th class="px-4 py-2 w-40">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="req in requests"
            :key="req._id"
            class="border-t border-gray-200 text-sm"
            :class="req.is_company ? 'bg-blue-50' : ''"
          >
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <span v-if="req.is_company" class="inline-flex items-center">
                  <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 8a1 1 0 011-1h4a1 1 0 011 1v4H7v-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-blue-700 font-medium text-xs">AZIENDA</span>
                </span>
                <span v-else class="inline-flex items-center">
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-600 text-xs">PRIVATO</span>
                </span>
              </div>
            </td>
            <td class="px-4 py-2">{{ req.subject }}</td>
            <td class="px-4 py-2 truncate max-w-[160px]">
              {{ req.requesterEmail }}
            </td>
            <td class="px-4 py-2">
              <span :class="chipColor(req.status)">
                {{ labels.status[req.status] }}
              </span>
            </td>
            <td class="px-4 py-2">
              <span :class="chipColor(req.priority, true)">
                {{ labels.priority[req.priority] }}
              </span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
              {{ formatDate(req.createdAt) }}
            </td>
            <td class="px-4 py-2">
              <div class="flex gap-2 flex-wrap">
                <button
                  @click="editItem(req)"
                  class="text-blue-600 hover:underline text-xs"
                  :disabled="loading"
                >
                  Modifica
                </button>
                <button
                  @click="openEmailModal(req)"
                  class="text-green-600 hover:underline text-xs"
                  :disabled="loading"
                >
                  Rispondi
                </button>
                <button
                  @click="removeItem(req._id)"
                  class="text-red-600 hover:underline text-xs"
                  :disabled="loading"
                >
                  Elimina
                </button>
              </div>
            </td>
          </tr>

          <!-- Se vuoto -->
          <tr v-if="!loading && requests.length === 0">
            <td colspan="7" class="text-center py-6 text-gray-500">
              Nessuna richiesta di supporto presente.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  fetchAllSupportRequests,
  updateSupportRequest,
  deleteSupportRequest,
} from '@/api/richiestaSupportoAPI.js';

import { sendSupportEmail } from '@/api/emailAPI.js';

const requests = ref([]);
const loading = ref(false);
const error = ref(null);
const editingId = ref(null);
const showEmailModal = ref(false);

const statusOptions = ['aperto', 'in_corso', 'risolto', 'chiuso'];
const priorityOptions = ['basso', 'medio', 'alto', 'urgente'];

const labels = {
  status: {
    aperto: 'Aperto',
    in_corso: 'In Corso',
    risolto: 'Risolto',
    chiuso: 'Chiuso',
  },
  priority: {
    basso: 'Basso',
    medio: 'Medio',
    alto: 'Alto',
    urgente: 'Urgente',
  },
};

const formData = reactive({
  subject: '',
  description: '',
  requesterEmail: '',
  status: 'aperto',
  priority: 'medio',
  is_company: false,
});

const emailModalData = reactive({
  requestId: null,
  to: '',
  subject: '',
  emailSubject: '',
  message: '',
});

const chipColor = (val, isPriority = false) => {
  // Colori per lo stato e la priorità
  const map = isPriority
    ? {
        basso: 'bg-green-100 text-green-800 px-2 py-1 rounded',
        medio: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded',
        alto: 'bg-amber-100 text-amber-800 px-2 py-1 rounded',
        urgente: 'bg-red-100 text-red-800 px-2 py-1 rounded',
      }
    : {
        aperto: 'bg-blue-100 text-blue-800 px-2 py-1 rounded',
        in_corso: 'bg-indigo-100 text-indigo-800 px-2 py-1 rounded',
        risolto: 'bg-green-100 text-green-800 px-2 py-1 rounded',
        chiuso: 'bg-gray-200 text-gray-700 px-2 py-1 rounded',
      };
  return map[val] || 'px-2 py-1';
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

// Funzioni per la gestione dell'invio email
const openEmailModal = (req) => {
  showEmailModal.value = true;
  Object.assign(emailModalData, {
    requestId: req._id,
    to: req.requesterEmail,
    subject: req.subject,
    emailSubject: `Re: ${req.subject}`,
    message: '',
  });
};

const closeEmailModal = () => {
  showEmailModal.value = false;
  Object.assign(emailModalData, {
    requestId: null,
    to: '',
    subject: '',
    emailSubject: '',
    message: '',
  });
};

const sendEmailResponse = async () => {
  loading.value = true;
  error.value = null;
  try {
    await sendSupportEmail({
      to: emailModalData.to,
      subject: emailModalData.emailSubject,
      message: emailModalData.message,
      requestId: emailModalData.requestId,
    });

    // Aggiorna lo stato della richiesta a "in_corso"
    await updateSupportRequest(emailModalData.requestId, {
      status: 'in_corso',
    });

    await fetchAndFill();
    closeEmailModal();
    
    // Mostra un messaggio di successo
    alert('Email inviata con successo!');
  } catch (e) {
    console.error(e);
    error.value = e.message || 'Errore durante l\'invio dell\'email.';
  } finally {
    loading.value = false;
  }
};

const fetchAndFill = async () => {
  loading.value = true;
  error.value = null;
  try {
    requests.value = await fetchAllSupportRequests();
  } catch (e) {
    console.error(e);
    error.value =
      e.message || 'Errore durante il caricamento delle richieste.';
  } finally {
    loading.value = false;
  }
};

const editItem = (req) => {
  editingId.value = req._id;
  Object.assign(formData, {
    subject: req.subject,
    description: req.description,
    requesterEmail: req.requesterEmail,
    status: req.status,
    priority: req.priority,
    is_company: req.is_company,
  });
};

const resetForm = () => {
  editingId.value = null;
  Object.assign(formData, {
    subject: '',
    description: '',
    requesterEmail: '',
    status: 'aperto',
    priority: 'medio',
    is_company: false,
  });
};

const submitForm = async () => {
  if (!editingId.value) return;
  loading.value = true;
  error.value = null;
  try {
    await updateSupportRequest(editingId.value, {
      status: formData.status,
      priority: formData.priority,
    });
    await fetchAndFill();
    resetForm();
  } catch (e) {
    console.error(e);
    error.value = e.message || 'Errore durante il salvataggio.';
  } finally {
    loading.value = false;
  }
};

const removeItem = async (id) => {
  if (!confirm('Eliminare definitivamente la richiesta?')) return;
  loading.value = true;
  error.value = null;
  try {
    await deleteSupportRequest(id);
    await fetchAndFill();
  } catch (e) {
    console.error(e);
    error.value = e.message || 'Errore durante l\'eliminazione.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAndFill);
</script>