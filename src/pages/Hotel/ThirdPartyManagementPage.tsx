import { useMemo } from "react";
import { TabPage } from "../../components/common";
import { RestaurantDetailsModal } from "../../components/third-party/RestaurantDetailsModal";
import { useThirdPartyFilters } from "../../hooks/features/useThirdPartyFilters";
import { useThirdPartyActions } from "../../hooks/features/useThirdPartyActions";
import {
  useThirdPartyPageData,
  useThirdPartyPageContent,
  useThirdPartyUIState,
} from "./hooks/third-party";
import {
  filterRestaurants,
  getApprovalStatus,
  convertTourToRestaurant,
} from "../../utils/domain/third-party";
import type { Restaurant } from "../../services/googlePlaces.service";

/**
 * Third Party Management Page
 *
 * Main page for managing third-party restaurants and tour agencies.
 *
 * Architecture:
 * - useThirdPartyUIState: UI state (search, view modes, radius)
 * - useThirdPartyPageData: Data fetching (Google Places + Amadeus APIs)
 * - useThirdPartyFilters: Restaurant filtering
 * - useThirdPartyActions: Approve/reject/recommend actions
 * - useThirdPartyPageContent: Tab generation
 */
export const ThirdPartyManagementPage = () => {
  const uiState = useThirdPartyUIState();
  const filters = useThirdPartyFilters();
  const data = useThirdPartyPageData({
    restaurantRadius: uiState.restaurantRadius,
    tourRadius: uiState.tourRadius,
    selectedPlaceId: null,
  });
  const actions = useThirdPartyActions({
    hotelId: data.hotelId,
    approvedPlaces: data.approvedPlaces,
  });

  // Filter data
  const filteredRestaurants = useMemo(() => {
    const searchFiltered = data.restaurants.filter((r) =>
      r.name.toLowerCase().includes(uiState.restaurantSearchQuery.toLowerCase())
    );
    return filters.isFilterOpen
      ? filterRestaurants(searchFiltered, data.approvedPlaces, {
          selectedTypes: filters.filters.selectedTypes,
          selectedStatuses: filters.filters.selectedStatuses,
          minRating: filters.filters.minRating,
          selectedPriceLevels: filters.filters.selectedPriceLevels,
          showRecommendedOnly: filters.filters.showRecommendedOnly,
        })
      : searchFiltered;
  }, [
    data.restaurants,
    data.approvedPlaces,
    uiState.restaurantSearchQuery,
    filters.filters,
    filters.isFilterOpen,
  ]);

  const filteredTours = useMemo(
    () =>
      data.tours.filter((t) =>
        t.name.toLowerCase().includes(uiState.tourSearchQuery.toLowerCase())
      ),
    [data.tours, uiState.tourSearchQuery]
  );

  // Action handlers
  const handleViewRestaurant = (restaurant: Restaurant) => {
    uiState.setSelectedRestaurant(restaurant);
    actions.handleViewDetails(restaurant);
  };

  const handleCloseModal = () => {
    uiState.setSelectedRestaurant(null);
    actions.handleCloseDetails();
  };

  // Generate tabs
  const tabs = useThirdPartyPageContent({
    restaurantSearchQuery: uiState.restaurantSearchQuery,
    onRestaurantSearchChange: uiState.setRestaurantSearchQuery,
    restaurantViewMode: uiState.restaurantViewMode,
    onRestaurantViewModeChange: uiState.setRestaurantViewMode,
    isFilterOpen: filters.isFilterOpen,
    onFilterToggle: () => filters.setIsFilterOpen(!filters.isFilterOpen),
    filters: filters.filters,
    onFiltersChange: filters.updateFilters,
    onResetFilters: filters.resetFilters,
    restaurantRadius: uiState.restaurantRadius,
    onRestaurantRadiusChange: uiState.setRestaurantRadius,
    onRestaurantRefetch: data.refetchRestaurants,
    restaurantsLocation: data.restaurantsLocation || null,
    filteredRestaurants,
    totalRestaurants: data.restaurants.length,
    approvedPlaces: data.approvedPlaces,
    isLoadingRestaurants: data.isLoadingRestaurants,
    isErrorRestaurants: data.isErrorRestaurants,
    restaurantsError: data.restaurantsError,
    tourSearchQuery: uiState.tourSearchQuery,
    onTourSearchChange: uiState.setTourSearchQuery,
    tourViewMode: uiState.tourViewMode,
    onTourViewModeChange: uiState.setTourViewMode,
    tourRadius: uiState.tourRadius,
    onTourRadiusChange: uiState.setTourRadius,
    onTourRefetch: data.refetchTours,
    toursLocation: data.toursLocation || null,
    filteredTours,
    isLoadingTours: data.isLoadingTours,
    isErrorTours: data.isErrorTours,
    toursError: data.toursError,
    getApprovalStatus: (id) => getApprovalStatus(id, data.approvedPlaces),
    isRecommended: actions.getRecommendedStatus,
    onApproveRestaurant: actions.handleApprove,
    onRejectRestaurant: actions.handleReject,
    onViewRestaurant: handleViewRestaurant,
    onToggleRestaurantRecommended: actions.handleToggleRecommended,
    onApproveTour: (tour) =>
      actions.handleApprove(convertTourToRestaurant(tour)),
    onRejectTour: (tour) => actions.handleReject(convertTourToRestaurant(tour)),
    onViewTour: (tour) => console.log("Viewing tour:", tour),
    onToggleTourRecommended: (tour) =>
      actions.handleToggleRecommended(convertTourToRestaurant(tour)),
    isActionLoading: actions.isActionLoading,
  });

  return (
    <>
      <TabPage
        title="Third Party Management"
        tabs={tabs}
        defaultTab="restaurants"
      />
      <RestaurantDetailsModal
        isOpen={actions.isDetailsModalOpen}
        onClose={handleCloseModal}
        restaurant={data.placeDetails || uiState.selectedRestaurant}
        isLoadingDetails={data.isLoadingDetails}
      />
    </>
  );
};
