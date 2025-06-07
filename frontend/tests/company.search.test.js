// tests/companySearch.search.test.js
import { mount } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import AziendeSearchView from '@/views/AziendeSearchView.vue'; // adjust path if needed
import { fetchCompanies } from '@/api/companyApi.js';

vi.mock('@/api/companyApi.js');

vi.mock('@/components/companySearch/CompanyCard.vue', () => {
  return {
    default: {
      name: 'CompanyCard',
      props: ['company'],
      template: '<div data-testid="company-card">{{ company.name }}</div>'
    }
  };
});

vi.mock('@/components/companySearch/SearchFilter.vue', () => {
  return {
    default: {
      name: 'SearchFilter',
      props: ['searchQuery', 'filters', 'industryOptions', 'locationOptions'],
      emits: ['update-search', 'update-filters', 'reset'],
      template: '<div data-testid="search-filter">SearchFilter Component</div>'
    }
  };
});

vi.mock('@/components/companySearch/Pagination.vue', () => {
  return {
    default: {
      name: 'Pagination',
      props: ['currentPage', 'totalPages'],
      emits: ['page-change'],
      template: '<div data-testid="pagination">Pagination Component</div>'
    }
  };
});

describe('AziendeSearchView - Ricerca aziende', () => {
  let wrapper;
  let mockFetchCompanies;

  const mockCompanyData = [
    { _id: '1', name: 'TechNova SRL', description: 'Innovative tech company', isActive: true },
    { _id: '2', name: 'GreenEnergy SPA', description: 'Renewable energy', isActive: true },
    { _id: '3', name: 'Foodies Group', description: 'Food products', isActive: true },
    { _id: '4', name: 'Inactive Co', description: 'Should be filtered out', isActive: false }
  ];

  beforeEach(async () => {
    mockFetchCompanies = fetchCompanies;
    mockFetchCompanies.mockResolvedValue([...mockCompanyData]);

    wrapper = mount(AziendeSearchView);

    // Aspetta che il componente sia completamente montato e i dati siano caricati
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Ricerca con keyword esistente
  test('Ricerca con keyword esistente', async () => {
    await wrapper.vm.handleSearchInput('TechNova SRL');

    await wrapper.vm.$nextTick();

    const companyCards = wrapper.findAll('[data-testid="company-card"]');
    expect(companyCards.length).toBeGreaterThan(0);

    const companyNames = companyCards.map(card => card.text());
    expect(companyNames.some(name => name.includes('TechNova SRL'))).toBe(true);
  });

  // Ricerca con keyword non esistente
  test('Ricerca con keyword inesistente', async () => {
    await wrapper.vm.handleSearchInput('aziendaNonEsistente');

    await wrapper.vm.$nextTick();

    const companyCards = wrapper.findAll('[data-testid="company-card"]');
    expect(companyCards.length).toBe(0);

    // Verify "Nessuna azienda trovata" message is shown
    const emptyMessage = wrapper.find('h3');
    expect(emptyMessage.exists()).toBe(true);
    expect(emptyMessage.text()).toContain('Nessuna azienda trovata');
  });
  
  // Ricerca con keyword vuota
  test('Ricerca senza keyword', async () => {
    await wrapper.vm.handleSearchInput('');

    await wrapper.vm.$nextTick();

    const companyCards = wrapper.findAll('[data-testid="company-card"]');

    // Should show all active companies
    const activeCompanies = mockCompanyData.filter(c => c.isActive);
    expect(companyCards.length).toBe(activeCompanies.length);

    const companyNames = companyCards.map(card => card.text());
    activeCompanies.forEach(company => {
      expect(companyNames).toContain(company.name);
    });
  });
});
