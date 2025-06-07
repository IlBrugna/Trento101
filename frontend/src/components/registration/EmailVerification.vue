<script setup>
import { ref, onMounted } from 'vue';
import { sendVerificationEmail, verifyEmailCode } from '@/api/emailVerificationApi.js';

const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['email-verified', 'back-to-email']);

const verificationCode = ref('');
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'
const countdown = ref(0);

// Invia il codice di verifica
const sendCode = async () => {
  isLoading.value = true;
  message.value = '';
  
  try {
    await sendVerificationEmail(props.email);
    message.value = 'Codice di verifica inviato alla tua email';
    messageType.value = 'success';
  } catch (error) {
    message.value = error.message || 'Errore durante l\'invio del codice';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
};

// Verifica il codice inserito
const verifyCode = async () => {
  if (verificationCode.value.length !== 6) {
    message.value = 'Il codice deve essere di 6 cifre';
    messageType.value = 'error';
    return;
  }
  
  isLoading.value = true;
  message.value = '';
  
  try {
    await verifyEmailCode(props.email, verificationCode.value);
    message.value = 'Email verificata con successo!';
    messageType.value = 'success';
    
    // Emetti evento dopo un breve delay per mostrare il messaggio di successo
    setTimeout(() => {
      emit('email-verified');
    }, 1500);
    
  } catch (error) {
    message.value = error.message || 'Codice non valido o scaduto';
    messageType.value = 'error';
    verificationCode.value = '';
  } finally {
    isLoading.value = false;
  }
};

// Formatta l'input per accettare solo numeri
const formatCode = (event) => {
  const value = event.target.value.replace(/\D/g, '');
  verificationCode.value = value.slice(0, 6);
};

// Invia automaticamente il codice quando inizia il componente
onMounted(() => {
   sendCode();
});
</script>

<template>
  <div class="bg-white py-8 px-6 shadow rounded-lg">
    <div class="text-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">
        Verifica la tua email
      </h2>
      <p class="text-sm text-gray-600">
        Abbiamo inviato un codice di verifica a:
      </p>
      <p class="text-sm font-medium text-emerald-700 mt-1">
        {{ email }}
      </p>
    </div>

    <form @submit.prevent="verifyCode">
      <div class="mb-6">
        <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
          Codice di verifica (6 cifre)
        </label>
        <input 
          id="code"
          type="text"
          maxlength="6"
          v-model="verificationCode"
          @input="formatCode"
          placeholder="123456"
          class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 text-center text-xl font-mono tracking-widest"
          :disabled="isLoading"
        />
      </div>

      <div v-if="message" class="mb-4 p-3 rounded-md" :class="{
        'bg-green-50 border border-green-200 text-green-700': messageType === 'success',
        'bg-red-50 border border-red-200 text-red-700': messageType === 'error'
      }">
        <p class="text-sm">{{ message }}</p>
      </div>

      <div class="space-y-4">
        <button 
          type="submit" 
          :disabled="isLoading || verificationCode.length !== 6"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isLoading">Verificando...</span>
          <span v-else>Verifica Codice</span>
        </button>
      </div>
    </form>

    <div class="mt-6 text-xs text-gray-500 text-center">
      <p>Non hai ricevuto l'email? Controlla la cartella spam.</p>
      <p class="mt-1">Il codice scade dopo 10 minuti.</p>
    </div>
  </div>
</template>