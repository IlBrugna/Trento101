<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/store/authStore.js';
import { companyLogout } from '@/api/authApi';

const router = useRouter()
const AuthStore = useAuthStore(); // store per gestire l'autenticazione
const isServicesDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false); // stato per il menu mobile

async function handleLogout() {
  await companyLogout()
  router.push('/')
}

function toggleServicesDropdown() {
  isServicesDropdownOpen.value = !isServicesDropdownOpen.value;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeDropdowns(event) {
  if (!event.target.closest('.dropdown-container')) {
    isServicesDropdownOpen.value = false;
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  isServicesDropdownOpen.value = false;
}
</script>

<template>
  <header class="bg-white shadow" @click="closeDropdowns">
    <div class="container mx-auto px-4">
      <!-- Desktop e Mobile Header -->
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/">
            <img
              src="@/assets/logo-square.png"
              alt="Logo"
              class="h-10 md:h-14 w-auto"
              style="background:none;"
            />
          </RouterLink>
        </div>

        <!-- Desktop Navigation (nascosto su mobile) -->
        <nav class="hidden md:flex items-center space-x-6">
          <RouterLink to="/" class="text-gray-700 hover:text-blue-600">Home</RouterLink>
          <RouterLink to="/aziende" class="text-gray-700 hover:text-blue-600">Aziende</RouterLink>
          
          <!-- Dropdown menu -->
          <div class="relative dropdown-container">
            <button 
              @click.stop="toggleServicesDropdown" 
              class="flex items-center text-gray-700 hover:text-blue-600"
            >
              Servizi
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 ml-1 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                :class="{'rotate-180': isServicesDropdownOpen}"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              v-if="isServicesDropdownOpen" 
              class="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
            >
              <RouterLink 
                to="/serviziUniversita" 
                class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                @click="isServicesDropdownOpen = false"
              >
                Servizi Universitari
              </RouterLink>
              <RouterLink 
                to="/serviziComune" 
                class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                @click="isServicesDropdownOpen = false"
              >
                Servizi del Comune
              </RouterLink>
            </div>
          </div>
          
          <RouterLink to="/polls" class="text-gray-700 hover:text-blue-600">Sondaggi</RouterLink>
          <RouterLink to="/contatti" class="text-gray-700 hover:text-blue-600">Contatti</RouterLink>
        </nav>

        <!-- Desktop User Menu (nascosto su mobile) -->
        <div v-if="AuthStore.isLoggedIn" class="hidden md:flex items-center space-x-4">
          <RouterLink v-if="AuthStore.role=='admin'" to="/adminPanel" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
            <span>Pannello di Controllo</span>
          </RouterLink>
          <RouterLink v-else-if="AuthStore.role=='company'" to="/companyDashboard" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
            <span>Dashboard</span>
          </RouterLink>
          <button @click="handleLogout" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        <!-- Desktop Login (nascosto su mobile) -->
        <div v-else class="hidden md:block">
          <RouterLink to="/login" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.355 1.112 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Login</span>
          </RouterLink>
        </div>

        <!-- Mobile menu button (visibile solo su mobile) -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden flex items-center p-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              v-if="!isMobileMenuOpen"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu (visibile solo quando aperto) -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200">
        <nav class="px-2 pt-2 pb-4 space-y-1">
          <RouterLink 
            to="/" 
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            @click="closeMobileMenu"
          >
            Home
          </RouterLink>
          <RouterLink 
            to="/aziende" 
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            @click="closeMobileMenu"
          >
            Aziende
          </RouterLink>
          
          <!-- Mobile Services Dropdown -->
          <div>
            <button 
              @click="toggleServicesDropdown" 
              class="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              <span>Servizi</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                :class="{'rotate-180': isServicesDropdownOpen}"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="isServicesDropdownOpen" class="ml-4 mt-1 space-y-1">
              <RouterLink 
                to="/serviziUniversita" 
                class="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                @click="closeMobileMenu"
              >
                Servizi Universitari
              </RouterLink>
              <RouterLink 
                to="/serviziComune" 
                class="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                @click="closeMobileMenu"
              >
                Servizi del Comune
              </RouterLink>
            </div>
          </div>
          
          <RouterLink 
            to="/polls" 
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            @click="closeMobileMenu"
          >
            Sondaggi
          </RouterLink>
          <RouterLink 
            to="/contatti" 
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            @click="closeMobileMenu"
          >
            Contatti
          </RouterLink>

          <!-- Mobile User Menu -->
          <div v-if="AuthStore.isLoggedIn" class="border-t border-gray-200 pt-4 mt-4">
            <RouterLink 
              v-if="AuthStore.role=='admin'" 
              to="/adminPanel" 
              class="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
              <span>Pannello di Controllo</span>
            </RouterLink>
            <RouterLink 
              v-else-if="AuthStore.role=='company'" 
              to="/companyDashboard" 
              class="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
              <span>Dashboard</span>
            </RouterLink>
            <button 
              @click="handleLogout" 
              class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          <!-- Mobile Login -->
          <div v-else class="border-t border-gray-200 pt-4 mt-4">
            <RouterLink 
              to="/login" 
              class="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.355 1.112 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Login</span>
            </RouterLink>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>