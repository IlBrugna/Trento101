import api from "@/services/api";

export async function companyLogin(loginData) {
  // POST RICHIESTA ALL'ENDPOINT DI LOGIN
  try {
    const response = await api.post('/auth/login',{
        email: loginData.email,
        password: loginData.password
    },{
        withCredentials: true //PER FAR FUNZIONARE I COOKIE
    });
    return response; 

  } catch (error) {
    throw {
      status: error.response.status,
      message: error.response.data.message
    };  
  }
}