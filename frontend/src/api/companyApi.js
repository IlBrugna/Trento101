import api from "@/services/api";

export async function fetchSpecificCompany(id) {
  try {
    const response = await api.get(`/company/${id}`);
    return response.data; // Return the company details
  } catch (error) {
    throw {
      status: error.response.status,
      message: error.response.data.message
    };  
  }
}