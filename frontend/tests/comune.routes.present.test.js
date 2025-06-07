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
      props: ['secondary'],
      template: '<div data-testid="service-carousel">{{ secondary ? "Secondary Services" : "Primary Services" }}</div>'
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

describe('ComunePageView Tests - Visualizzazione elenco servizi (services available)', () => {
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

  test('should render ComunePageView with services', async () => {
    await router.push('/');

    const wrapper = mount(ComunePageView, {
      global: {
        plugins: [router]
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="hero-section"]').exists()).toBe(true);

    // Primary ServiceCarousel
    const primaryServiceCarousel = wrapper.findAllComponents({ name: 'ServiceCarousel' }).at(0);
    expect(primaryServiceCarousel.exists()).toBe(true);
    expect(primaryServiceCarousel.text()).toContain('Primary Services');

    // Secondary ServiceCarousel
    const secondaryServiceCarousel = wrapper.findAllComponents({ name: 'ServiceCarousel' }).at(1);
    expect(secondaryServiceCarousel.exists()).toBe(true);
    expect(secondaryServiceCarousel.text()).toContain('Secondary Services');

    expect(wrapper.find('[data-testid="news-carousel"]').exists()).toBe(true);
  });
});