/**
 * Nearby Restaurants Query Hook
 *
 * Fetches nearby restaurants based on hotel location using Google Places API.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchNearbyRestaurants } from "../../../services/google-places";
import type { Restaurant } from "../../../services/google-places/types";
import { googlePlacesKeys } from "./queryKeys";
import { useHotelLocation } from "./useHotelLocation";
import { useGooglePlacesApiKey } from "./useGooglePlacesApiKey";

export interface NearbyRestaurantsParams {
  hotelId: string;
  radius?: number; // in meters, default 5000 (5km)
}

/**
 * Fetches nearby restaurants based on hotel location
 *
 * @param params - Parameters including hotelId and optional radius
 * @returns Query result with array of Restaurant objects
 *
 * @example
 * const { data: restaurants, isLoading } = useNearbyRestaurants({
 *   hotelId: "hotel-123",
 *   radius: 3000 // 3km radius
 * });
 */
export const useNearbyRestaurants = ({
  hotelId,
  radius = 5000,
}: NearbyRestaurantsParams) => {
  // First get the hotel location
  const { data: location } = useHotelLocation(hotelId);

  // Get the API key
  const { data: apiKey } = useGooglePlacesApiKey();

  // Fetch restaurants once we have both location and API key
  return useQuery<Restaurant[]>({
    queryKey: googlePlacesKeys.nearbyRestaurantsList(hotelId, radius),
    queryFn: async () => {
      if (!location || !apiKey) {
        return [];
      }

      const response = await fetchNearbyRestaurants({
        location,
        radius,
        apiKey,
      });

      return response.results;
    },
    enabled: !!location && !!apiKey,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Combined query that returns loading state for all dependencies
 *
 * This is a convenience hook that combines hotel location, API key, and
 * restaurant data queries, providing a unified loading/error state.
 *
 * @param params - Parameters including hotelId and optional radius
 * @returns Object with restaurants array, loading states, errors, and location
 *
 * @example
 * const {
 *   restaurants,
 *   isLoading,
 *   isError,
 *   error,
 *   location,
 *   refetch
 * } = useNearbyRestaurantsWithStatus({ hotelId: "hotel-123" });
 */
export const useNearbyRestaurantsWithStatus = (
  params: NearbyRestaurantsParams
) => {
  const locationQuery = useHotelLocation(params.hotelId);
  const apiKeyQuery = useGooglePlacesApiKey();
  const restaurantsQuery = useNearbyRestaurants(params);

  return {
    restaurants: restaurantsQuery.data || [],
    isLoading:
      locationQuery.isLoading ||
      apiKeyQuery.isLoading ||
      restaurantsQuery.isLoading,
    isError:
      locationQuery.isError || apiKeyQuery.isError || restaurantsQuery.isError,
    error: locationQuery.error || apiKeyQuery.error || restaurantsQuery.error,
    location: locationQuery.data,
    refetch: restaurantsQuery.refetch,
  };
};
