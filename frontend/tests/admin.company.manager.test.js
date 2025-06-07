import { mount, flushPromises } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import companyManagerView from '@/views/adminViews/companyManagerView.vue';
import { useAuthStore } from '@/store/authStore';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import * as companyApi from '@/api/companyApi';

describe('CompanyManagerView - Admin control', () => {
  let wrapper;
  let authStore;
  let router;
  let mockCompanyUpdate;

  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    authStore = useAuthStore();

    authStore.isLoggedIn = false;
    authStore.role = null;

    mockCompanyUpdate = vi.spyOn(companyApi, 'companyUpdate').mockResolvedValue({});

    vi.spyOn(companyApi, 'fetchCompanies').mockResolvedValue([
      { _id: '1', name: 'Inactive Co', email: 'inactive@example.com', isActive: true },
      { _id: '2', name: 'Disabled Co', email: 'disabled@example.com', isActive: false }
    ]);
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
        { path: '/companyManager', name: 'companyManager', meta: { requiresAuth: true, role: 'admin' }, component: companyManagerView }
      ]
    });

    router.beforeEach((to, from, next) => {
      const auth = useAuthStore();
      const requiredRole = to.meta.role;
      
      if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return next('/login');
      }
      if (requiredRole && auth.role !== requiredRole) {
        return next('/');
      }
      next();
    });

    wrapper = mount({
      template: '<router-view></router-view>'
    }, {
      global: {
        plugins: [router, pinia]
      }
    });

    await router.isReady();
  });

  afterEach(() => {
    vi.clearAllMocks();
    authStore.isLoggedIn = false;
    authStore.role = null;
  });

  // Test 0 - Accesso pannello admin con privilegi
  test('Accesso pannello admin con privilegi', async () => {
    authStore.isLoggedIn = true;
    authStore.role = 'admin';
    
    await router.push('/companyManager');
    await flushPromises();

    expect(router.currentRoute.value.fullPath).toBe('/companyManager');
  });

  // Test 1 - Sospensione azienda
  test('Sospensione azienda', async () => {
    authStore.isLoggedIn = true;
    authStore.role = 'admin';
    
    await router.push('/companyManager');
    await flushPromises();

    const buttons = wrapper.findAll('button');
    const disableButton = buttons.find(btn => btn.text() === 'Disattiva');

    expect(disableButton).toBeTruthy();
    await disableButton.trigger('click');
    await flushPromises();

    expect(mockCompanyUpdate).toHaveBeenCalledWith('1', { isActive: false });
  });

  // Test 2 - Attivazione azienda
  test('Attivazione azienda', async () => {
    authStore.isLoggedIn = true;
    authStore.role = 'admin';
    
    await router.push('/companyManager');
    await flushPromises();

    const buttons = wrapper.findAll('button');
    const enableButton = buttons.find(btn => btn.text() === 'Riattiva');

    expect(enableButton).toBeTruthy();
    await enableButton.trigger('click');
    await flushPromises();

    expect(mockCompanyUpdate).toHaveBeenCalledWith('2', { isActive: true });
  });
});
