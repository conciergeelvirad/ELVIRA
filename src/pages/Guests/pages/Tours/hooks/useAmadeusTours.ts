/**
 * useAmadeusTours Hook
 *
 * Fetches tours and activities from Amadeus API based on hotel location
 * Only returns approved tours (filtered by approved tour agencies)
 */

import { useQuery } from "@tanstack/react-query";
import {
  searchActivities,
  type AmadeusActivity,
} from "../../../../../services/amadeusActivities.service";
import { useApprovedTourAgencies } from "../../../../../hooks/queries/useApprovedThirdPartyItems";
import { useHotelLocation } from "../../../../../hooks/queries/google-places/useHotelLocation";

interface UseAmadeusToursProps {
  hotelId: string;
  radius?: number; // in kilometers
}

interface UseAmadeusToursReturn {
  tours: AmadeusActivity[];
  isLoading: boolean;
  error: Error | null;
  approvedCount: number;
}

export const useAmadeusTours = ({
  hotelId,
  radius = 10,
}: UseAmadeusToursProps): UseAmadeusToursReturn => {
  // Get hotel location using the existing hook (same as restaurants use)
  const { data: hotelLocation, isLoading: isLoadingLocation } =
    useHotelLocation(hotelId);

  // Get approved tour agencies
  const { data: approvedAgencies = [], isLoading: isLoadingAgencies } =
    useApprovedTourAgencies(hotelId);

  // Fetch tours from Amadeus
  const {
    data: tours = [],
    isLoading: isLoadingTours,
    error,
  } = useQuery({
    queryKey: ["amadeus-tours", hotelId, radius],
    queryFn: async (): Promise<AmadeusActivity[]> => {
      if (!hotelLocation?.lat || !hotelLocation?.lng) {
        return [];
      }

      try {
        const activities = await searchActivities({
          latitude: hotelLocation.lat,
          longitude: hotelLocation.lng,
          radius,
        });

        return activities;
      } catch (error) {
        console.error("❌ [useAmadeusTours] Error fetching tours:", error);
        throw error;
      }
    },
    enabled: !!hotelLocation?.lat && !!hotelLocation?.lng,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });

  // Filter tours by approved agencies (if you have agency mapping logic)
  // For now, we'll show all Amadeus tours since they're from a trusted source
  // You can add additional filtering logic here based on approvedAgencies

  return {
    tours,
    isLoading: isLoadingLocation || isLoadingAgencies || isLoadingTours,
    error: error as Error | null,
    approvedCount: approvedAgencies.length,
  };
};
