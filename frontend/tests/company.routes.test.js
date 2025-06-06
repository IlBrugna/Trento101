import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import AziendePageView from '@/views/AziendePageView.vue';
import { fetchSpecificCompany } from '@/api/companyApi.js';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';

// Mock the API
vi.mock('@/api/companyApi.js');

// Mock public authApi
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

  test('should load company information page successfully with valid company ID', async () => {
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

  test('should display 404 error when accessing non-existent company page', async () => {
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

  test('should display 404 error when company exists but is inactive', async () => {
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