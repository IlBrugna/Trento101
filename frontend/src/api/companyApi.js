import api from "@/services/api";

export async function fetchSpecificCompany(id) {
  try {
    const response = await api.get(`api/v1/companies/${id}`);
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
    const response = await api.post('api/v1/companies',loginData);
    return response; 
  } catch (error) {
    console.log(error.message);
    throw {
      status: error.response.status,
      message: error.response.data.message
    };  
  }
}

export async function fetchCompanies() {
  try {
    const { data } = await api.get("api/v1/companies");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export const checkEmailExists = async (email) => {
  try {
    const response = await api.get(`api/v1/companies?email=${email}`);
    return response.data.exists;
  } catch (error) {
    throw new Error('Error checking email: ' + error.message);
  }
};

export async function companyUpdate(companyID, updateData) {
  try {
    const response = await api.put(`api/v1/companies/${companyID}`, updateData);
    return response;
  } catch (error) {
    console.log(error.message);
    throw {
      status: error.response.status,
      message: error.response.data.message 
    };
  }
}

export async function companyDelete(companyID) {
  try {
    const response = await api.delete(`api/v1/companies/${companyID}`);
    return response;
  } catch (error) {
    console.log(error.message);
    throw {
      status: error.response.status,
      message: error.response.data.message 
    };
  }
}