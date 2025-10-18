import React from "react";
import { TabPage } from "../../components/common/layout";
import { LoadingState, EmptyState } from "../../components/common";
import {
  AMENITY_FORM_FIELDS,
  AMENITY_REQUEST_FORM_FIELDS,
} from "./components/amenities";
import {
  useAmenityCRUD,
  useAmenityRequestCRUD,
  useAmenitiesPageData,
  useAmenitiesPageContent,
} from "./hooks/amenities";

/**
 * Amenities Management Page
 *
 * Main page component for managing hotel amenities and amenity requests.
 * Uses custom hooks for data fetching, CRUD operations, and UI generation.
 *
 * Architecture:
 * - useAmenitiesPageData: Handles data fetching and real-time subscriptions
 * - useAmenityCRUD/useAmenityRequestCRUD: Handle CRUD operations
 * - useAmenitiesPageContent: Generates tab content with proper memoization
 */
export const AmenitiesPage = () => {
  // 1. Fetch all data and setup subscriptions
  const {
    hotelId,
    hotelStaff,
    staffError,
    amenities,
    amenityRequests,
    amenitiesLoading,
    requestsLoading,
    isLoading,
  } = useAmenitiesPageData();

  // 2. Setup CRUD hooks with memoized configs
  const amenityCrudConfig = React.useMemo(
    () => ({
      initialAmenities: amenities,
      formFields: AMENITY_FORM_FIELDS,
    }),
    [amenities]
  );

  const requestCrudConfig = React.useMemo(
    () => ({
      initialRequests: amenityRequests,
      formFields: AMENITY_REQUEST_FORM_FIELDS,
      hotelId: hotelId || "",
    }),
    [amenityRequests, hotelId]
  );

  const amenityCRUD = useAmenityCRUD(amenityCrudConfig);
  const amenityRequestCRUD = useAmenityRequestCRUD(requestCrudConfig);

  // 3. Generate tab content
  const tabs = useAmenitiesPageContent({
    amenitiesLoading,
    requestsLoading,
    amenityCRUD,
    amenityRequestCRUD,
  });

  // Early return for loading state
  if (isLoading) {
    return <LoadingState message="Loading amenities..." className="h-full" />;
  }

  // Early return for error state
  if (staffError || !hotelId || !hotelStaff) {
    return (
      <EmptyState
        message="Unable to load staff data. Please try again."
        className="h-full"
      />
    );
  }

  return <TabPage title="Amenities" tabs={tabs} defaultTab="amenities" />;
};
