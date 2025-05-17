// services/comuneNewsAPI.js
import api from "@/services/api";

/**
 * Esegue il fetch di tutte le news
 */
export async function fetchAllNews() {
  try {
    const { data } = await api.get("/news");
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
    const { data } = await api.get(`/news/${id}`);
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
    const { data } = await api.post("/news", newsData);
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
    const { data } = await api.put(`/news/${id}`, newsData);
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
    const { data } = await api.delete(`/news/${id}`);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}
