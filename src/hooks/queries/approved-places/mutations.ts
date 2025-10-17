/**
 * Update Mutations for Approved Places
 *
 * Mutation hooks for updating existing approved third-party places.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import type {
  ApprovedThirdPartyPlace,
  UpdateApprovedPlaceInput,
} from "../../../types/approved-third-party-places";
import { approvedPlacesKeys } from "./queryKeys";

/**
 * Update approval status
 *
 * Updates the status or google_data of an existing approved place record.
 * Use this to change a place from pending → approved/rejected, or to update
 * the cached Google data.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * const updateStatus = useUpdateApprovalStatus();
 *
 * // Approve a pending place
 * await updateStatus.mutateAsync({
 *   id: placeRecordId,
 *   status: "approved"
 * });
 *
 * // Update Google data
 * await updateStatus.mutateAsync({
 *   id: placeRecordId,
 *   google_data: { ...updatedData }
 * });
 */
export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateApprovedPlaceInput) => {
      const updateData: Record<string, unknown> = {};
      if (input.status !== undefined) updateData.status = input.status;
      if (input.google_data !== undefined)
        updateData.google_data = input.google_data;
      if (input.recommended !== undefined)
        updateData.recommended = input.recommended;

      const { data, error } = await supabase
        .from("approved_third_party_places")
        .update(updateData)
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw error;
      return data as ApprovedThirdPartyPlace;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: approvedPlacesKeys.byHotel(data.hotel_id),
      });
    },
  });
};

/**
 * Toggle recommended status for a place
 *
 * Toggles the "recommended" flag for a place. Recommended places are
 * highlighted to hotel guests as top picks.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * const toggleRecommended = useToggleRecommended();
 *
 * await toggleRecommended.mutateAsync({
 *   placeId: googlePlaceId,
 *   hotelId: hotelId,
 *   currentStatus: false // Will be toggled to true
 * });
 */
export const useToggleRecommended = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      placeId,
      hotelId,
      currentStatus,
    }: {
      placeId: string;
      hotelId: string;
      currentStatus: boolean;
    }) => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .update({ recommended: !currentStatus })
        .eq("place_id", placeId)
        .eq("hotel_id", hotelId)
        .select()
        .single();

      if (error) throw error;
      return data as ApprovedThirdPartyPlace;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: approvedPlacesKeys.byHotel(data.hotel_id),
      });
    },
  });
};
