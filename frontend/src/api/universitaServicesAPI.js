import api from '@/services/api';

export async function fetchAllUniversitaServices() {  
  try {
      const { data } = await api.get("api/v1/serviziUniversita");
      return data;
    } catch (error) {
     throw {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      };
    }
}
