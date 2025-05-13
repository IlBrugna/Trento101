<script setup>
import LoginForm from '@/components/login/LoginForm.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-start pt-16">
    <div class="max-w-md w-full mx-auto">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Area Aziendale
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Accedi con le tue credenziali aziendali!
        </p>
      </div>
      
      <div class="mt-8">
        <LoginForm />
      </div>
    </div>
  </div>
</template>


