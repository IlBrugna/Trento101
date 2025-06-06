import api from "@/services/api";

// Invia una risposta via e-mail a una richiesta di supporto.
export async function sendSupportEmail({ requestId, to, subject, message }) {
  try {
    const { data } = await api.post(
      `api/v1/richiesteSupporto/${requestId}/reply`,
      { to, subject, message }
    );
    return data;
  } catch (error) {
    throw {
      status:  error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function sendSupportEmailAzienda({ requestId, to, subject, message }) {
  try {
    const { data } = await api.post(
      `api/v1/richieste-supporto-azienda/${requestId}/reply`,
      { to, subject, message }
    );
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}