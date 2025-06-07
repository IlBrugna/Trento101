<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: '/placeholder-logo.png'
  }
});
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- FOTO AZIENDA -->
    <div class="relative w-full aspect-[17/8] bg-gray-200">
      <img 
        :src="props.picture || '/placeholder-logo.png'"
        :alt="name" 
        class="w-full h-full object-cover"
        @error="$event.target.src='/placeholder-logo.png'"
      />
    </div>
    <!-- INFORMAZIONI AZIENDA -->
    <div class="p-6">
      <h1 class="text-2xl font-bold text-emerald-900 mb-4">{{ name }}</h1>
      
      <div class="mb-6">
        <h2 class="text-lg font-medium text-emerald-800 mb-2">Descrizione</h2>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </div>
  </div>
</template>