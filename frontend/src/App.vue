<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE

</script>

<template>
<h1>Trento101</h1>

</template>

<script>
// Test per vedere se funziona il collegamento frontend-backend
// Ritorna il messagio su testRoute.js (ovvero "API is working") sennò da errore
export default {
  name: 'TestApp',
  mounted() {
    fetch('/api/test')
        .then(res => res.text()) // change from res.json() to res.text()
        .then(data => {
            console.log('Raw response:', data);
        })
        .catch(err => console.error('API call failed:', err));
  }
}
</script>

<style scoped>
</style>