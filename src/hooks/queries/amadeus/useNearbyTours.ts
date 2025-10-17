/**
 * Nearby Tours Query Hook
 *
 * Fetches nearby tours based on hotel location using Amadeus Tours & Activities API.
 */

import { useQuery } from "@tanstack/react-query";
import { searchActivities } from "../../../services/amadeus";
import type { AmadeusActivity } from "../../../services/amadeus/types";
import { amadeusKeys } from "./queryKeys";
import { useHotelLocation } from "../google-places/useHotelLocation";
import { useAmadeusCredentials } from "./useAmadeusCredentials";

export interface NearbyToursParams {
  hotelId: string;
  radius?: number; // in km, default 10
}

/**
 * Fetches nearby tours based on hotel location
 *
 * @param params - Parameters including hotelId and optional radius
 * @returns Query result with array of AmadeusActivity objects
 *
 * @example
 * const { data: tours, isLoading } = useNearbyTours({
 *   hotelId: "hotel-123",
 *   radius: 5 // 5km radius
 * });
 */
export const useNearbyTours = ({ hotelId, radius = 10 }: NearbyToursParams) => {
  // Get the hotel location
  const { data: location } = useHotelLocation(hotelId);

  // Get credentials
  const { data: credentials } = useAmadeusCredentials();

  // Fetch tours once we have location and credentials
  return useQuery<AmadeusActivity[]>({
    queryKey: amadeusKeys.nearbyTours(hotelId, radius),
    queryFn: async () => {
      if (!location || !credentials) {
        return [];
      }

      const tours = await searchActivities(
        {
          latitude: location.lat,
          longitude: location.lng,
          radius,
        },
        credentials.clientId,
        credentials.clientSecret
      );

      return tours;
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Combined query that returns loading state for all dependencies
 *
 * This is a convenience hook that combines hotel location and
 * tour data queries, providing a unified loading/error state.
 *
 * @param params - Parameters including hotelId and optional radius
 * @returns Object with tours array, loading states, errors, and location
 *
 * @example
 * const {
 *   tours,
 *   isLoading,
 *   isError,
 *   error,
 *   location,
 *   refetch
 * } = useNearbyToursWithStatus({ hotelId: "hotel-123" });
 */
export const useNearbyToursWithStatus = (params: NearbyToursParams) => {
  const locationQuery = useHotelLocation(params.hotelId);
  const toursQuery = useNearbyTours(params);

  return {
    tours: toursQuery.data || [],
    isLoading: locationQuery.isLoading || toursQuery.isLoading,
    isError: locationQuery.isError || toursQuery.isError,
    error: locationQuery.error || toursQuery.error,
    location: locationQuery.data,
    refetch: toursQuery.refetch,
  };
};
