/**
 * useApprovedRestaurants Hook
 *
 * Fetches and filters approved restaurants for display
 * Combines approved places from DB with Google Places API data
 */

import { useMemo } from "react";
import { useApprovedPlaces } from "../../../../../../../hooks/queries/approved-places/useApprovedPlacesQueries";
import { useNearbyRestaurantsWithStatus } from "../../../../../../../hooks/queries/google-places/useNearbyRestaurants";

export const useApprovedRestaurants = (hotelId: string) => {
  // Fetch approved places from the correct table
  const { data: approvedPlaces = [], isLoading: loadingApproved } =
    useApprovedPlaces(hotelId);

  // Fetch all nearby restaurants with photos
  const {
    restaurants,
    isLoading: loadingRestaurants,
    isError: errorRestaurants,
  } = useNearbyRestaurantsWithStatus({
    hotelId,
    radius: 5000, // 5km radius
  });

  // Filter only approved items (not rejected or pending)
  const approvedOnly = useMemo(
    () => approvedPlaces.filter((p) => p.status === "approved"),
    [approvedPlaces]
  );

  // Filter to get only approved restaurants
  const approvedRestaurants = useMemo(() => {
    const approvedPlaceIds = approvedOnly.map((p) => p.place_id);
    return restaurants.filter((restaurant) =>
      approvedPlaceIds.includes(restaurant.place_id)
    );
  }, [approvedOnly, restaurants]);

  return {
    restaurants: approvedRestaurants,
    isLoading: loadingApproved || loadingRestaurants,
    isError: errorRestaurants,
  };
};
