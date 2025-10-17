/**
 * Hotel Location Query Hook
 *
 * Fetches the current hotel's geographic location from the database.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import {
  parseGeographyToLatLng,
  type PlaceLocation,
} from "../../../services/googlePlaces.service";
import { googlePlacesKeys } from "./queryKeys";

/**
 * Fetches the current hotel's location from the database
 *
 * @param hotelId - The unique identifier of the hotel
 * @returns Query result with PlaceLocation data (lat/lng)
 *
 * @example
 * const { data: location, isLoading } = useHotelLocation(hotelId);
 */
export const useHotelLocation = (hotelId: string) => {
  return useQuery<PlaceLocation | null>({
    queryKey: googlePlacesKeys.hotelLocation(hotelId),
    queryFn: async () => {
      console.log("Fetching hotel location for ID:", hotelId);

      // Fetch hotel with location field
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", hotelId)
        .single();

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error fetching hotel location:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      if (!data) {
        console.warn("Hotel not found for ID:", hotelId);
        return null;
      }

      if (!data?.location) {
        console.warn("Hotel location field is empty");
        return null;
      }

      console.log("Raw location from database:", data.location);

      // Parse PostGIS geography to lat/lng
      const location = parseGeographyToLatLng(data.location as string);
      console.log("Parsed location:", location);

      return location;
    },
    enabled: !!hotelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 0, // Don't cache - for debugging
  });
};
