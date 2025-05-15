import api from "@/services/api";
import { useAuthStore } from "@/store/authStore.js";

export async function companyLogin(loginData) {
  // POST RICHIESTA ALL'ENDPOINT DI LOGIN
  const auth = useAuthStore();
  try {
    const response = await api.post('/auth',{
        email: loginData.email,
        password: loginData.password
    },{
        withCredentials: true //PER FAR FUNZIONARE I COOKIE
    });
    auth.login(response.data.companyData);
    return response; 

  } catch (error) {
    throw {
      status: error.response.status,
      message: error.response.data.message
    };  
  }
}

export async function companyLogout() {
  // POST RICHIESTA ALL'ENDPOINT DI LOGIN
  const auth = useAuthStore();
  try {
    const response = await api.delete('/auth',{},{
        withCredentials: true //PER FAR FUNZIONARE I COOKIE
    });
    auth.logout();
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
    const res = await api.get('/auth', { withCredentials: true });
    auth.login(res.data.company); // sets isLoggedIn and user
  } catch (err) {
    
    console.log(err);
    auth.logout(); // clear session
  }
};
