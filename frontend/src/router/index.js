import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AziendeView from '@/views/AziendeSearchView.vue';
import CompanyPage from '@/views/AziendePageView.vue';
import AdminPanelView from '@/views/AdminPanelView.vue';
import CompanyLoginView from '@/views/CompanyLoginView.vue';
import CompanyRegistration from '@/views/CompanyRegistration.vue';
import { useAuthStore } from '@/store/authStore';
import ComunePageView from '@/views/ComunePageView.vue';
import companyManagerView from '@/views/adminViews/companyManagerView.vue';
import AdminNewsManager from '@/views/adminViews/AdminNewsManager.vue';

const router = createRouter({
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
            path: '/comune',
            name: 'comune',
            component: ComunePageView
        },
        {
            path: '/azienda/:companyID',
            name: 'company-page',
            component: CompanyPage
        },
        {
            path: '/login',
            name: 'login',
            component: CompanyLoginView
        },
        {
            path: '/azienda/registrazione',
            name: 'registrazione',
            component: CompanyRegistration
        },
        {
            path: '/adminPanel',
            name: 'adminPanel',
            meta: { requiresAuth: true, role: 'admin' },
            component: AdminPanelView
        },
        {
            path: '/companyDashboard',
            name: 'companyDashboard',
            meta: { requiresAuth: true, role: 'company' },
            //component: CompanyDash
        },
        {
            path: '/companyManager',
            name: 'companyManager',
            meta: { requiresAuth: true, role: 'admin' },
            component: companyManagerView
        },
        {
            path: '/adminNewsManager',
            name: 'adminNewsManager',
            meta: { requiresAuth: true, role: 'admin' },
            component: AdminNewsManager
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        if (to.hash) {
          return { el: to.hash, behavior: 'smooth' }
        }
        return { top: 0 }
      }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const requiredRole = to.meta.role;
  console.log("current: ",auth.role, "required: ",requiredRole);
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login'); // CASE NOT LOGGED IN BUT LOG IN REQUIRED
  }

  if (requiredRole && auth.role != requiredRole) {
    console.log("wrong role!")
    return next('/'); //CASE NOT RIGHT ROLE
  }

  next();
});

export default router;