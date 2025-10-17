/**
 * Recommended Places Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  recommendedPlacesKeys,
  RECOMMENDED_PLACE_WITH_DETAILS_SELECT,
  RECOMMENDED_PLACE_SIMPLE_SELECT,
} from "./recommendedPlace.constants";
import type {
  RecommendedPlace,
  RecommendedPlaceInsert,
  RecommendedPlaceUpdate,
  RecommendedPlaceWithDetails,
} from "./recommendedPlace.types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch all recommended places for a hotel
 * Includes joined data (profile, hotel)
 */
export const useRecommendedPlaces = (hotelId: string) => {
  return useQuery({
    queryKey: recommendedPlacesKeys.list(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .select(RECOMMENDED_PLACE_WITH_DETAILS_SELECT)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RecommendedPlaceWithDetails[];
    },
    enabled: !!hotelId,
  });
};

/**
 * Fetch only active recommended places for a hotel
 * Uses simple select (no joins)
 */
export const useActiveRecommendedPlaces = (hotelId: string) => {
  return useQuery({
    queryKey: recommendedPlacesKeys.active(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .select(RECOMMENDED_PLACE_SIMPLE_SELECT)
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("place_name", { ascending: true });

      if (error) throw error;
      return data as RecommendedPlace[];
    },
    enabled: !!hotelId,
  });
};

/**
 * Fetch a single recommended place by ID
 * Includes joined data (profile, hotel)
 */
export const useRecommendedPlaceById = (placeId: string | undefined) => {
  return useQuery({
    queryKey: recommendedPlacesKeys.detail(placeId || ""),
    queryFn: async () => {
      if (!placeId) {
        throw new Error("Place ID is required");
      }

      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .select(RECOMMENDED_PLACE_WITH_DETAILS_SELECT)
        .eq("id", placeId)
        .single();

      if (error) throw error;
      return data as RecommendedPlaceWithDetails;
    },
    enabled: !!placeId,
  });
};

/**
 * Search recommended places by text
 * Searches in place_name and address fields
 */
export const useSearchRecommendedPlaces = (
  hotelId: string,
  searchText: string
) => {
  return useQuery({
    queryKey: recommendedPlacesKeys.search(hotelId, searchText),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .select(RECOMMENDED_PLACE_WITH_DETAILS_SELECT)
        .eq("hotel_id", hotelId)
        .or(`place_name.ilike.%${searchText}%,address.ilike.%${searchText}%`)
        .order("place_name", { ascending: true });

      if (error) throw error;
      return data as RecommendedPlaceWithDetails[];
    },
    enabled: !!hotelId && searchText.length > 0,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new recommended place
 */
export const useCreateRecommendedPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlace: RecommendedPlaceInsert) => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .insert(newPlace)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.active(data.hotel_id),
      });
    },
  });
};

/**
 * Update an existing recommended place
 */
export const useUpdateRecommendedPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: RecommendedPlaceUpdate;
    }) => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.active(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.detail(data.id),
      });
    },
  });
};

/**
 * Delete a recommended place
 */
export const useDeleteRecommendedPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hotel_recommended_places")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.all,
      });
    },
  });
};

/**
 * Toggle active status of a recommended place
 */
export const useTogglePlaceActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("hotel_recommended_places")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.active(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: recommendedPlacesKeys.detail(data.id),
      });
    },
  });
};
