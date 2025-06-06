<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  fetchAllUniversitaServices,
  fetchSpecificUniversita,
  createUniversita,
  updateUniversita,
  deleteUniversita
} from '@/api/universitaServicesAPI';

const services = ref([]);
const loading = ref(false);
const error = ref(null);
const editingId = ref(null);
const showIconSelector = ref(false);

// Lista di icone Material Design
const materialIcons = [
  'directions_bus', 'store', 'account_balance', 'laptop', 'home', 'info', 'settings', 'mail', 'phone', 'person', 'work',
  'school', 'map', 'location_on', 'directions', 'access_time',
  'event', 'calendar_today', 'description', 'attachment', 'image',
  'photo', 'videocam', 'music_note', 'volume_up', 'mic', 'security',
  'lock', 'vpn_key', 'notifications', 'chat', 'forum',
  'shopping_cart', 'store', 'category', 'local_offer', 'local_shipping',
  'payment', 'credit_card', 'account_balance', 'account_balance_wallet',
  'favorite', 'thumb_up', 'thumb_down', 'star', 'star_border',
  'groups', 'public', 'language', 'translate', 'check_circle',
  'cancel', 'add', 'remove', 'add_circle', 'remove_circle',
  'edit', 'delete', 'save', 'search', 'visibility', 'visibility_off',
  'refresh', 'sync', 'help', 'help_outline', 'contact_support',
  'warning', 'error', 'error_outline', 'assignment', 'build',
  'receipt', 'rule', 'list', 'menu', 'view_list',
  'dashboard', 'grid_view', 'apps', 'menu_book', 'library_books',
  'travel_explore', 'ballot', 'psychology', 'smartphone', 'laptop',
  'desktop_windows', 'wifi', 'bluetooth', 'healing', 'eco'
];

const formData = reactive({
  title: '',
  description: '',
  icon: '',
  url: '',
  color: '#000000',
  isPrimary: false,
});

const iconSearchTerm = ref('');
const selectedIcon = ref('');

// Filtra le icone in base al termine di ricerca
const filteredIcons = () => {
  if (!iconSearchTerm.value) return materialIcons;
  return materialIcons.filter(icon => 
    icon.toLowerCase().includes(iconSearchTerm.value.toLowerCase())
  );
};

const resetForm = () => {
  editingId.value = null;
  Object.assign(formData, {
    title: '', 
    description: '', 
    icon: '', 
    url: '', 
    color: '#000000', 
    isPrimary: false
  });
  selectedIcon.value = '';
  showIconSelector.value = false;
  iconSearchTerm.value = '';
};

const fetchAndFill = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    services.value = await fetchAllUniversitaServices();
  } catch (e) {
    console.error('Error fetching services:', e);
    error.value = e.message || 'Errore durante il caricamento dei servizi';
  } finally { 
    loading.value = false; 
  }
};

const submitForm = async () => {
  if (!formData.title) {
    error.value = 'Il titolo è obbligatorio';
    return;
  }
  
  formData.icon = selectedIcon.value;
  
  loading.value = true;
  error.value = null;
  
  try {
    if (!editingId.value) {
      await createUniversita({ ...formData });
    } else {
      await updateUniversita(editingId.value, { ...formData });
    }
    await fetchAndFill();
    resetForm();
  } catch (e) {
    console.error('Error submitting form:', e);
    error.value = e.message || 'Errore durante il salvataggio';
  } finally { 
    loading.value = false;
  }
};

const editItem = (svc) => {
  editingId.value = svc._id;
  // Usa Object.assign per copiare i valori
  Object.assign(formData, { 
    title: svc.title || '',
    description: svc.description || '',
    url: svc.url || '',
    color: svc.color || '#000000',
    isPrimary: Boolean(svc.isPrimary)
  });
  
  selectedIcon.value = svc.icon || '';
};

const removeItem = async (id) => {
  if (!confirm('Eliminare questo servizio?')) return;
  
  loading.value = true;
  error.value = null; // Clear previous errors
  
  try {
    await deleteUniversita(id);
    await fetchAndFill();
  } catch (e) {
    console.error('Error removing item:', e);
    error.value = e.message || 'Errore durante l\'eliminazione';
  } finally {
    loading.value = false;
  }
};

const openIconSelector = () => {
  showIconSelector.value = true;
};

const selectIcon = (icon) => {
  selectedIcon.value = icon;
  showIconSelector.value = false;
};

