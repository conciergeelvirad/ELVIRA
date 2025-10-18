/**
 * Hotel Entity Filter Panel Component
 *
 * A comprehensive filter panel for hotel entities (amenities, products, menu items)
 * Supports filtering by category, price range, recommended status, and entity status
 */

import React from "react";
import { FilterPanel } from "../common/FilterPanel";
import {
  CategoryFilter,
  PriceRangeFilter,
  RecommendedFilter,
  StatusFilter,
  ServiceTypeFilter,
} from "./hotel-entity-filter";

interface HotelEntityFilterPanelProps {
  // Category filter
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;

  // Price range filter
  minPrice: number;
  maxPrice: number;
  currentMaxPrice: number;
  onPriceChange: (value: number) => void;
  currency?: string;

  // Recommended filter
  showRecommendedOnly: boolean;
  onRecommendedToggle: (checked: boolean) => void;

  // Status filter
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;

  // Service type filter (optional, for menu items)
  showServiceTypeFilter?: boolean;
  selectedServiceTypes?: string[];
  onServiceTypeToggle?: (serviceType: string) => void;

  // Panel state
  isOpen: boolean;
  onToggle: () => void;

  // Actions
  onReset: () => void;
  resultCount: number;
}

export const HotelEntityFilterPanel: React.FC<HotelEntityFilterPanelProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  minPrice,
  maxPrice,
  currentMaxPrice,
  onPriceChange,
  currency = "€",
  showRecommendedOnly,
  onRecommendedToggle,
  selectedStatuses,
  onStatusToggle,
  showServiceTypeFilter = false,
  selectedServiceTypes = [],
  onServiceTypeToggle,
  isOpen,
  onToggle,
  onReset,
  resultCount,
}) => {
  return (
    <FilterPanel isOpen={isOpen} onToggle={onToggle}>
      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={onCategoryToggle}
        />

        {/* Price Range Filter */}
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          currentMax={currentMaxPrice}
          onPriceChange={onPriceChange}
          currency={currency}
        />

        {/* Status Filter */}
        <StatusFilter
          selectedStatuses={selectedStatuses}
          onStatusToggle={onStatusToggle}
        />

        {/* Service Type Filter (Menu Items Only) */}
        {showServiceTypeFilter && onServiceTypeToggle && (
          <ServiceTypeFilter
            selectedServiceTypes={selectedServiceTypes}
            onServiceTypeToggle={onServiceTypeToggle}
          />
        )}

        {/* Recommended Filter */}
        <RecommendedFilter
          showRecommendedOnly={showRecommendedOnly}
          onToggle={onRecommendedToggle}
        />
      </div>

      {/* Actions */}
      <FilterPanel.Actions onReset={onReset} resultCount={resultCount} />
    </FilterPanel>
  );
};
