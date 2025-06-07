import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import ComunePageView from '@/views/ComunePageView.vue';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';

// Mock child components
vi.mock('@/components/comunePanel/HeroSection.vue', () => {
  return {
    default: {
      name: 'HeroSection',
      template: '<div data-testid="hero-section">Hero Section Component</div>'
    }
  };
});

vi.mock('@/components/comunePanel/ServiceCarousel.vue', () => {
  return {
    default: {
      name: 'ServiceCarousel',
      template: '<div data-testid="service-carousel-empty">Nessun servizio disponibile</div>'
    }
  };
});

vi.mock('@/components/comunePanel/NewsCarousel.vue', () => {
  return {
    default: {
      name: 'NewsCarousel',
      template: '<div data-testid="news-carousel">News Carousel Component</div>'
    }
  };
});

describe('ComunePageView Tests - Servizi non presenti (services not available)', () => {
  let router;

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'ComunePageView',
          component: ComunePageView
        }
      ]
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render ComunePageView without services', async () => {
    await router.push('/');

    const wrapper = mount(ComunePageView, {
      global: {
        plugins: [router]
      }
    });

    await wrapper.vm.$nextTick();

    // Sezione Eroe
    expect(wrapper.find('[data-testid="hero-section"]').exists()).toBe(true);

    // Adesso verifichiamo che i servizi non siano presenti
    const serviceElements = wrapper.findAll('[data-testid="service-carousel-empty"]');
    expect(serviceElements.length).toBe(2); // Primario + secondario

    serviceElements.forEach(service => {
      expect(service.text()).toContain('Nessun servizio disponibile');
    });

    expect(wrapper.find('[data-testid="news-carousel"]').exists()).toBe(true);
  });
});
