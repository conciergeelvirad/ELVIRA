/**
 * useApprovedTours Hook
 *
 * Fetches and filters approved tour activities for display
 * Combines approved places from DB with Amadeus API data
 */

import { useMemo } from "react";
import { useApprovedPlaces } from "../../../../../../../hooks/queries/approved-places/useApprovedPlacesQueries";
import { useNearbyToursWithStatus } from "../../../../../../../hooks/queries/amadeus";

export const useApprovedTours = (hotelId: string) => {
  // Fetch approved places from the correct table
  const { data: approvedPlaces = [], isLoading: loadingApproved } =
    useApprovedPlaces(hotelId);

  // Fetch all nearby tours with photos
  const {
    tours,
    isLoading: loadingTours,
    isError: errorTours,
  } = useNearbyToursWithStatus({
    hotelId,
    radius: 10, // 10km radius for tours
  });

  // Filter only approved items (not rejected or pending)
  const approvedOnly = useMemo(
    () => approvedPlaces.filter((p) => p.status === "approved"),
    [approvedPlaces]
  );

  // Filter to get only approved tours
  const approvedTours = useMemo(() => {
    const approvedTourIds = approvedOnly.map((p) => p.place_id);
    return tours.filter((tour) => approvedTourIds.includes(tour.id));
  }, [approvedOnly, tours]);

  return {
    tours: approvedTours,
    isLoading: loadingApproved || loadingTours,
    isError: errorTours,
  };
};
