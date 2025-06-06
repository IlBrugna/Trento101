import api from "@/services/api";

export async function fetchLogs(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const { data } = await api.get(`api/v1/logs?${queryString}`);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function fetchLogStats() {
  try {
    const { data } = await api.get("api/v1/logs/stats");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}