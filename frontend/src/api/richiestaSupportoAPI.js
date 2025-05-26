import api from "@/services/api";

export async function fetchAllSupportRequests() {
  try {
    const { data } = await api.get("api/v1/richiesteSupporto");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function fetchSupportRequest(id) {
  try {
    const { data } = await api.get(`api/v1/richiesteSupporto/${id}`);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function createSupportRequest(requestData) {
  try {
    const { data } = await api.post("api/v1/richiesteSupporto", requestData);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function updateSupportRequest(id, requestData) {
  try {
    const { data } = await api.put(`api/v1/richiesteSupporto/${id}`, requestData);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function deleteSupportRequest(id) {
  try {
    const { data } = await api.delete(`api/v1/richiesteSupporto/${id}`);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}
