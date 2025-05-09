<script setup>
import { ref } from 'vue'; //REF è WRAPPER PER VARIBILI, LE RENDE REATTIVE

const name = ref('Trento101');
const developersCount = ref(3);
const biblioteche = ref(['centrale','mesiano','povo']);
const status = ref('attivo');
const link = ref('https://www.youtube.com');
const nuovaBiblioteca = ref('');

const changeStatus = () => {
  if (status.value === 'attivo') {
    status.value = 'non attivo';
  } else {
    status.value = 'attivo';
  }
}

const inviaForm = () => {
  if (nuovaBiblioteca.value !== '') {
    biblioteche.value.push(nuovaBiblioteca.value);
    nuovaBiblioteca.value = '';
  }
}
</script>

<template>
<h1>Trento101</h1>
<p>Il numero di sviluppatori è: {{ developersCount }}</p>
<p>Lo status è: {{ status }}</p>
<p v-if="status === 'attivo'" > if attivo </p>
<p v-else> if NON attivo</p>
<form @submit.prevent="inviaForm">  <!-- .prevent serve per prevenire default?  -->
  <label for="biblio">Aggiungi Biblioteca</label>
  <input type="text" id="biblio" v-model="nuovaBiblioteca" /> <!-- vmodel per "attaccare" valore alla variabile  -->
  <button type="submit">Aggiungi</button>
</form>
<h3> Biblioteche</h3>
<ul>
  <li v-for="biblioteca in biblioteche" :key="biblioteca">
    {{ biblioteca }}
  </li>
</ul>
<button @click="changeStatus">CLICCA PER CAMBIARE STATUS</button>
<a :href="link">sono un link</a>
</template>

<style scoped>
 h1 {
  color: red; 
 }
</style>