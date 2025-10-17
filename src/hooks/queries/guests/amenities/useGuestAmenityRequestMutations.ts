/**
 * Guest Amenity Request Mutations
 *
 * Handles creation of amenity requests for guests
 * Used for hotel services like spa, gym, pool, etc.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { CartItem } from "../../../../contexts/CartContext";

interface AmenityRequestData {
  guestId: string;
  hotelId: string;
  items: CartItem[];
  requestDate: string;
  requestTime?: string;
  specialInstructions?: string;
}

export const useCreateGuestAmenityRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: AmenityRequestData) => {
      // Create multiple amenity requests (one per item)
      const requests = requestData.items.map((item) => ({
        guest_id: requestData.guestId,
        hotel_id: requestData.hotelId,
        amenity_id: item.id,
        request_date: requestData.requestDate,
        request_time: requestData.requestTime,
        special_instructions: requestData.specialInstructions,
        status: "pending",
      }));

      const { data, error } = await supabase
        .from("amenity_requests")
        .insert(requests)
        .select();

      if (error) {
        console.error("Error creating amenity requests:", error);
        throw new Error(`Failed to create requests: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("Requests were not created");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["guest-amenity-requests"] });
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};
