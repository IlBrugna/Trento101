<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
  </div>
</template>