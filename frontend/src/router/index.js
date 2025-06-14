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
import AdminServicesManager from '@/views/adminViews/AdminServicesManager.vue';
import CompanyDashboardView from '@/views/CompanyDashboardView.vue';
import UniversitaPageView from '@/views/UniversitaPageView.vue';
import ContactsPageView from '@/views/ContactsPageView.vue';
import adminPollCreateView from '@/views/adminViews/AdminPollCreate.vue';
import AdminSupportRequestManager from '@/views/adminViews/AdminSupportRequestManager.vue';
import AdminStatisticsManager from '@/views/adminViews/AdminStatisticsManager.vue';
import PollsPageView from '@/views/PollsPageView.vue';
import AdminPollManager from '@/views/adminViews/AdminPollManager.vue';
import AdminUniversitaServicesManager from '@/views/adminViews/AdminUniversitaServicesManager.vue';
import AdminLogManager from '@/views/adminViews/AdminLogManager.vue';
import AdminSupportAziendeManager from'@/views/adminViews/AdminCompanySupportRequestManager.vue'
import AziendeSupportPageView from '@/views/CompanySupportRequestPageView.vue'

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
            path: '/serviziComune',
            name: 'serviziComune',
            component: ComunePageView
        },
        {
            path: '/azienda/:companyID',
            name: 'company-page',
            component: CompanyPage
        },
        {
            path: '/contatti',
            name: 'contactsPage',
            component: ContactsPageView
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
        },
        {
            path: '/adminServicesManager',
            name: 'adminServicesManager',
            meta: { requiresAuth: true, role: 'admin' },
            component: AdminServicesManager
        },
        {
            path: '/adminSupportRequestManager',
            name: 'adminSupportRequestManager',
            meta: { requiresAuth: true, role: 'admin' },
            component: AdminSupportRequestManager
        },
        {
            path: '/companyDashboard',
            name: 'companyDashboard',
            meta: { requiresAuth: true, role: 'company' },
            component: CompanyDashboardView
        },
        {
            path: '/serviziUniversita',
            name: 'serviziUniversita',
            component: UniversitaPageView 
        },
        {
            path: '/adminPollCreate',
            name: 'adminPollCreate',
            meta: { requiresAuth: true, role: 'admin' },
            component: adminPollCreateView
        },
        {
            path: '/adminStatisticsManager',
            name: 'adminStatisticsManager',
            meta: { requiresAuth: true, role: 'admin' },
            component: AdminStatisticsManager
        },
        {
            path: '/polls',
            name: 'polls',
            meta: { requiresAuth: false },
            component: PollsPageView
        },
        {
            path: '/adminPollManager',
            name: 'adminPollManager',
            component: AdminPollManager,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {   
            path: '/adminUniversitaServicesManager',
            name: 'adminUniversitaServicesManager',
            component: AdminUniversitaServicesManager,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/adminLogManager',
            name: 'adminLogManager',
            component: AdminLogManager,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/adminCompanySupportRequestManager',
            name: 'AdminCompanySupportRequestManager',
            component: AdminSupportAziendeManager,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/companySupportRequest',
            name: 'CompanySupportRequest',
            component: AziendeSupportPageView,
            meta: { requiresAuth: true, role: 'company' }
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