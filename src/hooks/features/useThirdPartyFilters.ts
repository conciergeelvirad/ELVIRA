/**
 * Third Party Filters Custom Hook
 *
 * Centralized state management for all filter options in the Third Party Management page.
 * This hook manages filter states and provides reset functionality.
 */

import { useState } from "react";
import type { ApprovalStatus } from "../../types/approved-third-party-places";

export interface ThirdPartyFilters {
  // Filter states
  selectedTypes: string[];
  selectedStatuses: ApprovalStatus[];
  minRating: number;
  selectedPriceLevels: number[];
  showRecommendedOnly: boolean;
}

export interface UseThirdPartyFiltersReturn {
  // Filter state object
  filters: ThirdPartyFilters;

  // Individual setters
  setSelectedTypes: (types: string[]) => void;
  setSelectedStatuses: (statuses: ApprovalStatus[]) => void;
  setMinRating: (rating: number) => void;
  setSelectedPriceLevels: (levels: number[]) => void;
  setShowRecommendedOnly: (show: boolean) => void;

  // Batch update function
  updateFilters: (partial: Partial<ThirdPartyFilters>) => void;

  // Filter panel visibility
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;

  // Actions
  resetFilters: () => void;
}

/**
 * Hook for managing third-party place filters
 *
 * @returns Filter states, setters, batch update, filter panel visibility, and reset function
 *
 * @example
 * const { filters, updateFilters, resetFilters, isFilterOpen, setIsFilterOpen } = useThirdPartyFilters();
 *
 * // Use filter states
 * const filtered = data.filter(item =>
 *   filters.selectedTypes.includes(item.type)
 * );
 *
 * // Update specific filter
 * updateFilters({ minRating: 4.0 });
 *
 * // Reset all filters
 * resetFilters();
 */
export const useThirdPartyFilters = (): UseThirdPartyFiltersReturn => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "restaurant",
    "bar",
    "cafe",
    "night_club",
  ]);

  const [selectedStatuses, setSelectedStatuses] = useState<ApprovalStatus[]>([
    "pending",
    "approved",
    "rejected",
  ]);

  const [minRating, setMinRating] = useState<number>(0);

  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([
    1, 2, 3, 4,
  ]);

  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /**
   * Batch update multiple filters at once
   */
  const updateFilters = (partial: Partial<ThirdPartyFilters>) => {
    if (partial.selectedTypes !== undefined)
      setSelectedTypes(partial.selectedTypes);
    if (partial.selectedStatuses !== undefined)
      setSelectedStatuses(partial.selectedStatuses);
    if (partial.minRating !== undefined) setMinRating(partial.minRating);
    if (partial.selectedPriceLevels !== undefined)
      setSelectedPriceLevels(partial.selectedPriceLevels);
    if (partial.showRecommendedOnly !== undefined)
      setShowRecommendedOnly(partial.showRecommendedOnly);
  };

  /**
   * Reset all filters to their default values
   */
  const resetFilters = () => {
    setSelectedTypes(["restaurant", "bar", "cafe", "night_club"]);
    setSelectedStatuses(["pending", "approved", "rejected"]);
    setMinRating(0);
    setSelectedPriceLevels([1, 2, 3, 4]);
    setShowRecommendedOnly(false);
  };

  // Create filters object
  const filters: ThirdPartyFilters = {
    selectedTypes,
    selectedStatuses,
    minRating,
    selectedPriceLevels,
    showRecommendedOnly,
  };

  return {
    filters,
    setSelectedTypes,
    setSelectedStatuses,
    setMinRating,
    setSelectedPriceLevels,
    setShowRecommendedOnly,
    updateFilters,
    isFilterOpen,
    setIsFilterOpen,
    resetFilters,
  };
};
