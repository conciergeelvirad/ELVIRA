/**
 * Q&A Recommendations Page
 *
 * Manages Q&A items and recommended places with CRUD operations in separate tabs.
 */

import React from "react";
import { Plus, HelpCircle, MapPin } from "lucide-react";
import {
  TabPage,
  type TabConfig,
  SearchAndFilterBar,
  Button,
  EmptyState,
  CRUDModalContainer,
} from "../../../components/common";
import {
  useQARecommendationsByType,
  qaRecommendationsKeys,
} from "../../../hooks/queries/hotel-management/qa-recommendations";
import {
  useActiveRecommendedPlaces,
  recommendedPlacesKeys,
} from "../../../hooks/queries/hotel-management/recommended-places";
import { useTableSubscription } from "../../../hooks/useTableSubscription";
import { useHotelStaff } from "../../../hooks/hotel/useHotelStaff";
import { useQACRUD, useRecommendedPlaceCRUD } from "./hooks";
import {
  QAsDataView,
  QA_FORM_FIELDS,
  RecommendedPlacesDataView,
  RECOMMENDED_PLACE_FORM_FIELDS,
} from "./components";

export const QARecommendationsPage = () => {
  // 1. Staff Context - Primary hook that others depend on
  const {
    hotelId,
    hotelStaff,
    isLoading: staffLoading,
    error: staffError,
  } = useHotelStaff();

  // 2. Derived Values - Memoize to prevent unnecessary recalculations
  const safeHotelId = React.useMemo(() => hotelId || "", [hotelId]);

  // 3. Data Fetching - Depends on safeHotelId
  const { data: qas = [], isLoading: qasLoading } = useQARecommendationsByType(
    safeHotelId,
    "Q&A"
  );
  const { data: recommendedPlaces = [], isLoading: placesLoading } =
    useActiveRecommendedPlaces(safeHotelId);

  // 4. Effect for logging - Keep track of staff context changes
  React.useEffect(() => {
    console.log("QARecommendationsPage - Staff Context:", {
      hotelId: safeHotelId,
      staffId: hotelStaff?.id,
      position: hotelStaff?.position,
      department: hotelStaff?.department,
      createdAt: hotelStaff?.created_at,
      isLoading: staffLoading,
      hasError: !!staffError,
      staffData: hotelStaff,
    });
  }, [safeHotelId, hotelStaff, staffLoading, staffError]);

  // Memoize subscription configs to prevent unnecessary re-renders
  const qaSubscriptionConfig = React.useMemo(
    () => ({
      table: "qa_recommendations",
      filter: `hotel_id=eq.${safeHotelId}`,
      queryKey: qaRecommendationsKeys.byType(safeHotelId, "Q&A"),
      enabled: Boolean(safeHotelId) && !staffLoading,
    }),
    [safeHotelId, staffLoading]
  );

  const placesSubscriptionConfig = React.useMemo(
    () => ({
      table: "hotel_recommended_places",
      filter: `hotel_id=eq.${safeHotelId}`,
      queryKey: recommendedPlacesKeys.active(safeHotelId),
      enabled: Boolean(safeHotelId) && !staffLoading,
    }),
    [safeHotelId, staffLoading]
  );

  // Memoize CRUD configurations
  const qaCrudConfig = React.useMemo(
    () => ({
      initialQAs: qas,
      formFields: QA_FORM_FIELDS,
    }),
    [qas]
  );

  const placesCrudConfig = React.useMemo(
    () => ({
      initialPlaces: recommendedPlaces,
      formFields: RECOMMENDED_PLACE_FORM_FIELDS,
    }),
    [recommendedPlaces]
  );

  // Use hooks with memoized configs
  useTableSubscription(qaSubscriptionConfig);
  useTableSubscription(placesSubscriptionConfig);

  const qaCRUD = useQACRUD(qaCrudConfig);
  const placesCRUD = useRecommendedPlaceCRUD(placesCrudConfig);

  // Early return for loading/error states
  if (staffLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (staffError || !hotelId || !hotelStaff) {
    return (
      <div className="flex justify-center items-center h-full text-red-600">
        Error: Unable to load staff data
      </div>
    );
  }

  // Q&A Tab Content
  const qaContent = (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={qaCRUD.searchAndFilter.searchTerm}
        onSearchChange={qaCRUD.searchAndFilter.setSearchTerm}
        searchPlaceholder="Search Q&A..."
        filterActive={Boolean(qaCRUD.searchAndFilter.filterValue)}
        onFilterToggle={() =>
          qaCRUD.searchAndFilter.setFilterValue(
            qaCRUD.searchAndFilter.filterValue ? "" : "Dining"
          )
        }
        viewMode={qaCRUD.searchAndFilter.mode}
        onViewModeChange={qaCRUD.searchAndFilter.setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={qaCRUD.modalActions.openCreateModal}
          >
            Add Q&A
          </Button>
        }
      />

      {qasLoading ? (
        <div className="flex items-center justify-center p-8">
          Loading Q&A...
        </div>
      ) : qaCRUD.searchAndFilter.filteredData.length > 0 ? (
        <>
          <div className="mb-2 text-sm text-gray-500">
            Found {qaCRUD.searchAndFilter.filteredData.length} Q&A item(s)
          </div>
          <QAsDataView
            viewMode={qaCRUD.searchAndFilter.mode}
            filteredData={qaCRUD.searchAndFilter.filteredData}
            handleRowClick={qaCRUD.modalActions.openDetailModal}
            onEdit={qaCRUD.modalActions.openEditModal}
            onDelete={qaCRUD.modalActions.openDeleteModal}
          />
        </>
      ) : (
        <EmptyState
          message="No Q&A found. Create your first Q&A item."
          icon={HelpCircle}
        />
      )}

      {/* Q&A CRUD Modals */}
      <CRUDModalContainer
        modalState={qaCRUD.modalState}
        modalActions={qaCRUD.modalActions}
        formState={qaCRUD.formState}
        formActions={qaCRUD.formActions}
        formFields={QA_FORM_FIELDS}
        onCreateSubmit={qaCRUD.handleCreateSubmit}
        onEditSubmit={qaCRUD.handleEditSubmit}
        onDeleteConfirm={qaCRUD.handleDeleteConfirm}
        entityName="Q&A"
      />
    </div>
  );

  // Recommended Places Tab Content
  const recommendedPlacesContent = (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={placesCRUD.searchAndFilter.searchTerm}
        onSearchChange={placesCRUD.searchAndFilter.setSearchTerm}
        searchPlaceholder="Search recommended places..."
        filterActive={Boolean(placesCRUD.searchAndFilter.filterValue)}
        onFilterToggle={() =>
          placesCRUD.searchAndFilter.setFilterValue(
            placesCRUD.searchAndFilter.filterValue ? "" : "active"
          )
        }
        viewMode={placesCRUD.searchAndFilter.mode}
        onViewModeChange={placesCRUD.searchAndFilter.setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={placesCRUD.modalActions.openCreateModal}
          >
            Add Place
          </Button>
        }
      />

      {placesLoading ? (
        <div className="flex items-center justify-center p-8">
          Loading recommended places...
        </div>
      ) : placesCRUD.searchAndFilter.filteredData.length > 0 ? (
        <>
          <div className="mb-2 text-sm text-gray-500">
            Found {placesCRUD.searchAndFilter.filteredData.length} recommended
            place(s)
          </div>
          <RecommendedPlacesDataView
            viewMode={placesCRUD.searchAndFilter.mode}
            filteredData={placesCRUD.searchAndFilter.filteredData}
            handleRowClick={placesCRUD.modalActions.openDetailModal}
            onEdit={placesCRUD.modalActions.openEditModal}
            onDelete={placesCRUD.modalActions.openDeleteModal}
          />
        </>
      ) : (
        <EmptyState
          message="No recommended places found. Add your first recommended place."
          icon={MapPin}
        />
      )}

      {/* Recommended Places CRUD Modals */}
      <CRUDModalContainer
        modalState={placesCRUD.modalState}
        modalActions={placesCRUD.modalActions}
        formState={placesCRUD.formState}
        formActions={placesCRUD.formActions}
        formFields={RECOMMENDED_PLACE_FORM_FIELDS}
        onCreateSubmit={placesCRUD.handleCreateSubmit}
        onEditSubmit={placesCRUD.handleEditSubmit}
        onDeleteConfirm={placesCRUD.handleDeleteConfirm}
        entityName="Recommended Place"
      />
    </div>
  );

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: "qa",
      label: "Q&A",
      icon: HelpCircle,
      content: qaContent,
    },
    {
      id: "recommended-places",
      label: "Recommended Places",
      icon: MapPin,
      content: recommendedPlacesContent,
    },
  ];

  return <TabPage title="Q&A + Recommendations" tabs={tabs} defaultTab="qa" />;
};
