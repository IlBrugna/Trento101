import { describe, test, expect, vi } from 'vitest';
import { companyLogin } from '@/api/authApi';
import api from '@/services/api';

const testEmail = 'bruteforce@example.com';
const wrongPassword = 'wrongPassword123';

describe('Security – Protezione contro brute force', () => {
  
  test('Dopo >5 tentativi di login errati ricevo rate limit', async () => {
    let lastError = null;

    // Mock API → i primi 5 tentativi restituiscono 401 Unauthorized
    // il 6° tentativo restituisce 429 Too Many Requests (simuliamo il rate limit)
    const mockErrors = [
      { status: 401, message: 'Password errata' },
      { status: 401, message: 'Password errata' },
      { status: 401, message: 'Password errata' },
      { status: 401, message: 'Password errata' },
      { status: 401, message: 'Password errata' },
      { status: 429, message: 'Troppi tentativi, riprova più tardi' }
    ];

    // Mock della funzione POST
    vi.spyOn(api, 'post').mockImplementation(() => {
      const error = mockErrors.shift();
      return Promise.reject({ response: { status: error.status, data: { message: error.message } } });
    });

    // Effettuo i tentativi
    for (let i = 0; i < 6; i++) {
      try {
        console.log(`Tentativo ${i + 1}`);
        await companyLogin({ email: testEmail, password: wrongPassword });
      } catch (err) {
        lastError = {
          status: err.status ?? err.response?.status,
          message: err.message ?? err.response?.data?.message
        };
        console.log(`Errore ${i + 1}:`, lastError.status, lastError.message);
      }
    }

    // Aspettative finali
    expect(lastError).toBeDefined();
    expect(lastError.status).toBe(429); // Deve essere 429 dopo 6 tentativi
    expect(lastError.message.toLowerCase()).toMatch(/rate|limit|troppi|tentativi/);
  });

});
