/**
 * TourAgenciesTab Component
 *
 * Simplified tab component for managing third-party tour agencies and activities
 */

import { Loader2, AlertCircle } from "lucide-react";
import { SearchAndFilterBar } from "../../../../../components/common";
import { TourAgenciesDataView } from "../tour-agencies/TourAgenciesDataView";
import { RadiusSelector } from "../../../../../components/third-party/RadiusSelector";
import type { AmadeusActivity } from "../../../../../services/amadeus/types";

interface TourAgenciesTabProps {
  // Search and view
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;

  // Radius
  radius: number; // in km
  onRadiusChange: (km: number) => void;
  onRefetch: () => void;
  location: { lat: number; lng: number } | null;

  // Data
  filteredTours: AmadeusActivity[];

  // Loading and error states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Actions
  getApprovalStatus: (
    activityId: string
  ) => "approved" | "rejected" | "pending";
  isRecommended: (activityId: string) => boolean;
  onApprove: (tour: AmadeusActivity) => Promise<void>;
  onReject: (tour: AmadeusActivity) => Promise<void>;
  onView: (tour: AmadeusActivity) => void;
  onToggleRecommended: (tour: AmadeusActivity) => Promise<void>;
  isActionLoading: boolean;
}

export const TourAgenciesTab = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  radius,
  onRadiusChange,
  onRefetch,
  location,
  filteredTours,
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
}: TourAgenciesTabProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search tours and activities..."
        filterActive={false}
        onFilterToggle={() => {}}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* Radius Selector */}
      <RadiusSelector
        radius={radius * 1000} // Convert km to meters for display
        onRadiusChange={(meters) => onRadiusChange(meters / 1000)} // Convert meters to km
        onRefetch={onRefetch}
        location={location}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">
            Loading nearby tours and activities...
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Tours
              </h3>
              <p className="text-sm text-red-700">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
              <p className="text-sm text-red-600 mt-2">Please make sure:</p>
              <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                <li>The hotel location is set in the database</li>
                <li>The Amadeus API credentials are configured in Supabase</li>
                <li>The API credentials are valid</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tours Display */}
      {!isLoading && !isError && (
        <div className="mt-6">
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredTours.length} tour
            {filteredTours.length !== 1 ? "s" : ""} and activit
            {filteredTours.length !== 1 ? "ies" : "y"} within {radius} km
          </div>
          <TourAgenciesDataView
            viewMode={viewMode}
            filteredData={filteredTours}
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
