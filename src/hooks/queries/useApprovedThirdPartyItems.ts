/**
 * Approved Third Party Items Query Hook
 *
 * Fetches only APPROVED third-party items from hotel_third_party_approvals table
 * Simple hook focused on displaying approved restaurants and tour agencies
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export type ThirdPartyType = "RESTAURANT" | "TOUR AGENCY";

export interface ApprovedThirdPartyItem {
  id: string;
  hotel_id: string;
  third_party_id: string;
  third_party_type: ThirdPartyType;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
}

/**
 * Fetches only approved third-party items for a hotel
 * Only returns items with status = 'APPROVED'
 *
 * @param hotelId - ID of the hotel
 * @param type - Optional filter for third-party type ('RESTAURANT' or 'TOUR AGENCY')
 * @returns Query result with approved third-party items
 */
export const useApprovedThirdPartyItems = (
  hotelId: string,
  type?: ThirdPartyType
) => {
  return useQuery({
    queryKey: ["approved-third-party-items", hotelId, type],
    queryFn: async (): Promise<ApprovedThirdPartyItem[]> => {
      let query = supabase
        .from("hotel_third_party_approvals")
        .select(
          "id, hotel_id, third_party_id, third_party_type, created_at, updated_at, approved_by"
        )
        .eq("hotel_id", hotelId)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

      // Apply optional type filter
      if (type) {
        query = query.eq("third_party_type", type);
      }

      const { data, error } = await query;

      if (error) {
        console.error(
          "❌ [useApprovedThirdPartyItems] Error fetching approved items:",
          error
        );
        throw error;
      }

      return data || [];
    },
    enabled: !!hotelId,
  });
};

/**
 * Fetches only approved restaurants for a hotel
 * Convenience hook for approved restaurants only
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with approved restaurants
 */
export const useApprovedRestaurants = (hotelId: string) => {
  return useApprovedThirdPartyItems(hotelId, "RESTAURANT");
};

/**
 * Fetches only approved tour agencies for a hotel
 * Convenience hook for approved tour agencies only
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with approved tour agencies
 */
export const useApprovedTourAgencies = (hotelId: string) => {
  return useApprovedThirdPartyItems(hotelId, "TOUR AGENCY");
};

/**
 * Gets count of approved items by type
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with counts
 */
export const useApprovedItemsCounts = (hotelId: string) => {
  return useQuery({
    queryKey: ["approved-items-counts", hotelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_third_party_approvals")
        .select("third_party_type")
        .eq("hotel_id", hotelId)
        .eq("status", "APPROVED");

      if (error) {
        console.error(
          "❌ [useApprovedItemsCounts] Error fetching counts:",
          error
        );
        throw error;
      }

      const counts = {
        total: data?.length || 0,
        restaurants:
          data?.filter((item) => item.third_party_type === "RESTAURANT")
            .length || 0,
        tourAgencies:
          data?.filter((item) => item.third_party_type === "TOUR AGENCY")
            .length || 0,
      };

      return counts;
    },
    enabled: !!hotelId,
  });
};
