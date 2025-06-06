<script setup>
import { ref, nextTick } from 'vue';
import { useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/store/authStore.js';
import { companyLogout } from '@/api/authApi';
import itFlag from '@/assets/flag-it.svg';
import usFlag from '@/assets/flag-us.svg';

const router = useRouter()
const AuthStore = useAuthStore(); // store per gestire l'autenticazione
const isServicesDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false); // stato per il menu mobile
const currentLang = ref(document.documentElement.lang || 'it');

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

const toggleLanguage = () => {
  const lang = currentLang.value === 'it' ? 'en' : 'it';
  translateTo(lang);
  // Aggiorna currentLang dopo il cambio lingua
  nextTick(() => {
    setTimeout(() => {
      currentLang.value = document.documentElement.lang || lang;
    }, 300);
  });
};

const translateTo = (lang) => {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
    document.documentElement.lang = lang; 
  }
};

const resetTranslation = () => {
  // Cancella cookie traduzione google
  deleteCookie('googtrans');
  deleteCookie('googtrans', window.location.hostname);
  deleteCookie('googtrans', '.' + window.location.hostname);

  document.documentElement.lang = 'it';

  location.reload();
};

const deleteCookie = (name, domain) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;${domain ? ` domain=${domain};` : ''}`;
};

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  isServicesDropdownOpen.value = false;
}

function updateLang() {
  currentLang.value = document.documentElement.lang || 'it';
}
window.addEventListener('languagechange', updateLang);
</script>

<template>
  <header class="bg-white shadow border-b border-emerald-100" @click="closeDropdowns">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo and Main Navigation -->
        <div class="flex items-center space-x-8">
          <RouterLink to="/">
            <img
              src="@/assets/logo-square.png"
              alt="Trento101 Logo"
              class="h-12 md:h-16 w-auto"
              style="background:none;"
            />
          </RouterLink>
          <!-- Main Navigation (now left, after logo) -->
          <nav class="hidden md:flex items-center space-x-6">
            <RouterLink to="/" class="text-gray-700 hover:text-emerald-700 transition">Home</RouterLink>
            <RouterLink to="/aziende" class="text-gray-700 hover:text-emerald-700 transition">Aziende</RouterLink>
            
            <!-- Dropdown menu -->
            <div class="relative dropdown-container">
              <button 
                @click.stop="toggleServicesDropdown" 
                class="flex items-center text-gray-700 hover:text-emerald-700 transition"
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
                class="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-emerald-100"
              >
                <RouterLink 
                  to="/serviziUniversita" 
                  class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  @click="isServicesDropdownOpen = false"
                >
                  Servizi Universitari
                </RouterLink>
                <RouterLink 
                  to="/serviziComune" 
                  class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  @click="isServicesDropdownOpen = false"
                >
                  Servizi del Comune
                </RouterLink>
              </div>
            </div>  
            <RouterLink to="/polls" class="text-gray-700 hover:text-emerald-700 transition">Sondaggi</RouterLink>
            <RouterLink to="/contatti" class="text-gray-700 hover:text-emerald-700 transition">Contatti</RouterLink>
          </nav>
        </div>
        <!-- Language Switcher and User/Login Menu (right) -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Language Switcher: mostra bandiera e sigla della lingua attiva -->
          <button
            @click="toggleLanguage"
            class="flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition focus:outline-none"
            title="Cambia lingua"
          >
            <img
              :src="currentLang === 'it' ? itFlag : usFlag"
              :alt="currentLang === 'it' ? 'Italiano' : 'English'"
              class="w-5 h-5"
            />
            <span class="font-medium text-gray-700 text-sm">
              {{ currentLang === 'it' ? 'IT' : 'EN' }}
            </span>
          </button>
          <template v-if="AuthStore.isLoggedIn">
            <RouterLink v-if="AuthStore.role=='admin'" to="/adminPanel" class="flex items-center space-x-2 text-gray-700 hover:text-emerald-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
              <span>Pannello di Controllo</span>
            </RouterLink>
            <RouterLink v-else-if="AuthStore.role=='company'" to="/companyDashboard" class="flex items-center space-x-2 text-gray-700 hover:text-emerald-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
              <span>Dashboard</span>
            </RouterLink>
            <button @click="handleLogout" class="flex items-center space-x-2 text-gray-700 hover:text-emerald-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1" />
              </svg>
              <span>Logout</span>
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="flex items-center space-x-2 text-gray-700 hover:text-emerald-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.355 1.112 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Login</span>
            </RouterLink>
          </template>
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
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-emerald-100">
        <nav class="px-2 pt-2 pb-4 space-y-1">
          <!-- ...existing nav links... -->
          <!-- Sposta il selettore lingua in fondo nel menu mobile, subito prima di login/user -->
          <RouterLink 
            to="/" 
            class="block px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
            @click="closeMobileMenu"
          >
            Home
          </RouterLink>
          <RouterLink 
            to="/aziende" 
            class="block px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
            @click="closeMobileMenu"
          >
            Aziende
          </RouterLink>
          
          <!-- Mobile Services Dropdown -->
          <div>
            <button 
              @click="toggleServicesDropdown" 
              class="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
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
                class="block px-3 py-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                @click="closeMobileMenu"
              >
                Servizi Universitari
              </RouterLink>
              <RouterLink 
                to="/serviziComune" 
                class="block px-3 py-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                @click="closeMobileMenu"
              >
                Servizi del Comune
              </RouterLink>
            </div>
          </div>
          
          <RouterLink 
            to="/polls" 
            class="block px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
            @click="closeMobileMenu"
          >
            Sondaggi
          </RouterLink>
          <RouterLink 
            to="/contatti" 
            class="block px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
            @click="closeMobileMenu"
          >
            Contatti
          </RouterLink>

          <!-- User menu -->
          <div v-if="AuthStore.isLoggedIn" class="border-t border-gray-200 pt-4 mt-4">
            <RouterLink 
              v-if="AuthStore.role=='admin'" 
              to="/adminPanel" 
              class="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
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
              class="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
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
              class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
          <div v-else class="border-t border-gray-200 pt-4 mt-4">
            <RouterLink 
              to="/login" 
              class="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.314 0 6.355 1.112 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Login</span>
            </RouterLink>
          </div>

          <!-- Language Switcher (in fondo nel mobile menu) -->
          <div class="flex items-center mt-4">
            <button
              @click="toggleLanguage"
              class="flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition focus:outline-none"
              title="Cambia lingua"
            >
              <img
                :src="currentLang === 'it' ? itFlag : usFlag"
                :alt="currentLang === 'it' ? 'Italiano' : 'English'"
                class="w-5 h-5"
              />
              <span class="font-medium text-gray-700 text-sm">
                {{ currentLang === 'it' ? 'IT' : 'EN' }}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>