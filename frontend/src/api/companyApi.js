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

export async function companyRegistration(loginData) {
  // POST RICHIESTA ALL'ENDPOINT DI LOGIN
  try {
    const response = await api.post('/company',loginData);
    return response; 
  } catch (error) {
    console.log(error.message);
    throw {
      status: error.response.status,
      message: error.response.data.message
    };  
  }
}