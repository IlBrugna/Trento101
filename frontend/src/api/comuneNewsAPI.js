import api from "@/services/api";

export async function fetchAllNews() {
  try {
    const { data } = await api.get("api/v1/comuneNews");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function fetchSpecificNews(id) {
  try {
    const { data } = await api.get(`api/v1/comuneNews/${id}`);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function createNews(newsData) {
  try {
    const { data } = await api.post("api/v1/comuneNews", newsData);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function updateNews(id, newsData) {
  try {
    const { data } = await api.put(`api/v1/comuneNews/${id}`, newsData);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function deleteNews(id) {
  try {
    const { data } = await api.delete(`api/v1/comuneNews/${id}`);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}
