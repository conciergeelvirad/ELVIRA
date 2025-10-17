/**
 * Place Details Query Hook
 *
 * Fetches detailed information for a specific place from Google Places API.
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchPlaceDetails,
  type Restaurant,
} from "../../../services/google-places";
import { googlePlacesKeys } from "./queryKeys";
import { useGooglePlacesApiKey } from "./useGooglePlacesApiKey";

/**
 * Fetches detailed information for a specific place
 *
 * This includes comprehensive data such as:
 * - Reviews and ratings
 * - Contact information (phone, website)
 * - Opening hours
 * - Services and amenities
 * - Photos
 * - And more...
 *
 * @param placeId - The Google Place ID (or null to disable the query)
 * @returns Query result with detailed Restaurant information
 *
 * @example
 * const { data: details, isLoading } = usePlaceDetails(selectedPlaceId);
 *
 * // Lazy loading - only fetch when placeId is available
 * const { data: details } = usePlaceDetails(null); // Won't fetch
 * const { data: details } = usePlaceDetails("ChIJ..."); // Will fetch
 */
export const usePlaceDetails = (placeId: string | null) => {
  // Get the API key
  const { data: apiKey } = useGooglePlacesApiKey();

  return useQuery<Restaurant | null>({
    queryKey: googlePlacesKeys.placeDetail(placeId || ""),
    queryFn: async () => {
      if (!placeId || !apiKey) {
        return null;
      }

      try {
        const details = await fetchPlaceDetails(placeId, apiKey);
        return details;
      } catch (error) {
        console.error("Error fetching place details:", error);
        throw error;
      }
    },
    enabled: !!placeId && !!apiKey,
    staleTime: 1000 * 60 * 60, // 1 hour - details don't change often
  });
};
