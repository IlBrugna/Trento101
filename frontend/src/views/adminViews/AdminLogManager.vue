<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Log del Sito</h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" v-if="stats">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-sm font-medium text-gray-500">Eventi di oggi</h3>
        <p class="text-2xl font-bold text-blue-600">{{ stats.todayCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-sm font-medium text-gray-500">Azioni Totali</h3>
        <p class="text-2xl font-bold text-green-600">{{ stats.topActions?.length || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-sm font-medium text-gray-500">Status Overview</h3>
        <div class="flex space-x-2 mt-1">
          <span v-for="status in stats.statusBreakdown" :key="status._id" 
                :class="statusColor(status._id)" 
                class="px-2 py-1 rounded text-xs font-medium">
            {{ status._id }}: {{ status.count }}
          </span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <h3 class="text-lg font-medium mb-4">Filtri</h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          v-model="filters.action"
          placeholder="Cerca..."
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          v-model="filters.status"
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tutti gli status</option>
          <option value="success">Successo</option>
          <option value="failed">Fallito</option>
          <option value="error">Errore</option>
        </select>
        <input
          v-model="filters.startDate"
          type="date"
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="filters.endDate"
          type="date"
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="applyFilters"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Applica Filtri
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium">Activity Logs</h3>
        <button 
          @click="refreshLogs"
          class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm transition-colors"
        >
          Aggiorna
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azione</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dettagli</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(log.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="statusColor(log.status)" class="px-2 py-1 text-xs font-medium rounded">
                  {{ log.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ log.userEmail || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                {{ log.ip }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
                <div v-if="log.details" class="truncate">
                  {{ JSON.stringify(log.details) }}
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Caricamento dei log...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && logs.length === 0" class="p-8 text-center text-gray-500">
        <p>Nessun log trovato.</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Pagina {{ pagination.currentPage }} di {{ pagination.totalPages }} ({{ pagination.totalLogs }} totali)
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.currentPage - 1)"
            :disabled="!pagination.hasPrev"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Indietro
          </button>
          <button
            @click="changePage(pagination.currentPage + 1)"
            :disabled="!pagination.hasNext"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Avanti
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'

export default {
  name: 'AdminLogs',
  setup() {
    const logs = ref([])
    const stats = ref(null)
    const pagination = ref(null)
    const loading = ref(false)
    const currentPage = ref(1)
    
    const filters = reactive({
      action: '',
      status: '',
      startDate: '',
      endDate: ''
    })

    const fetchLogs = async (page = 1) => {
      loading.value = true
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '50'
        })
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })

        const response = await fetch(`/api/v1/logs?${params}`)
        const data = await response.json()
        
        logs.value = data.logs
        pagination.value = data.pagination
        currentPage.value = page
      } catch (error) {
        console.error('Error fetching logs:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/logs/stats')
        stats.value = await response.json()
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    const applyFilters = () => {
      currentPage.value = 1
      fetchLogs(1)
    }

    const refreshLogs = () => {
      fetchLogs(currentPage.value)
      fetchStats()
    }

    const changePage = (page) => {
      if (page < 1) return
      fetchLogs(page)
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const statusColor = (status) => {
      switch (status) {
        case 'success':
          return 'bg-green-100 text-green-800'
        case 'failed':
          return 'bg-yellow-100 text-yellow-800'
        case 'error':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    onMounted(() => {
      fetchLogs()
      fetchStats()
    })

    return {
      logs,
      stats,
      pagination,
      loading,
      filters,
      fetchLogs,
      applyFilters,
      refreshLogs,
      changePage,
      formatDate,
      statusColor
    }
  }
}
</script>