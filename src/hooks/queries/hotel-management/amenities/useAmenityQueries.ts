/**
 * Amenity Query Hooks
 *
 * React Query hooks for managing amenity data operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { amenitiesKeys } from "./amenity.constants";
import type {
  Amenity,
  AmenityInsert,
  AmenityUpdateData,
} from "./amenity.types";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all active amenities for a hotel
 */
export const useAmenities = (hotelId: string) => {
  return useQuery({
    queryKey: amenitiesKeys.list({ hotelId }),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true);

      if (error) throw error;
      return data as Amenity[];
    },
  });
};

/**
 * Fetches a single amenity by ID
 */
export const useAmenityDetails = (id: string) => {
  return useQuery({
    queryKey: amenitiesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Amenity;
    },
    enabled: !!id,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new amenity
 *
 * @example
 * ```tsx
 * const createAmenity = useCreateAmenity();
 *
 * createAmenity.mutate({
 *   hotel_id: 'hotel-123',
 *   name: 'Swimming Pool',
 *   description: 'Olympic-sized pool with heated water',
 *   category: 'pool',
 *   price: 0, // Free
 *   is_active: true,
 *   hotel_recommended: true,
 * });
 * ```
 */
export const useCreateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAmenity: AmenityInsert) => {
      const { data, error } = await supabase
        .from("amenities")
        .insert(newAmenity)
        .select()
        .single();

      if (error) throw error;
      return data as Amenity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.lists() });
    },
  });
};

/**
 * Updates an existing amenity
 *
 * @example
 * ```tsx
 * const updateAmenity = useUpdateAmenity();
 *
 * updateAmenity.mutate({
 *   id: 'amenity-123',
 *   name: 'Updated Pool Name',
 *   price: 15.00,
 * });
 * ```
 */
export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: AmenityUpdateData) => {
      const { data, error } = await supabase
        .from("amenities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Amenity;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: amenitiesKeys.detail(data.id),
      });
    },
  });
};

/**
 * Soft deletes an amenity by setting is_active to false
 *
 * This is a soft delete operation that maintains data integrity
 * by marking the amenity as inactive rather than removing it.
 *
 * @example
 * ```tsx
 * const deleteAmenity = useDeleteAmenity();
 *
 * deleteAmenity.mutate('amenity-123');
 * ```
 */
export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("amenities")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.detail(id) });
    },
  });
};
