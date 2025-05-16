import './assets/main.css'
import router from './router' //non serve specificare index.js
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';

const app= createApp(App);
app.use(createPinia())
app.use(router) //aggiungiamo il router all'app
app.mount('#app')