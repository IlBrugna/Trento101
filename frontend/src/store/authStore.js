import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth',() => {
    //STATE
    const isLoggedIn = ref(false);
    const user = ref(null);
    const role = ref(null);

    //ACTIONS
    function login(userData) {
        isLoggedIn.value = true;
        role.value = userData.role;
        user.value = userData;
    }

    function logout() {
        isLoggedIn.value = false;
        user.value = null;
        role.value = null;
    }
    //getters (computed)
 return {
    isLoggedIn,
    user,
    role,
    login,
    logout
 }
})