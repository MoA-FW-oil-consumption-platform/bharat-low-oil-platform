import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { AxiosInstance } from 'axios';
import { User, RegisterData } from '@bharat-low-oil/shared-types';
import { API_ENDPOINTS, TOKEN_KEY, REFRESH_TOKEN_KEY, StorageInterface } from '@bharat-low-oil/api-client';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const createAuthStore = (
  apiClient: AxiosInstance,
  tokenStorage: StorageInterface,
  persistStorage?: PersistStorage<any>
) => {
  return create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
              email,
              password,
            });

            const { token, refreshToken, user } = response.data;

            await tokenStorage.setItem(TOKEN_KEY, token);
            if (refreshToken) {
              await tokenStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            set({
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);

            const { token, refreshToken, user } = response.data;

            await tokenStorage.setItem(TOKEN_KEY, token);
            if (refreshToken) {
              await tokenStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            set({
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            await tokenStorage.removeItem(TOKEN_KEY);
            await tokenStorage.removeItem(REFRESH_TOKEN_KEY);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        setUser: (user: User | null) => {
          set({ user, isAuthenticated: !!user });
        },

        loadUser: async () => {
          const token = await tokenStorage.getItem(TOKEN_KEY);
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          set({ isLoading: true });
          try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
            set({
              user: response.data.user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            console.error('Load user error:', error);
            await tokenStorage.removeItem(TOKEN_KEY);
            await tokenStorage.removeItem(REFRESH_TOKEN_KEY);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        storage: persistStorage,
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  );
};
