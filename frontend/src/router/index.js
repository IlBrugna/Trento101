import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router=createRouter({
    history:createWebHistory(import.meta.env.BASE_URL), //PER FAR FUNZIONARE TASTO INDIETRO
    routes:[
        {
            path:'/', //URL
            name:'home', //NOME DELLA ROUTE
            component: HomeView //COMPONENTE CHE DEVE ESSERE CARICATO
        }
    ]
})

export default router;