import api from "@/services/api";

export async function fetchAllComuni() {
  try {
    const { data } = await api.get("api/v1/serviziComune");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function fetchSpecificComune(id) {
  try {
    const response = await api.get(`api/v1/serviziComune/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function createComune(comuneData) {
  try {
    const response = await api.post('api/v1/serviziComune', comuneData);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function updateComune(id, comuneData) {
  try {
    const response = await api.put(`api/v1/serviziComune/${id}`, comuneData);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function deleteComune(id) {
  try {
    const response = await api.delete(`api/v1/serviziComune/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}