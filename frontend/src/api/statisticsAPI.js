import api from '@/services/api';

export function useStats() {
  const base = 'api/v1/stats';
 
  return {
    getOverview:        () => api.get(`${base}/overview`).then(r => r.data),
    getTopPages:        (limit) => api.get(`${base}/top-pages`, { params: { limit } }).then(r => r.data),
    getEventBreakdown:  () => api.get(`${base}/event-breakdown`).then(r => r.data),
    getCompanyStats:    () => api.get(`${base}/companies`).then(r => r.data),
    getServiceStats:    () => api.get(`${base}/services`).then(r => r.data),
    trackServiceClick:  (data) => api.post(`${base}/track-service-click`, data).then(r => r.data),
    trackUniversitaServiceClick: (data) => api.post(`${base}/track-universita-service-click`, data).then(r => r.data),
  };
}