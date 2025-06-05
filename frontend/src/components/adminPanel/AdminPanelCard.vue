<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  panel: {
    type: Object,
    required: true
  }
});

// Funzione per navigare al pannello selezionato
const navigateToPanel = (route) => {
  router.push(route);
};

// Funzione per determinare la classe CSS in base alla dimensione del pannello
const sizeToClass = (size) => {
  switch (size) {
    case 'sm': return 'col-span-1 row-span-1';
    case 'md': return 'col-span-1 row-span-2';
    case 'lg': return 'col-span-2 row-span-2';
    default: return 'col-span-1 row-span-1';
  }
};
</script>

<template>
  <div
    :class=" [
      'rounded-lg shadow-md p-6 flex flex-col cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg',
      panel.color,
      sizeToClass(panel.size)
    ]"
    @click="navigateToPanel(panel.route)"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold text-white text-lg">{{ panel.title }}</h2>
    </div>
    <div class="text-white flex-grow">{{ panel.content }}</div>
    <div class="flex justify-end gap-2 mt-4">
      <button
        class="p-2 text-white hover:bg-emerald-800/40 rounded"
        @click.stop
      >
        <span class="i-heroicons-pencil-square w-5 h-5"></span>
      </button>
      <button
        class="p-2 text-white hover:bg-emerald-800/40 rounded"
        @click.stop
      >
        <span class="i-heroicons-trash w-5 h-5"></span>
      </button>
    </div>
  </div>
</template>