<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Richiesta di Supporto Aziendale
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Se la tua azienda ha bisogno di assistenza tecnica su Trento101, compila il modulo sottostante e ti ricontatteremo il prima possibile.
        </p>
      </div>
      <CompanySupportRequestForm />
    </div>
  </div>
</template>

<script setup>
import CompanySupportRequestForm from '@/views/CompanySupportRequestForm.vue';
</script>
