import api from '@/services/api';

export async function fetchAllUniversitaServices() {
  const res = await api.get('/api/university-services');
  return res.data;
}
