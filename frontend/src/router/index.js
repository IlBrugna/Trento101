import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AziendeView from '@/views/AziendeSearchView.vue';
import CompanyPage from '@/views/AziendePageView.vue';

const router=createRouter({
    history:createWebHistory(import.meta.env.BASE_URL), //PER FAR FUNZIONARE TASTO INDIETRO
    routes:[
        {
            path:'/', //URL
            name:'home', //NOME DELLA ROUTE
            component: HomeView //COMPONENTE CHE DEVE ESSERE CARICATO
        },
        {
            path: '/aziende',
            name: 'aziende',
            component: AziendeView
        },
        {
            path: '/azienda/:id',
            name: 'company-page',
            component: CompanyPage
        }
    ]
})

export default router;