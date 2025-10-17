/**
 * Upsert Approved Place Mutation
 *
 * Mutation hook for creating or updating approved third-party places.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import type {
  ApprovedThirdPartyPlace,
  CreateApprovedPlaceInput,
} from "../../../types/approved-third-party-places";
import { approvedPlacesKeys } from "./queryKeys";

/**
 * Create or update an approved place (upsert)
 *
 * This hook uses an upsert operation that will:
 * - Insert a new record if the place doesn't exist for this hotel
 * - Update the existing record if it already exists (based on hotel_id + place_id)
 *
 * After a successful mutation, it invalidates all related queries to ensure
 * the UI reflects the latest data.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * const upsert = useUpsertApprovedPlace();
 *
 * // Approve a place
 * await upsert.mutateAsync({
 *   hotel_id: hotelId,
 *   place_id: googlePlaceId,
 *   name: "Restaurant Name",
 *   type: "restaurant",
 *   status: "approved",
 *   google_data: { ...placeData }
 * });
 *
 * // Reject a place
 * await upsert.mutateAsync({
 *   hotel_id: hotelId,
 *   place_id: googlePlaceId,
 *   name: "Restaurant Name",
 *   type: "restaurant",
 *   status: "rejected",
 *   google_data: { ...placeData }
 * });
 */
export const useUpsertApprovedPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApprovedPlaceInput) => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .upsert(
          {
            hotel_id: input.hotel_id,
            place_id: input.place_id,
            name: input.name,
            type: input.type,
            status: input.status,
            google_data: input.google_data,
            recommended: input.recommended,
          },
          {
            onConflict: "hotel_id,place_id", // Update if exists
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data as ApprovedThirdPartyPlace;
    },
    onSuccess: (data) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: approvedPlacesKeys.byHotel(data.hotel_id),
      });
    },
  });
};
