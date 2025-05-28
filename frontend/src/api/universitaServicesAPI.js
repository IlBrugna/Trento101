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

export async function fetchSpecificUniversita(id) {
  try {
    const response = await api.get(`api/v1/serviziUniversita/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function createUniversita(universitaData) {
  try {
    const response = await api.post('api/v1/serviziUniversita', universitaData);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function updateUniversita(id, universitaData) {
  try {
    const response = await api.put(`api/v1/serviziUniversita/${id}`, universitaData);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function deleteUniversita(id) {
  try {
    const response = await api.delete(`api/v1/serviziUniversita/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}
