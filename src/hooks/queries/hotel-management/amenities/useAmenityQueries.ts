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
 * Fetches all amenities for a hotel (both active and inactive)
 */
export const useAmenities = (hotelId: string) => {
  return useQuery({
    queryKey: amenitiesKeys.list({ hotelId }),
    queryFn: async () => {
      console.log("🔍 FETCHING AMENITIES for hotel:", hotelId);
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });
      // Removed .eq("is_active", true) to show both active and inactive items
      // Added stable ordering by created_at to prevent re-sorting on updates

      if (error) {
        console.error("❌ FETCH AMENITIES ERROR:", error);
        throw error;
      }
      console.log("✅ FETCHED AMENITIES:", data?.length, "items");
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
      console.log("🔄 UPDATE AMENITY MUTATION:", { id, updates });
      const { data, error } = await supabase
        .from("amenities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ UPDATE AMENITY ERROR:", error);
        throw error;
      }
      console.log("✅ UPDATE AMENITY SUCCESS:", data);
      return data as Amenity;
    },
    onSuccess: (data) => {
      console.log("🔄 INVALIDATING QUERIES after amenity update");
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: amenitiesKeys.detail(data.id),
      });
    },
  });
};

/**
 * Deletes an amenity from the database
 *
 * This is a hard delete operation that permanently removes the amenity record.
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
      const { error } = await supabase.from("amenities").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.detail(id) });
    },
  });
};
