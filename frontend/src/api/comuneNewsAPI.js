// services/comuneNewsAPI.js
import api from "@/services/api";

/**
 * Esegue il fetch di tutte le news
 */
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

/**
 * Esegue il fetch di una news specifica
 */
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

/**
 * Crea una nuova news
 */
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

/**
 * Aggiorna una news esistente
 */
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

/**
 * Cancella una news
 */
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
