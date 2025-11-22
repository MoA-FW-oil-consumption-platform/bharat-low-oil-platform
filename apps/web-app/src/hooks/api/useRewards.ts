import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Types
interface Rewards {
  userId: string;
  points: number;
  badges: Badge[];
  streak: number;
  level: number;
}

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
}

// useRewards hook
export function useRewards(userId: string, options?: Omit<UseQueryOptions<Rewards>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['rewards', userId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REWARDS.GET(userId));
      return response.data;
    },
    enabled: !!userId,
    ...options,
  });
}

// useBadges hook
export function useBadges(userId: string, options?: Omit<UseQueryOptions<Badge[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REWARDS.BADGES(userId));
      return response.data.badges || response.data;
    },
    enabled: !!userId,
    ...options,
  });
}

// useLeaderboard hook
export function useLeaderboard(
  params?: { scope?: 'national' | 'state' | 'city'; limit?: number },
  options?: Omit<UseQueryOptions<LeaderboardEntry[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REWARDS.LEADERBOARD, { params });
      return response.data.leaderboard || response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}
