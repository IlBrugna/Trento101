<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { fetchSpecificCompany, companyUpdate } from '@/api/companyApi';
import CompanyEditForm from '@/components/company/CompanyEditForm.vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const company = ref(null);
const error = ref(null);

onMounted(async () => {
  if (!auth.user?._id) {
    router.push('/login');
    return;
  }

  try {
    const data = await fetchSpecificCompany(auth.user._id);
    company.value = data;
  } catch (err) {
    error.value = 'Errore nel caricamento dei dati';
  }
});

const handleUpdate = async (updatedData) => {
  try {
    const response = await companyUpdate(auth.user._id, updatedData);
    company.value = response.data;
    alert('Dati aggiornati con successo!');
  } catch (err) {
    alert('Errore durante l\'aggiornamento.');
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">Modifica la tua Pagina Aziendale</h1>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="company">
      <CompanyEditForm :company="company" @submit="handleUpdate" />
    </div>
  </div>
</template>
