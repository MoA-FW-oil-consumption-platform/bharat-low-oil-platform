import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

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

// Analyze food image
export function useAnalyzeFood() {
  return useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);

      const { data } = await apiClient.post(
        API_ENDPOINTS.AI.ANALYZE_FOOD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data;
    },
  });
}

// Get meal suggestions
export function useMealSuggestions(params: {
  userId: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  preferences?: string[];
}) {
  return useQuery({
    queryKey: ['meal-suggestions', params],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.AI.MEAL_SUGGESTIONS, {
        params,
      });
      return data;
    },
    enabled: !!params.userId,
  });
}

// Chat with AI nutritionist
export function useChatAI() {
  return useMutation({
    mutationFn: async ({
      userId,
      message,
      context,
    }: {
      userId: string;
      message: string;
      context?: any;
    }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.AI.CHAT, {
        userId,
        message,
        context,
      });
      return data;
    },
  });
}

// Predict health score
export function useHealthScore(userId: string) {
  return useQuery({
    queryKey: ['health-score', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.AI.HEALTH_SCORE(userId));
      return data;
    },
    enabled: !!userId,
  });
}
