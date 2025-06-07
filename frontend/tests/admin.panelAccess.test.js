import { mount, flushPromises } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import AdminPanelView from '@/views/AdminPanelView.vue';
import { useAuthStore } from '@/store/authStore';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';

describe('AdminPanelView - Access control', () => {
  let wrapper;
  let authStore;
  let router;

  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    authStore = useAuthStore();
    
    // Resetta lo stato dell'authStore
    authStore.isLoggedIn = false;
    authStore.role = null;

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
        { path: '/adminPanel', name: 'adminPanel', meta: { requiresAuth: true, role: 'admin' }, component: AdminPanelView }
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
    authStore.isLoggedIn = false;
    authStore.role = null;
  });

  // Test 0 - Accesso pannello admin con privilegi
  test('Accesso pannello admin con privilegi', async () => {
    authStore.isLoggedIn = true;
    authStore.role = 'admin';
    
    await router.push('/adminPanel');
    await flushPromises();
    
    expect(router.currentRoute.value.fullPath).toBe('/adminPanel');
  });

  // Test 1 - Accesso pannello admin senza token
  test('Accesso pannello admin senza token', async () => {
    authStore.isLoggedIn = false;
    authStore.role = null;
    
    await router.push('/adminPanel');
    await flushPromises();
    
    expect(router.currentRoute.value.fullPath).toBe('/login');
  });

  // Test 2 - Accesso pannello admin con token ma ruolo sbagliato
  test('Accesso pannello admin con ruolo sbagliato', async () => {
    authStore.isLoggedIn = true;
    authStore.role = 'user';
    
    await router.push('/adminPanel');
    await flushPromises();
    
    expect(router.currentRoute.value.fullPath).toBe('/');
  });
});