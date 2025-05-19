import './assets/main.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import { checkAuthOnAppLoad } from './api/authApi';

const app= createApp(App);
app.use(createPinia())

await checkAuthOnAppLoad();

app.use(router) //aggiungiamo il router all'app
app.mount('#app')