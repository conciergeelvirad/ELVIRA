/**
 * Delete Approved Place Mutation
 *
 * Mutation hook for deleting approved third-party place records.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { approvedPlacesKeys } from "./queryKeys";

/**
 * Delete an approved place
 *
 * Permanently removes an approved place record from the database.
 * This is typically used to remove old or incorrect entries.
 *
 * Note: Deleting a place doesn't affect the Google Places data - it only
 * removes the approval/rejection record from your database.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * const deletePlace = useDeleteApprovedPlace();
 *
 * await deletePlace.mutateAsync(placeRecordId);
 *
 * // With error handling
 * try {
 *   await deletePlace.mutateAsync(placeRecordId);
 *   toast.success('Place removed successfully');
 * } catch (error) {
 *   toast.error('Failed to remove place');
 * }
 */
export const useDeleteApprovedPlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First get the hotel_id for cache invalidation
      const { data: place, error: fetchError } = await supabase
        .from("approved_third_party_places")
        .select("hotel_id")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("approved_third_party_places")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return place.hotel_id;
    },
    onSuccess: (hotelId) => {
      queryClient.invalidateQueries({
        queryKey: approvedPlacesKeys.byHotel(hotelId),
      });
    },
  });
};
