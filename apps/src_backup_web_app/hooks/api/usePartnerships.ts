import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Get all restaurant partners
export function useRestaurantPartners(params?: {
  city?: string;
  cuisine?: string;
  certified?: boolean;
}) {
  return useQuery({
    queryKey: ['restaurant-partners', params],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.PARTNERSHIPS.RESTAURANTS, {
        params,
      });
      return data;
    },
  });
}

// Get restaurant details
export function useRestaurant(restaurantId: string) {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        API_ENDPOINTS.PARTNERSHIPS.RESTAURANT(restaurantId)
      );
      return data;
    },
    enabled: !!restaurantId,
  });
}

// Get restaurant menu
export function useRestaurantMenu(restaurantId: string) {
  return useQuery({
    queryKey: ['restaurant-menu', restaurantId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        API_ENDPOINTS.PARTNERSHIPS.RESTAURANT_MENU(restaurantId)
      );
      return data;
    },
    enabled: !!restaurantId,
  });
}

// Apply for restaurant partnership
export function useApplyPartnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: {
      restaurantName: string;
      ownerName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      cuisine: string[];
      documents: any;
    }) => {
      const { data } = await apiClient.post(
        API_ENDPOINTS.PARTNERSHIPS.APPLY,
        applicationData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-partners'] });
    },
  });
}

// Get delivery partners
export function useDeliveryPartners(city?: string) {
  return useQuery({
    queryKey: ['delivery-partners', city],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.PARTNERSHIPS.DELIVERY_PARTNERS, {
        params: { city },
      });
      return data;
    },
  });
}

// Track delivery
export function useTrackDelivery(orderId: string) {
  return useQuery({
    queryKey: ['delivery-tracking', orderId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        API_ENDPOINTS.PARTNERSHIPS.TRACK_DELIVERY(orderId)
      );
      return data;
    },
    enabled: !!orderId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
