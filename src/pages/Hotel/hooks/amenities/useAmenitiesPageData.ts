import React from "react";
import { useTableSubscription } from "../../../../hooks/useTableSubscription";
import {
  useAmenities,
  amenitiesKeys,
} from "../../../../hooks/queries/hotel-management/amenities";
import {
  useAmenityRequests,
  amenityRequestKeys,
} from "../../../../hooks/queries/hotel-management/amenity-requests";
import { useHotelStaff } from "../../../../hooks/hotel/useHotelStaff";

/**
 * Custom hook for managing amenities page data fetching and real-time subscriptions
 *
 * This hook encapsulates:
 * - Hotel staff context
 * - Amenities and requests data fetching
 * - Real-time subscription setup
 * - Loading and error states
 *
 * @returns Data, loading states, and staff context needed for the amenities page
 */
export const useAmenitiesPageData = () => {
  // 1. Staff Context Hook - Primary context that others depend on
  const {
    hotelId,
    hotelStaff,
    isLoading: staffLoading,
    error: staffError,
  } = useHotelStaff();

  // Memoize the hotel ID to prevent unnecessary re-renders
  const safeHotelId = React.useMemo(() => hotelId || "", [hotelId]);

  // 2. Data Fetching Hooks
  const { data: amenities = [], isLoading: amenitiesLoading } =
    useAmenities(safeHotelId);
  const { data: amenityRequests = [], isLoading: requestsLoading } =
    useAmenityRequests(safeHotelId);

  // 3. Subscription config memoization to prevent re-renders
  const amenitiesSubscriptionConfig = React.useMemo(
    () => ({
      table: "amenities" as const,
      filter: `hotel_id=eq.${safeHotelId}`,
      queryKey: amenitiesKeys.list({ hotelId: safeHotelId }),
      enabled: Boolean(safeHotelId) && !staffLoading,
    }),
    [safeHotelId, staffLoading]
  );

  const requestsSubscriptionConfig = React.useMemo(
    () => ({
      table: "amenity_requests" as const,
      filter: `hotel_id=eq.${safeHotelId}`,
      queryKey: amenityRequestKeys.list(safeHotelId),
      enabled: Boolean(safeHotelId) && !staffLoading,
    }),
    [safeHotelId, staffLoading]
  );

  // Subscription hooks with memoized configs
  useTableSubscription(amenitiesSubscriptionConfig);
  useTableSubscription(requestsSubscriptionConfig);

  // Log the complete staff context when data changes
  React.useEffect(() => {
    if (hotelId && hotelStaff) {
      console.log("AmenitiesPage - Staff Context:", {
        hotelId,
        staffId: hotelStaff.id,
        position: hotelStaff.position,
        department: hotelStaff.department,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hotelId, hotelStaff]);

  return {
    // Staff context
    hotelId,
    hotelStaff,
    staffLoading,
    staffError,

    // Data
    amenities,
    amenityRequests,

    // Loading states
    amenitiesLoading,
    requestsLoading,

    // Combined loading state
    isLoading: staffLoading || amenitiesLoading || requestsLoading,
  };
};
