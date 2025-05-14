import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth',() => {
    //STATE
    const isLoggedIn = ref(false);
    const user = ref(null);

    //ACTIONS
    function login(companyData) {
        isLoggedIn.value = true;
        user.value = companyData;
    }

    function logout() {
        isLoggedIn.value = false;
        user.value = null;
    }
    //getters (computed)
 return {
    isLoggedIn,
    user,
    login,
    logout
 }
})