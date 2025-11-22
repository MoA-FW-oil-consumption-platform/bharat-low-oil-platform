import { createApiClient, StorageInterface, getErrorMessage } from '@bharat-low-oil/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

export const storage: StorageInterface = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  storage,
  onUnauthorized: () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
  getLanguage: () => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem('language') || 'en';
  }
});

export { getErrorMessage };
export default apiClient;

