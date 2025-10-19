/**
 * Custom hook for generating third-party page tab content
 *
 * This hook encapsulates:
 * - Tab content generation with proper props
 * - Tab configuration array
 *
 * @param props - UI states, data, and action handlers
 * @returns Array of tab configurations ready for TabPage component
 */

import type { TabConfig } from "../../../../components/common/layout";
import { UtensilsCrossed, Plane } from "lucide-react";
import { RestaurantsTab, TourAgenciesTab } from "../components";
import type { Restaurant } from "../../../../services/googlePlaces.service";
import type { AmadeusActivity } from "../../../../services/amadeus/types";
import type { ThirdPartyFilters } from "../../../../hooks/features/useThirdPartyFilters";

interface UseThirdPartyPageContentProps {
  // Restaurant tab props
  restaurantSearchQuery: string;
  onRestaurantSearchChange: (value: string) => void;
  restaurantViewMode: "grid" | "list";
  onRestaurantViewModeChange: (mode: "grid" | "list") => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  filters: ThirdPartyFilters;
  onFiltersChange: (updates: Partial<ThirdPartyFilters>) => void;
  onResetFilters: () => void;
  restaurantRadius: number;
  onRestaurantRadiusChange: (radius: number) => void;
  onRestaurantRefetch: () => void;
  restaurantsLocation: { lat: number; lng: number } | null;
  filteredRestaurants: Restaurant[];
  totalRestaurants: number;
  approvedPlaces: unknown[];
  isLoadingRestaurants: boolean;
  isErrorRestaurants: boolean;
  restaurantsError: Error | null;

  // Tour tab props
  tourSearchQuery: string;
  onTourSearchChange: (value: string) => void;
  tourViewMode: "grid" | "list";
  onTourViewModeChange: (mode: "grid" | "list") => void;
  tourRadius: number;
  onTourRadiusChange: (km: number) => void;
  onTourRefetch: () => void;
  toursLocation: { lat: number; lng: number } | null;
  filteredTours: AmadeusActivity[];
  isLoadingTours: boolean;
  isErrorTours: boolean;
  toursError: Error | null;

  // Shared actions
  getApprovalStatus: (placeId: string) => "approved" | "rejected" | "pending";
  isRecommended: (placeId: string) => boolean;
  onApproveRestaurant: (restaurant: Restaurant) => Promise<void>;
  onRejectRestaurant: (restaurant: Restaurant) => Promise<void>;
  onViewRestaurant: (restaurant: Restaurant) => void;
  onToggleRestaurantRecommended: (restaurant: Restaurant) => Promise<void>;
  onApproveTour: (tour: AmadeusActivity) => Promise<void>;
  onRejectTour: (tour: AmadeusActivity) => Promise<void>;
  onViewTour: (tour: AmadeusActivity) => void;
  onToggleTourRecommended: (tour: AmadeusActivity) => Promise<void>;
  isActionLoading: boolean;
}

export const useThirdPartyPageContent = (
  props: UseThirdPartyPageContentProps
): TabConfig[] => {
  // Return tab configuration array directly without memoization
  // (memoizing would cause infinite loops with complex object dependencies)
  return [
    {
      id: "restaurants",
      label: "Restaurants",
      icon: UtensilsCrossed,
      content: (
        <RestaurantsTab
          searchQuery={props.restaurantSearchQuery}
          onSearchChange={props.onRestaurantSearchChange}
          viewMode={props.restaurantViewMode}
          onViewModeChange={props.onRestaurantViewModeChange}
          isFilterOpen={props.isFilterOpen}
          onFilterToggle={props.onFilterToggle}
          filters={props.filters}
          onFiltersChange={props.onFiltersChange}
          onResetFilters={props.onResetFilters}
          radius={props.restaurantRadius}
          onRadiusChange={props.onRestaurantRadiusChange}
          onRefetch={props.onRestaurantRefetch}
          location={props.restaurantsLocation}
          filteredRestaurants={props.filteredRestaurants}
          totalRestaurants={props.totalRestaurants}
          approvedPlaces={props.approvedPlaces}
          isLoading={props.isLoadingRestaurants}
          isError={props.isErrorRestaurants}
          error={props.restaurantsError}
          getApprovalStatus={props.getApprovalStatus}
          isRecommended={props.isRecommended}
          onApprove={props.onApproveRestaurant}
          onReject={props.onRejectRestaurant}
          onView={props.onViewRestaurant}
          onToggleRecommended={props.onToggleRestaurantRecommended}
          isActionLoading={props.isActionLoading}
        />
      ),
    },
    {
      id: "tour-agencies",
      label: "Tour Agencies",
      icon: Plane,
      content: (
        <TourAgenciesTab
          searchQuery={props.tourSearchQuery}
          onSearchChange={props.onTourSearchChange}
          viewMode={props.tourViewMode}
          onViewModeChange={props.onTourViewModeChange}
          radius={props.tourRadius}
          onRadiusChange={props.onTourRadiusChange}
          onRefetch={props.onTourRefetch}
          location={props.toursLocation}
          filteredTours={props.filteredTours}
          isLoading={props.isLoadingTours}
          isError={props.isErrorTours}
          error={props.toursError}
          getApprovalStatus={props.getApprovalStatus}
          isRecommended={props.isRecommended}
          onApprove={props.onApproveTour}
          onReject={props.onRejectTour}
          onView={props.onViewTour}
          onToggleRecommended={props.onToggleTourRecommended}
          isActionLoading={props.isActionLoading}
        />
      ),
    },
  ];
};
