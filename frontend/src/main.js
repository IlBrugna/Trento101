import './assets/main.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import { checkAuthOnAppLoad } from './api/authApi';

const app= createApp(App);
app.use(createPinia())

async function startApp() {
  await checkAuthOnAppLoad();
  app.use(router);
  app.mount('#app');
}

startApp();