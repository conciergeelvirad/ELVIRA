/**
 * Restaurant Query Hooks
 *
 * React Query hooks for restaurant and dine-in order data management.
 * Provides hooks for fetching, creating, updating, and deleting restaurants,
 * as well as fetching menu items and dine-in orders.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  Restaurant,
  MenuItem,
  DineInOrderWithDetails,
  RestaurantCreateData,
  RestaurantUpdateData,
  RestaurantDeletionData,
} from "./restaurant.types";
import {
  restaurantKeys,
  DINE_IN_ORDER_SELECT_QUERY,
} from "./restaurant.constants";

// ============================================================================
// Restaurant Query Hooks
// ============================================================================

/**
 * Fetches all restaurants for a specific hotel
 *
 * @param hotelId - ID of the hotel to fetch restaurants for
 * @returns Query result with restaurants array
 */
export const useRestaurants = (hotelId: string) => {
  return useQuery({
    queryKey: restaurantKeys.list({ hotelId }),
    queryFn: async (): Promise<Restaurant[]> => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
  });
};

/**
 * Fetches a single restaurant by ID
 *
 * @param restaurantId - ID of the restaurant to fetch
 * @returns Query result with single restaurant
 */
export const useRestaurantById = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: restaurantKeys.detail(restaurantId || ""),
    queryFn: async (): Promise<Restaurant> => {
      if (!restaurantId) {
        throw new Error("Restaurant ID is required");
      }

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!restaurantId,
  });
};

// ============================================================================
// Restaurant Mutation Hooks
// ============================================================================

/**
 * Creates a new restaurant
 *
 * @returns Mutation result for creating restaurant
 */
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, hotelId }: RestaurantCreateData) => {
      const { error } = await supabase
        .from("restaurants")
        .insert({ ...data, hotel_id: hotelId });

      if (error) throw error;
    },
    onSuccess: (_, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.list({ hotelId }),
      });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
    },
  });
};

/**
 * Updates an existing restaurant
 *
 * @returns Mutation result for updating restaurant
 */
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: RestaurantUpdateData) => {
      const { error } = await supabase
        .from("restaurants")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { id, hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.list({ hotelId }),
      });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
    },
  });
};

/**
 * Deletes a restaurant
 *
 * @returns Mutation result for deleting restaurant
 */
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: RestaurantDeletionData): Promise<string> => {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.list({ hotelId }),
      });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
      queryClient.removeQueries({
        queryKey: restaurantKeys.detail(deletedId),
      });
    },
  });
};

// ============================================================================
// Menu Item Query Hooks
// ============================================================================

/**
 * Fetches menu items for a specific hotel and optionally filtered by restaurant
 *
 * @param hotelId - ID of the hotel
 * @param restaurantId - Optional ID of the restaurant to filter by
 * @returns Query result with menu items array
 */
export const useRestaurantMenuItems = (
  hotelId: string,
  restaurantId?: string
) => {
  return useQuery({
    queryKey: restaurantId
      ? restaurantKeys.menuItemsList(restaurantId)
      : ["menu-items", hotelId],
    queryFn: async (): Promise<MenuItem[]> => {
      let query = supabase
        .from("menu_items")
        .select("*")
        .eq("hotel_id", hotelId);

      // Optionally filter by restaurant if provided
      if (restaurantId) {
        query = query.contains("restaurant_ids", [restaurantId]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

// ============================================================================
// Dine-In Order Query Hooks
// ============================================================================

/**
 * Fetches dine-in orders for a hotel with full relationships
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with dine-in orders array (includes items, guest, restaurant)
 */
export const useRestaurantDineInOrders = (hotelId: string) => {
  return useQuery({
    queryKey: restaurantKeys.dineInOrdersList(hotelId),
    queryFn: async (): Promise<DineInOrderWithDetails[]> => {
      const { data: orders, error } = await supabase
        .from("dine_in_orders")
        .select(DINE_IN_ORDER_SELECT_QUERY)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (orders as DineInOrderWithDetails[]) || [];
    },
  });
};
