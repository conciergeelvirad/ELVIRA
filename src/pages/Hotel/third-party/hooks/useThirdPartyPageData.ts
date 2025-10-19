/**
 * Custom hook for managing third-party page data fetching
 *
 * This hook encapsulates:
 * - Hotel context
 * - Restaurants and tours data fetching
 * - Approved places data
 * - Loading and error states
 *
 * @returns Data, loading states, and context needed for the third-party page
 */

import { useHotel } from "../../../../contexts/HotelContext";
import {
  useNearbyRestaurantsWithStatus,
  usePlaceDetails,
} from "../../../../hooks/queries/google-places/useGooglePlacesQueries";
import { useNearbyToursWithStatus } from "../../../../hooks/queries/amadeus";
import { useApprovedPlaces } from "../../../../hooks/queries/approved-places/useApprovedPlacesQueries";

interface UseThirdPartyPageDataProps {
  restaurantRadius: number;
  tourRadius: number;
  selectedPlaceId: string | null;
}

export const useThirdPartyPageData = ({
  restaurantRadius,
  tourRadius,
  selectedPlaceId,
}: UseThirdPartyPageDataProps) => {
  // Get hotel context
  const { currentHotel } = useHotel();
  const hotelId = currentHotel?.id || "086e11e4-4775-4327-8448-3fa0ee7be0a5";

  // Fetch restaurants
  const {
    restaurants,
    isLoading: isLoadingRestaurants,
    isError: isErrorRestaurants,
    error: restaurantsError,
    location: restaurantsLocation,
    refetch: refetchRestaurants,
  } = useNearbyRestaurantsWithStatus({
    hotelId,
    radius: restaurantRadius,
  });

  // Fetch tours
  const {
    tours,
    isLoading: isLoadingTours,
    isError: isErrorTours,
    error: toursError,
    location: toursLocation,
    refetch: refetchTours,
  } = useNearbyToursWithStatus({
    hotelId,
    radius: tourRadius,
  });

  // Fetch approved places
  const { data: approvedPlaces = [] } = useApprovedPlaces(hotelId);

  // Fetch detailed place information when a place is selected
  const { data: placeDetails, isLoading: isLoadingDetails } =
    usePlaceDetails(selectedPlaceId);

  return {
    // Hotel context
    hotelId,

    // Restaurants data
    restaurants,
    isLoadingRestaurants,
    isErrorRestaurants,
    restaurantsError,
    restaurantsLocation,
    refetchRestaurants,

    // Tours data
    tours,
    isLoadingTours,
    isErrorTours,
    toursError,
    toursLocation,
    refetchTours,

    // Approved places
    approvedPlaces,

    // Place details
    placeDetails,
    isLoadingDetails,
  };
};
