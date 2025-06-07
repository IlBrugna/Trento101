import { mount, flushPromises } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import CompanyLoginView from '@/views/CompanyLoginView.vue';
import * as authApi from '@/api/authApi';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/components/login/LoginForm.vue', () => {
  return {
    default: {
      name: 'LoginForm',
      emits: ['submit'],
      props: ['errorMessage'],
      template: `
        <div data-testid="login-form">
          <button @click="$emit('submit', testData)">Submit Login</button>
          <div data-testid="error">{{ errorMessage }}</div>
        </div>`,
      data() {
        return {
          testData: { email: '', password: '' }
        };
      }
    }
  };
});

describe('CompanyLoginView - Admin Login Flow', () => {
  let wrapper;
  let mockCompanyLogin;
  let authStore;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/adminPanel', name: 'adminPanel', meta: { requiresAuth: true, role: 'admin' }, component: { template: '<div>AdminPanel</div>' } },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
    ]
  });

  beforeEach(async () => {
    mockCompanyLogin = vi.spyOn(authApi, 'companyLogin');

    const pinia = createPinia();
    setActivePinia(pinia);

    authStore = useAuthStore();

    wrapper = mount(CompanyLoginView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await router.isReady();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 0 - Login admin credenziali corrette
  test('Login admin credenziali corrette', async () => {
    mockCompanyLogin.mockResolvedValue({ status: 200 });
    authStore.role = 'admin';

    await wrapper.find('[data-testid="login-form"] button').trigger('click');
    await flushPromises();

    expect(mockCompanyLogin).toHaveBeenCalled();
    expect(router.currentRoute.value.fullPath).toBe('/adminPanel');
  });

  // Test 1 - Login admin password errata
  test('Login admin password errata', async () => {
    mockCompanyLogin.mockRejectedValue({
      message: 'Password errata',
      status: 401
    });

    await wrapper.find('[data-testid="login-form"] button').trigger('click');
    await flushPromises();

    expect(mockCompanyLogin).toHaveBeenCalled();
    const errorText = wrapper.find('[data-testid="error"]').text();
    expect(errorText).toContain('Errore nel login');
  });

  // Test 2 - Login admin email non trovata
  test('Login admin email non trovata', async () => {
    mockCompanyLogin.mockRejectedValue({
      message: 'Utente non trovato',
      status: 404
    });

    await wrapper.find('[data-testid="login-form"] button').trigger('click');
    await flushPromises();

    expect(mockCompanyLogin).toHaveBeenCalled();
    const errorText = wrapper.find('[data-testid="error"]').text();
    expect(errorText).toContain('Errore nel login');
  });

  // Test 3 - Accesso pannello admin con token valido
  test('Accesso pannello admin con token valido', async () => {
    authStore.isLoggedIn = true;
    authStore.role = 'admin';

    await router.push('/adminPanel');
    await flushPromises();

    expect(router.currentRoute.value.fullPath).toBe('/adminPanel');
  });
});
