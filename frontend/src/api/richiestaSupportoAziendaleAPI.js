import api from "@/services/api";

export async function createCompanySupportRequest(data) {
  try {
    const response = await api.post('api/v1/richieste-supporto-azienda', data);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function getAllCompanySupportRequests() {
  try {
    const response = await api.get('api/v1/richieste-supporto-azienda');
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function getCompanySupportRequestById(id) {
  try {
    const response = await api.get(`api/v1/richieste-supporto-azienda/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function updateCompanySupportRequest(id, data) {
  try {
    const response = await api.put(`api/v1/richieste-supporto-azienda/${id}`, data);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function deleteCompanySupportRequest(id) {
  try {
    const response = await api.delete(`api/v1/richieste-supporto-azienda/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}
