import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { getErrorMessage } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'consumer' | 'restaurant_owner';
}

// useLogin hook
export function useLogin() {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

// useRegister hook
export function useRegister() {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

// useLogout hook
export function useLogout() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });
}

// useCurrentUser hook
export function useCurrentUser(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data.user;
    },
    enabled: isAuthenticated,
    ...options,
  });
}
