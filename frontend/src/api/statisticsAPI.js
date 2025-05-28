import api from '@/services/api';

export function useStats() {
  const base = 'api/v1/stats';
  
  return {
    getOverview:        (range) => api.get(`${base}/overview`,        { params: { range } }).then(r => r.data),
    getTopPages:        (limit) => api.get(`${base}/top-pages`,       { params: { limit } }).then(r => r.data),
    getEventBreakdown:  (range) => api.get(`${base}/event-breakdown`, { params: { range } }).then(r => r.data),
  
    getCompanyStats:    () => api.get(`${base}/companies`).then(r => r.data),
    getServiceStats:    (range) => api.get(`${base}/services`, { params: { range } }).then(r => r.data),
    
    trackServiceClick:  (data) => api.post(`${base}/track-service-click`, data).then(r => r.data),
  };
}