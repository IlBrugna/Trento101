import api from "@/services/api";

export async function fetchSpecificCompany(id) {
  try {
    const response = await api.get(`/company/${id}`);
    return response.data; // Return the company details
  } catch (error) {
    throw new Error(
      "Errore durante il recupero dei dettagli dell'azienda: " + error.message
    );
  }
}