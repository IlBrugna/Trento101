// src/services/comuneService.js
import api from "@/services/api";

/**
 * Esegue il fetch di tutti i servizi
 */
export async function fetchAllComuni() {
  try {
    const { data } = await api.get("api/v1/comuneServizi");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Esegue il fetch di un servizio specifico
 */
export async function fetchSpecificComune(id) {
  try {
    const response = await api.get(`api/v1/comuneServizi/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Crea un nuovo servizio
 */
export async function createComune(comuneData) {
  try {
    const response = await api.post('api/v1/comuneServizi', comuneData);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Aggiorna un servizio esistente
 */
export async function updateComune(id, comuneData) {
  try {
    const response = await api.put(`api/v1/comuneServizi/${id}`, comuneData);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Cancella un servizio
 */
export async function deleteComune(id) {
  try {
    const response = await api.delete(`api/v1/comuneServizi/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}