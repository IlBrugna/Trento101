import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import AziendePageView from '@/views/AziendePageView.vue';
import { fetchSpecificCompany } from '@/api/companyApi.js';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';

// Mock API
vi.mock('@/api/companyApi.js');

// Mock authApi
vi.mock('@/api/authApi', () => ({
  checkAuthOnAppLoad: vi.fn().mockResolvedValue({ user: { id: '6841fa843f9fbcee1ab02002', role: 'company' } })
}));

// Mock child components
vi.mock('@/components/company/CompanyInfo.vue', () => {
  return {
    default: {
      name: 'CompanyInfo',
      template: '<div data-testid="company-info">Company Info Component</div>',
      props: ['name', 'description', 'picture']
    }
  };
});

vi.mock('@/components/company/CompanyContacts.vue', () => {
  return {
    default: {
      name: 'CompanyContacts',
      template: '<div data-testid="company-contacts">Company Contacts Component</div>',
      props: ['email', 'phoneNumber', 'address', 'website', 'companyName']
    }
  };
});

describe('Company Information Page Tests', () => {
  let router;
  let mockFetchSpecificCompany;

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/aziende/:companyID',
          name: 'AziendePageView',
          component: AziendePageView
        }
      ]
    });

    mockFetchSpecificCompany = fetchSpecificCompany;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Testa il caso di successo del caricamento della pagina delle informazioni dell'azienda
  test('dovrebbe caricare le informazione delle compagnia con successo se si ha un id valido', async () => {
    const validCompanyId = '6841fa843f9fbcee1ab02002';
    const mockCompanyData = {
      id: validCompanyId,
      name: 'Test Company',
      description: 'Test company description',
      picture: 'test-picture.jpg',
      email: 'test@company.com',
      phoneNumber: '+39 123456789',
      address: 'Via Test 123, Trento',
      website: 'https://testcompany.com',
      isActive: true
    };

    mockFetchSpecificCompany.mockResolvedValueOnce(mockCompanyData);

    await router.push(`/aziende/${validCompanyId}`);

    const wrapper = mount(AziendePageView, {
      global: {
        plugins: [router]
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockFetchSpecificCompany).toHaveBeenCalledWith(validCompanyId);

    const info = wrapper.findComponent({ name: 'CompanyInfo' });
    expect(info.exists()).toBe(true);
    expect(info.props('name')).toBe(mockCompanyData.name);

    const contacts = wrapper.findComponent({ name: 'CompanyContacts' });
    expect(contacts.exists()).toBe(true);
    expect(contacts.props('email')).toBe(mockCompanyData.email);

    expect(wrapper.find('.text-red-500').exists()).toBe(false);
  });

  // Testa il caso di errore quando l'azienda non esiste o non è attiva
  test('dovrebbe dare errore 404 se l azienda non esiste o non attiva', async () => {
    const invalidCompanyId = 'non-existent-id';
    const mockApiError = {
      status: 404,
      message: 'Azienda non trovata'
    };

    mockFetchSpecificCompany.mockRejectedValueOnce(mockApiError);

    await router.push(`/aziende/${invalidCompanyId}`);

    const wrapper = mount(AziendePageView, {
      global: {
        plugins: [router]
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockFetchSpecificCompany).toHaveBeenCalledWith(invalidCompanyId);
    expect(mockFetchSpecificCompany).toHaveBeenCalledTimes(1);

    const errorElement = wrapper.find('.text-red-500');
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toContain('Errore 404');
    expect(errorElement.text()).toContain('Azienda non trovata');

    expect(wrapper.findComponent({ name: 'CompanyInfo' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'CompanyContacts' }).exists()).toBe(false);
  });

  // Testa il caso di errore quando l'azienda esiste ma è inattiva
  test('dovrebbe dare errore 404 se esiste ma è inattiva', async () => {
    const companyId = '456';
    const mockInactiveCompany = {
      id: companyId,
      name: 'Inactive Company',
      description: 'This company is inactive',
      isActive: false
    };

    mockFetchSpecificCompany.mockResolvedValueOnce(mockInactiveCompany);

    await router.push(`/aziende/${companyId}`);

    const wrapper = mount(AziendePageView, {
      global: {
        plugins: [router]
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockFetchSpecificCompany).toHaveBeenCalledWith(companyId);

    const errorElement = wrapper.find('.text-red-500');
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toContain('404 Azienda non trovata');

    expect(wrapper.findComponent({ name: 'CompanyInfo' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'CompanyContacts' }).exists()).toBe(false);
  });

  // Testa il caso di errore del server (500)
  test('should display server error when API returns 500', async () => {
    const companyId = '789';
    const mockServerError = {
      status: 500,
      message: 'Internal Server Error'
    };

    mockFetchSpecificCompany.mockRejectedValueOnce(mockServerError);

    await router.push(`/aziende/${companyId}`);

    const wrapper = mount(AziendePageView, {
      global: {
        plugins: [router]
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockFetchSpecificCompany).toHaveBeenCalledWith(companyId);

    const errorElement = wrapper.find('.text-red-500');
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toContain('Errore 500');
    expect(errorElement.text()).toContain('Internal Server Error');

    expect(wrapper.findComponent({ name: 'CompanyInfo' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'CompanyContacts' }).exists()).toBe(false);
  });
});