/**
 * RestaurantsTab Component
 *
 * Simplified tab component for managing third-party restaurants
 */

import { Loader2, AlertCircle } from "lucide-react";
import { SearchAndFilterBar } from "../../../../../components/common";
import { RestaurantsDataView } from "../restaurants/RestaurantsDataView";
import { Plus } from "lucide-react";
import { ThirdPartyFilterPanel } from "../shared/ThirdPartyFilterPanel";
import { RadiusSelector } from "../shared/RadiusSelector";
import type { Restaurant } from "../../../../../services/googlePlaces.service";
import type { ThirdPartyFilters } from "../../../../../hooks/features/useThirdPartyFilters";

interface RestaurantsTabProps {
  // Search and filter
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;

  // Filters
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  filters: ThirdPartyFilters;
  onFiltersChange: (updates: Partial<ThirdPartyFilters>) => void;
  onResetFilters: () => void;

  // Radius
  radius: number;
  onRadiusChange: (radius: number) => void;
  onRefetch: () => void;
  location: { lat: number; lng: number } | null;

  // Data
  filteredRestaurants: Restaurant[];
  totalRestaurants: number;
  approvedPlaces: unknown[]; // Type from useApprovedPlaces

  // Loading and error states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Actions
  getApprovalStatus: (placeId: string) => "approved" | "rejected" | "pending";
  isRecommended: (placeId: string) => boolean;
  onApprove: (restaurant: Restaurant) => Promise<void>;
  onReject: (restaurant: Restaurant) => Promise<void>;
  onView: (restaurant: Restaurant) => void;
  onToggleRecommended: (restaurant: Restaurant) => Promise<void>;
  isActionLoading: boolean;
}

export const RestaurantsTab = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isFilterOpen,
  onFilterToggle,
  filters,
  onFiltersChange,
  onResetFilters,
  radius,
  onRadiusChange,
  onRefetch,
  location,
  filteredRestaurants,
  totalRestaurants,
  isLoading,
  isError,
  error,
  getApprovalStatus,
  isRecommended,
  onApprove,
  onReject,
  onView,
  onToggleRecommended,
  isActionLoading,
}: RestaurantsTabProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search restaurants..."
        filterActive={isFilterOpen}
        onFilterToggle={onFilterToggle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* Filter Panel */}
      <ThirdPartyFilterPanel
        isOpen={isFilterOpen}
        onToggle={onFilterToggle}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
        resultCount={filteredRestaurants.length}
        totalCount={totalRestaurants}
      />

      {/* Radius Selector */}
      <RadiusSelector
        radius={radius}
        onRadiusChange={onRadiusChange}
        onRefetch={onRefetch}
        location={location}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading nearby restaurants...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Restaurants
              </h3>
              <p className="text-sm text-red-700">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
              <p className="text-sm text-red-600 mt-2">Please make sure:</p>
              <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                <li>The hotel location is set in the database</li>
                <li>The Google Places API key is configured in Supabase</li>
                <li>The API key has the Places API enabled</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Display */}
      {!isLoading && !isError && (
        <div className="mt-6">
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredRestaurants.length} restaurant
            {filteredRestaurants.length !== 1 ? "s" : ""} within {radius / 1000}{" "}
            km
          </div>
          <RestaurantsDataView
            viewMode={viewMode}
            filteredData={filteredRestaurants}
            getApprovalStatus={getApprovalStatus}
            isRecommended={isRecommended}
            onApprove={onApprove}
            onReject={onReject}
            onView={onView}
            onToggleRecommended={onToggleRecommended}
            isLoading={isActionLoading}
          />
        </div>
      )}
    </div>
  );
};
