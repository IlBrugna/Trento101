<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { companyLogin } from '@/api/authApi.js';
import { useAuthStore } from '@/store/authStore.js';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await companyLogin({ email: email.value, password: password.value });
    await auth.fetchUser();
    router.push('/');
  } catch (e) {
    error.value = e.message || 'Credenziali non valide';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="flex flex-col items-center">
        <img src="@/assets/logo-mountains.png" alt="Trento101 Logo" class="h-20 mb-4" />
        <h2 class="mt-2 text-center text-3xl font-extrabold text-emerald-900">Accedi al tuo account</h2>
      </div>
      <form class="mt-8 bg-white rounded-lg shadow-lg p-8 space-y-6 border border-emerald-100" @submit.prevent="handleLogin">
        <div v-if="error" class="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-2 text-sm">
          {{ error }}
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 focus:z-10 sm:text-sm"
            autocomplete="email"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 focus:z-10 sm:text-sm"
            autocomplete="current-password"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition"
          >
            <span v-if="loading">Accesso...</span>
            <span v-else>Accedi</span>
          </button>
        </div>
        <div class="flex justify-between items-center text-sm mt-2">
          <router-link to="/register" class="text-emerald-700 hover:underline">Registrati</router-link>
          <router-link to="/forgot-password" class="text-gray-500 hover:underline">Password dimenticata?</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
