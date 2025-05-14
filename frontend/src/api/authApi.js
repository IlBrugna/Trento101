import api from "@/services/api";
import { useAuthStore } from "@/store/authStore.js";

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

export async function checkAuthOnAppLoad(){
    const auth = useAuthStore();
  try {
    const res = await api.get('/auth/check', { withCredentials: true });
    auth.login(res.data.company); // sets isLoggedIn and user
  } catch (err) {
    console.log(err);
    //auth.logout(); // clear session
  }
};