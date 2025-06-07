import { mount } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import CompanyLoginView from '@/views/CompanyLoginView.vue';
import * as authApi from '@/api/authApi';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';

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

describe('CompanyLoginView - Login Flow', () => {
  let wrapper;
  let mockCompanyLogin;
  let authStore;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/companyDashboard', name: 'companyDashboard', component: { template: '<div>CompanyDashboard</div>' } },
      { path: '/adminPanel', name: 'adminPanel', component: { template: '<div>AdminPanel</div>' } }
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

  // Test 0 - Login con credenziali corrette
  test('Login con credenziali corrette', async () => {
    mockCompanyLogin.mockResolvedValue({ status: 200 });
    authStore.role = 'company';

    await wrapper.find('[data-testid="login-form"] button').trigger('click');
    await flushPromises(); // aspetta che il router finisca

    expect(mockCompanyLogin).toHaveBeenCalled();
    expect(router.currentRoute.value.fullPath).toBe('/companyDashboard');
  });

  // Test 1 - Login con password errata
  test('Login con password errata', async () => {
    mockCompanyLogin.mockRejectedValue({
      message: 'Password errata',
      status: 401
    });

    await wrapper.find('[data-testid="login-form"] button').trigger('click');

    expect(mockCompanyLogin).toHaveBeenCalled();
    const errorText = wrapper.find('[data-testid="error"]').text();
    expect(errorText).toContain('Errore nel login');
  });

  // Test 2 - Login con email non registrata
  test('Login con email non registrata', async () => {
    mockCompanyLogin.mockRejectedValue({
      message: 'Utente non trovato',
      status: 404
    });

    await wrapper.find('[data-testid="login-form"] button').trigger('click');

    expect(mockCompanyLogin).toHaveBeenCalled();
    const errorText = wrapper.find('[data-testid="error"]').text();
    expect(errorText).toContain('Errore nel login');
  });
});
