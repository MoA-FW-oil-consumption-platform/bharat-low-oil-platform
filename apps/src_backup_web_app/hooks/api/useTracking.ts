import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Types
interface ConsumptionLog {
  _id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  oilAmount: number;
  notes?: string;
  createdAt: string;
}

interface CreateLogData {
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  oilAmount: number;
  notes?: string;
}

interface ConsumptionStats {
  todayConsumption: number;
  weeklyAverage: number;
  monthlyAverage: number;
  dailyLimit: number;
  monthlyTotal: number;
  streak: number;
}

// useConsumptionStats hook
export function useConsumptionStats(userId: string, options?: Omit<UseQueryOptions<ConsumptionStats>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['consumptionStats', userId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.TRACKING.STATS(userId));
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!userId,
    ...options,
  });
}

// useConsumptionLogs hook
export function useConsumptionLogs(
  userId: string,
  params?: { startDate?: string; endDate?: string; page?: number; limit?: number },
  options?: Omit<UseQueryOptions<ConsumptionLog[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['consumptionLogs', userId, params],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.TRACKING.LOG_BY_USER(userId), { params });
      return response.data.logs || response.data;
    },
    enabled: !!userId,
    ...options,
  });
}

// useCreateLog hook
export function useCreateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLogData) => {
      const response = await apiClient.post(API_ENDPOINTS.TRACKING.CREATE_LOG, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['consumptionStats', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['consumptionLogs', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['monthlyUsage', variables.userId] });
    },
  });
}

// useDeleteLog hook
export function useDeleteLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ logId, userId }: { logId: string; userId: string }) => {
      const response = await apiClient.delete(API_ENDPOINTS.TRACKING.DELETE_LOG(logId));
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consumptionStats', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['consumptionLogs', variables.userId] });
    },
  });
}

// useMonthlyUsage hook
export function useMonthlyUsage(userId: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['monthlyUsage', userId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.TRACKING.MONTHLY_USAGE(userId));
      return response.data;
    },
    enabled: !!userId,
    ...options,
  });
}
