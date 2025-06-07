import { mount } from '@vue/test-utils';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import AziendeSearchView from '@/views/AziendeSearchView.vue';
import { fetchCompanies } from '@/api/companyApi';

vi.mock('@/api/companyApi.js');

vi.mock('@/components/companySearch/CompanyCard.vue', () => {
  return {
    default: {
      name: 'CompanyCard',
      props: ['company'],
      template: '<div data-testid="company-card">{{ company.name }} - {{ company.sector }}</div>'
    }
  };
});

vi.mock('@/components/companySearch/SearchFilter.vue', () => {
  return {
    default: {
      name: 'SearchFilter',
      props: ['searchQuery', 'filters', 'sectorOptions'],
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

describe('AziendeSearchView - Filtri per categoria', () => {
  let wrapper;
  let mockFetchCompanies;

  const mockCompanyData = [
    { _id: '1', name: 'TechNova SRL', sector: 'Informatica', isActive: true },
    { _id: '2', name: 'GreenEnergy SPA', sector: 'Energia', isActive: true },
    { _id: '3', name: 'Foodies Group', sector: 'Commercio', isActive: true },
    { _id: '4', name: 'Inactive Co', sector: 'Informatica', isActive: false }
  ];

  beforeEach(async () => {
    mockFetchCompanies = fetchCompanies;
    mockFetchCompanies.mockResolvedValue([...mockCompanyData]);

    wrapper = mount(AziendeSearchView);

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Filtro per categoria esistente
  test('Filtro per categoria esistente', async () => {
    await wrapper.vm.handleFilterChange({ sector: 'Informatica' });
    await wrapper.vm.$nextTick();

    const companyCards = wrapper.findAll('[data-testid="company-card"]');
    expect(companyCards.length).toBe(1);

    const companyNames = companyCards.map(card => card.text());
    expect(companyNames[0]).toContain('TechNova SRL');
  });

  // Filtro per categoria inesistente
  test('Filtro per categoria inesistente', async () => {
    await wrapper.vm.handleFilterChange({ sector: 'Sanità' });
    await wrapper.vm.$nextTick();

    const companyCards = wrapper.findAll('[data-testid="company-card"]');
    expect(companyCards.length).toBe(0);

    const emptyMessage = wrapper.find('h3');
    expect(emptyMessage.exists()).toBe(true);
    expect(emptyMessage.text()).toContain('Nessuna azienda trovata');
  });

  // Filtro per più categorie
  test('Filtro per più categorie (nessun filtro settore)', async () => {
    await wrapper.vm.handleFilterChange({ sector: '' }); // No filtro
    await wrapper.vm.$nextTick();

    const activeCompanies = mockCompanyData.filter(c => c.isActive);
    const companyCards = wrapper.findAll('[data-testid="company-card"]');
    expect(companyCards.length).toBe(activeCompanies.length);

    const companyNames = companyCards.map(card => card.text());
    activeCompanies.forEach(company => {
      expect(companyNames.some(name => name.includes(company.name))).toBe(true);
    });
  });
});
