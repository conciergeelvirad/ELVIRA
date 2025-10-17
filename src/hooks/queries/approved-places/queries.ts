/**
 * Approved Places Query Hooks
 *
 * React Query hooks for fetching approved third-party places.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import type {
  ApprovedThirdPartyPlace,
  ApprovalStatus,
} from "../../../types/approved-third-party-places";
import { approvedPlacesKeys } from "./queryKeys";

/**
 * Fetch all approved places for a hotel
 *
 * Returns all places regardless of their approval status (pending, approved, rejected).
 *
 * @param hotelId - The unique identifier of the hotel
 * @returns Query result with array of ApprovedThirdPartyPlace objects
 *
 * @example
 * const { data: places, isLoading } = useApprovedPlaces(hotelId);
 */
export const useApprovedPlaces = (hotelId: string) => {
  return useQuery({
    queryKey: approvedPlacesKeys.byHotel(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ApprovedThirdPartyPlace[];
    },
    enabled: !!hotelId,
  });
};

/**
 * Fetch approved places by status
 *
 * Filter places by their approval status (pending, approved, or rejected).
 *
 * @param hotelId - The unique identifier of the hotel
 * @param status - The approval status to filter by
 * @returns Query result with filtered array of ApprovedThirdPartyPlace objects
 *
 * @example
 * const { data: approvedPlaces } = useApprovedPlacesByStatus(hotelId, "approved");
 * const { data: pendingPlaces } = useApprovedPlacesByStatus(hotelId, "pending");
 */
export const useApprovedPlacesByStatus = (
  hotelId: string,
  status: ApprovalStatus
) => {
  return useQuery({
    queryKey: approvedPlacesKeys.byHotelAndStatus(hotelId, status),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ApprovedThirdPartyPlace[];
    },
    enabled: !!hotelId,
  });
};

/**
 * Check if a place is already approved/rejected
 *
 * Useful for checking if a Google Place has already been reviewed by the hotel.
 * Returns null if the place hasn't been reviewed yet.
 *
 * @param hotelId - The unique identifier of the hotel
 * @param placeId - The Google Place ID
 * @returns Query result with ApprovedThirdPartyPlace or null
 *
 * @example
 * const { data: existingPlace } = useApprovedPlaceByPlaceId(hotelId, googlePlaceId);
 * if (existingPlace) {
 *   console.log('This place has been reviewed:', existingPlace.status);
 * }
 */
export const useApprovedPlaceByPlaceId = (hotelId: string, placeId: string) => {
  return useQuery({
    queryKey: approvedPlacesKeys.byPlaceId(hotelId, placeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approved_third_party_places")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("place_id", placeId)
        .maybeSingle();

      if (error) throw error;
      return data as ApprovedThirdPartyPlace | null;
    },
    enabled: !!hotelId && !!placeId,
  });
};
