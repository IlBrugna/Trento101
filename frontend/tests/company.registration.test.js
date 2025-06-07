import { mount } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import CompanyRegistration from '@/views/CompanyRegistration.vue';
import * as companyApi from '@/api/companyApi';
import { createRouter, createWebHistory } from 'vue-router';

vi.mock('@/components/registration/InitialRegistration.vue', () => {
  return {
    default: {
      name: 'InitialRegistration',
      emits: ['next-step'],
      props: ['isLoading'],
      template: '<div data-testid="initial-registration"><button @click="$emit(\'next-step\', testData)">Next Step</button></div>',
      data() {
        return {
          testData: { email: '', password: '' }
        };
      }
    }
  };
});

vi.mock('@/components/registration/EmailVerification.vue', () => {
  return {
    default: {
      name: 'EmailVerification',
      emits: ['email-verified'],
      props: ['email'],
      template: '<div data-testid="email-verification"><button @click="$emit(\'email-verified\')">Verify Email</button></div>'
    }
  };
});

vi.mock('@/components/registration/CompanyDetails.vue', () => {
  return {
    default: {
      name: 'CompanyDetails',
      emits: ['submit-registration'],
      props: ['isLoading'],
      template: '<div data-testid="company-details"><button @click="$emit(\'submit-registration\', testData)">Submit Registration</button></div>',
      data() {
        return {
          testData: { name: 'Test Company', sector: 'Informatica' }
        };
      }
    }
  };
});

describe('CompanyRegistration - Flow tests', () => {
  let wrapper;
  let mockCheckEmailExists;
  let mockCompanyRegistration;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
    ]
  });

  beforeEach(async () => {
    mockCheckEmailExists = vi.spyOn(companyApi, 'checkEmailExists');
    mockCompanyRegistration = vi.spyOn(companyApi, 'companyRegistration');

    wrapper = mount(CompanyRegistration, {
      global: {
        plugins: [router]
      }
    });

    await router.isReady();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 0 - Registrazione con dati validi
  test('Registrazione con dati validi', async () => {
    mockCheckEmailExists.mockResolvedValue(false); // email non presente

    await wrapper.find('[data-testid="initial-registration"] button').trigger('click');

    expect(wrapper.vm.currentStep).toBe(2);
    expect(wrapper.vm.error).toBe('');

    // Simula email verificata
    await wrapper.find('[data-testid="email-verification"] button').trigger('click');

    expect(wrapper.vm.currentStep).toBe(3);

    // Fai la registrazione dell'azienda
    mockCompanyRegistration.mockResolvedValue();

    window.alert = vi.fn();

    await wrapper.find('[data-testid="company-details"] button').trigger('click');

    expect(mockCompanyRegistration).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registrazione completata'));
  });

  // Test 1 - Registrazione con email non valida
  test('Registrazione con email non valida', async () => {
    // simulate invalid email format
    mockCheckEmailExists.mockRejectedValue(new Error('Email non valida'));

    await wrapper.find('[data-testid="initial-registration"] button').trigger('click');

    expect(wrapper.vm.currentStep).toBe(1);
    expect(wrapper.vm.error).toContain('Email non valida');
  });

  // Test 2 - Registrazione con email già esistente
  test('Registrazione con email già esistente', async () => {
    mockCheckEmailExists.mockResolvedValue(true); // already exists

    await wrapper.find('[data-testid="initial-registration"] button').trigger('click');

    expect(wrapper.vm.currentStep).toBe(1);
    expect(wrapper.vm.error).toContain('già registrata');
  });

  // Test 3 - Registrazione senza campo email
  test('Registrazione senza campo email', async () => {
    // Simulate no email
    wrapper.vm.$refs = {
      initialForm: {
        testData: { email: '', password: 'Password123' }
      }
    };

    mockCheckEmailExists.mockRejectedValue(new Error('Email non valida'));

    await wrapper.find('[data-testid="initial-registration"] button').trigger('click');

    expect(wrapper.vm.currentStep).toBe(1);
    expect(wrapper.vm.error).toContain('Email non valida');
  });

  // Test 4 - Registrazione senza password
  test('Registrazione senza password', async () => {
    wrapper.vm.$refs = {
      initialForm: {
        testData: { email: 'test@example.com', password: '' }
      }
    };

    mockCheckEmailExists.mockResolvedValue(false);

    await wrapper.find('[data-testid="initial-registration"] button').trigger('click');

    // Il componente dovrebbe passare al passo successivo
    expect(wrapper.vm.currentStep).toBe(2);

    mockCompanyRegistration.mockRejectedValue(new Error('Password mancante'));

    await wrapper.find('[data-testid="email-verification"] button').trigger('click');
    await wrapper.find('[data-testid="company-details"] button').trigger('click');

    expect(wrapper.vm.error).toContain('Password mancante');
  });
});