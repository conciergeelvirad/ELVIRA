import React from "react";
import type { TabConfig } from "../../../../components/common/layout";
import { Sparkles, Calendar } from "lucide-react";
import { AmenitiesTab, RequestsTab } from "../../components/amenities";
import {
  getAmenityTableColumns,
  getAmenityGridColumns,
  getAmenityRequestTableColumns,
} from "../../components";
import type { useAmenityCRUD } from "./useAmenityCRUD";
import type { useAmenityRequestCRUD } from "./useAmenityRequestCRUD";

interface UseAmenitiesPageContentProps {
  amenitiesLoading: boolean;
  requestsLoading: boolean;
  amenityCRUD: ReturnType<typeof useAmenityCRUD>;
  amenityRequestCRUD: ReturnType<typeof useAmenityRequestCRUD>;
}

/**
 * Custom hook for generating amenities page tab content
 *
 * This hook encapsulates:
 * - Column configuration for amenities and requests
 * - Tab content generation with proper props
 * - Tab configuration array
 *
 * @param props - Loading states and CRUD handlers
 * @returns Array of tab configurations ready for TabPage component
 */
export const useAmenitiesPageContent = ({
  amenitiesLoading,
  requestsLoading,
  amenityCRUD,
  amenityRequestCRUD,
}: UseAmenitiesPageContentProps): TabConfig[] => {
  // Extract CRUD actions for amenities
  const {
    modalActions: amenityModalActions,
    formActions: amenityFormActions,
    handleStatusToggle: amenityStatusToggle,
  } = amenityCRUD;

  // Extract CRUD actions for requests
  const { modalActions: requestModalActions, formActions: requestFormActions } =
    amenityRequestCRUD;

  // Get columns based on current state for amenities
  const amenityTableColumns = React.useMemo(
    () =>
      getAmenityTableColumns({
        handleStatusToggle: amenityStatusToggle,
        modalActions: amenityModalActions,
        formActions: amenityFormActions,
      }),
    [amenityStatusToggle, amenityModalActions, amenityFormActions]
  );

  const amenityGridColumns = React.useMemo(
    () =>
      getAmenityGridColumns({
        handleStatusToggle: amenityStatusToggle,
      }),
    [amenityStatusToggle]
  );

  // Get columns based on current state for amenity requests
  const requestTableColumns = React.useMemo(
    () =>
      getAmenityRequestTableColumns({
        handleStatusToggle: () => {},
        modalActions: requestModalActions,
        formActions: requestFormActions,
      }),
    [requestModalActions, requestFormActions]
  );

  // Generate tab content with proper memoization
  const amenityListContent = React.useMemo(
    () => (
      <AmenitiesTab
        isLoading={amenitiesLoading}
        crud={amenityCRUD}
        tableColumns={amenityTableColumns}
        gridColumns={amenityGridColumns}
      />
    ),
    [amenitiesLoading, amenityCRUD, amenityTableColumns, amenityGridColumns]
  );

  const requestsContent = React.useMemo(
    () => (
      <RequestsTab
        isLoading={requestsLoading}
        crud={amenityRequestCRUD}
        tableColumns={requestTableColumns}
      />
    ),
    [requestsLoading, amenityRequestCRUD, requestTableColumns]
  );

  // Return tab configuration array
  return React.useMemo(
    () => [
      {
        id: "amenities",
        label: "Amenities",
        icon: Sparkles,
        content: amenityListContent,
      },
      {
        id: "requests",
        label: "Requests",
        icon: Calendar,
        content: requestsContent,
      },
    ],
    [amenityListContent, requestsContent]
  );
};
