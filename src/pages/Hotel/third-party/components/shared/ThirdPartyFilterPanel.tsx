/**
 * Third Party Places Filter Panel
 *
 * Specialized filter panel for third-party places (restaurants, bars, etc.)
 * Built using the reusable FilterPanel component.
 */

import React from "react";
import { FilterPanel } from "../../../../../components/common/FilterPanel";
import type { ApprovalStatus } from "../../../../../types/approved-third-party-places";
import {
  PlaceTypeFilter,
  ApprovalStatusFilter,
  PriceLevelFilter,
  RatingFilter,
  RecommendedFilter,
} from "./third-party-filter";

// ============================================================================
// TYPES
// ============================================================================

export interface ThirdPartyFilters {
  selectedTypes: string[];
  selectedStatuses: ApprovalStatus[];
  minRating: number;
  selectedPriceLevels: number[];
  showRecommendedOnly: boolean;
}

export interface ThirdPartyFilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: ThirdPartyFilters;
  onFiltersChange: (filters: Partial<ThirdPartyFilters>) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Filter panel specifically for third-party places
 *
 * @example
 * <ThirdPartyFilterPanel
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 *   filters={filters}
 *   onFiltersChange={updateFilters}
 *   onReset={resetFilters}
 *   resultCount={filteredCount}
 *   totalCount={totalCount}
 * />
 */
export const ThirdPartyFilterPanel: React.FC<ThirdPartyFilterPanelProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onReset,
  resultCount,
  totalCount,
}) => {
  // Handler functions
  const handleTypeToggle = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.selectedTypes, type]
      : filters.selectedTypes.filter((t) => t !== type);
    onFiltersChange({ selectedTypes: newTypes });
  };

  const handleStatusToggle = (status: ApprovalStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.selectedStatuses, status]
      : filters.selectedStatuses.filter((s) => s !== status);
    onFiltersChange({ selectedStatuses: newStatuses });
  };

  const handlePriceLevelToggle = (level: number, checked: boolean) => {
    const newLevels = checked
      ? [...filters.selectedPriceLevels, level]
      : filters.selectedPriceLevels.filter((l) => l !== level);
    onFiltersChange({ selectedPriceLevels: newLevels });
  };

  return (
    <FilterPanel isOpen={isOpen} onToggle={onToggle} title="Filters">
      {/* Compact Grid Layout for Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Place Type Filter */}
        <PlaceTypeFilter
          selectedTypes={filters.selectedTypes}
          onTypeToggle={handleTypeToggle}
        />

        {/* Approval Status Filter */}
        <ApprovalStatusFilter
          selectedStatuses={filters.selectedStatuses}
          onStatusToggle={handleStatusToggle}
        />

        {/* Price Level Filter */}
        <PriceLevelFilter
          selectedPriceLevels={filters.selectedPriceLevels}
          onPriceLevelToggle={handlePriceLevelToggle}
        />

        {/* Minimum Rating Filter */}
        <RatingFilter
          minRating={filters.minRating}
          onRatingChange={(value) => onFiltersChange({ minRating: value })}
        />

        {/* Recommended Filter */}
        <RecommendedFilter
          showRecommendedOnly={filters.showRecommendedOnly}
          onToggle={(checked) =>
            onFiltersChange({ showRecommendedOnly: checked })
          }
        />
      </div>

      {/* Actions */}
      <FilterPanel.Actions
        onReset={onReset}
        resultCount={resultCount}
        totalCount={totalCount}
      />
    </FilterPanel>
  );
};
