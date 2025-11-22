import { createAuthStore, AuthState } from '@bharat-low-oil/store';
import { createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { storage } from '../api/client';

export type { AuthState };

export const useAuthStore = createAuthStore(
  apiClient,
  storage,
  createJSONStorage(() => AsyncStorage)
);

