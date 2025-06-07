import api from '@/services/api';

export function useStats() {
  const base = 'api/v1/stats';
 
  return {
    getOverview:        () => api.get(`${base}/overview`).then(r => r.data),
    getTopPages:        (limit) => api.get(`${base}/top-pages`, { params: { limit } }).then(r => r.data),
    getEventBreakdown:  () => api.get(`${base}/event-breakdown`).then(r => r.data),
    getCompanyStats:    () => api.get(`${base}/companies`).then(r => r.data),
    getServiceStats:    () => api.get(`${base}/services`).then(r => r.data),
    trackComuneServiceClick:  (serviceId, data) => api.post(`/api/v1/serviziComune/${serviceId}/clicks`, data).then(r => r.data),
    trackUniversitaServiceClick: (serviceId, data) => api.post(`/api/v1/serviziUniversita/${serviceId}/clicks`, data).then(r => r.data),
  };
}