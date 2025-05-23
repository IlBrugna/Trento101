import api from "@/services/api";

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