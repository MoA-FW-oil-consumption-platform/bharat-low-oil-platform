import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

// Get recipe recommendations
export function useRecipeRecommendations(params?: {
  cuisine?: string;
  maxOilAmount?: number;
  ingredients?: string[];
  limit?: number;
}) {
  return useQuery({
    queryKey: ['recipe-recommendations', params],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.AI.RECOMMENDATIONS, {
        params,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
