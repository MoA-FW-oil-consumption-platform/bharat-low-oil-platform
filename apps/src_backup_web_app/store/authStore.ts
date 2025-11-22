import { createAuthStore, AuthState } from '@bharat-low-oil/store';
import { createJSONStorage } from 'zustand/middleware';
import apiClient, { storage } from '../lib/api/client';

export type { AuthState };

export const useAuthStore = createAuthStore(
  apiClient,
  storage,
  createJSONStorage(() => localStorage)
);