onMounted(fetchAndFill);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Gestione Servizi</h1>

    <!-- Caricamento -->
    <div v-if="loading" class="mb-4 text-center">
      <span class="inline-block p-2">Caricamento...</span>
    </div>

    <!-- Messaggio di errore -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingId ? 'Modifica Servizio' : 'Nuovo Servizio' }}
      </h2>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
          <input 
            v-model="formData.title" 
            placeholder="Titolo" 
            class="w-full border p-2 rounded" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Icona</label>
          <div class="relative">
            <div 
              @click="openIconSelector" 
              class="flex items-center justify-between w-full border p-2 rounded cursor-pointer hover:bg-gray-50"
            >
              <div class="flex items-center gap-2">
                <span v-if="selectedIcon" class="material-icons">{{ selectedIcon }}</span>
                <span v-else class="text-gray-400">Seleziona icona</span>
              </div>
              <span class="material-icons text-gray-400">arrow_drop_down</span>
            </div>
            
            <!-- Dropdown per selezionare l'icona -->
            <div 
              v-if="showIconSelector" 
              class="absolute top-full left-0 right-0 mt-1 p-3 bg-white border rounded-md shadow-lg z-10"
            >
              <div class="mb-2">
                <input 
                  v-model="iconSearchTerm" 
                  type="text" 
                  placeholder="Cerca icona..." 
                  class="w-full border p-2 rounded"
                />
              </div>
              
              <div class="max-h-40 overflow-y-auto grid grid-cols-6 gap-2">
                <button
                  v-for="icon in filteredIcons()"
                  :key="icon"
                  @click="selectIcon(icon)"
                  class="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  :class="{ 'bg-blue-100': selectedIcon === icon }"
                  type="button"
                >
                  <span class="material-icons">{{ icon }}</span>
                  <span class="text-xs mt-1 truncate w-full text-center">{{ icon }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- URL -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input 
            v-model="formData.url" 
            placeholder="URL" 
            class="w-full border p-2 rounded" 
          />
        </div>

        <!-- Descrizione -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
          <textarea 
            v-model="formData.description" 
            rows="3"
            placeholder="Descrizione"
            class="w-full border p-2 rounded" 
          />
        </div>

        <!-- Colore -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Colore</label>
          <div class="flex items-center gap-2">
            <input 
              v-model="formData.color" 
              type="color" 
              class="border p-1 rounded w-16 h-8" 
            />
            <span>{{ formData.color }}</span>
          </div>
        </div>

        <!-- Servizio primario? -->
        <div class="flex items-center">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              v-model="formData.isPrimary" 
              type="checkbox" 
              class="h-5 w-5"
            />
            <span class="text-sm">Servizio Primario</span>
          </label>
        </div>
      </div>

      <div class="mt-4 flex gap-3">
        <button 
          @click="submitForm"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          :disabled="loading"
        >
          <span v-if="loading">Salvataggio...</span>
          <span v-else>{{ editingId ? 'Aggiorna' : 'Crea' }}</span>
        </button>
        
        <button 
          v-if="editingId" 
          @click="resetForm"
          class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          :disabled="loading"
        >
          Annulla
        </button>
      </div>
    </div>

    <div v-if="services.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-100 text-left text-sm uppercase tracking-wider">
          <tr>
            <th class="px-4 py-2">Titolo</th>
            <th class="px-4 py-2">Icona</th>
            <th class="px-4 py-2">Primario</th>
            <th class="px-4 py-2">Colore</th>
            <th class="px-4 py-2 w-32">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="svc in services" :key="svc._id" class="border-t border-gray-200">
            <td class="px-4 py-2">{{ svc.title }}</td>

            <!-- Preview Icona -->
            <td class="px-4 py-2">
              <span v-if="svc.icon" class="material-icons text-2xl">{{ svc.icon }}</span>
              <span v-else class="text-gray-400">-</span>
            </td>

            <!-- Stato primario? -->
            <td class="px-4 py-2">
              <span :class="svc.isPrimary ? 'text-green-600' : 'text-gray-400'">
                {{ svc.isPrimary ? 'Sì' : 'No' }}
              </span>
            </td>

            <!-- Preview Colore -->
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <span 
                  class="inline-block w-6 h-6 rounded-full border border-gray-300" 
                  :style="{ backgroundColor: svc.color }" 
                />
                <span class="text-xs">{{ svc.color }}</span>
              </div>
            </td>

            <td class="px-4 py-2 flex gap-2">
              <button 
                @click="editItem(svc)"
                class="text-blue-600 hover:underline text-sm"
                :disabled="loading"
              >
                Modifica
              </button>
              <button 
                @click="removeItem(svc._id)"
                class="text-red-600 hover:underline text-sm"
                :disabled="loading"
              >
                Elimina
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Se non c'è niente -->
    <div v-else-if="!loading" class="text-center py-8 bg-white shadow rounded-lg">
      <p class="text-gray-500">Nessun servizio presente.</p>
      <p class="text-sm mt-2">Utilizza il form sopra per aggiungere il primo servizio.</p>
    </div>
  </div>
</template>