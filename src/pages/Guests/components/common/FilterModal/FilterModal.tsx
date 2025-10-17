/**
 * Filter Modal Component (Refactored)
 *
 * Reusable filter modal for guest pages (Shop, DineIn, Services)
 * Features:
 * - Full-screen mobile-optimized modal
 * - Category multi-select
 * - Price range slider (Airbnb-style dual handle)
 * - Hotel recommended toggle
 * - Apply/Reset functionality
 *
 * Refactored into:
 * - useFilterState: Manages local filter state
 * - FilterHeader: Header with close button and filter count
 * - FilterPriceRange: Dual-handle price range slider
 * - FilterToggle: Hotel recommended toggle
 * - FilterTagList: Reusable tag selection (categories, restaurants, service types)
 * - FilterActions: Reset/Apply buttons
 */

import { useFilterState } from "./hooks/useFilterState";
import {
  FilterHeader,
  FilterPriceRange,
  FilterToggle,
  FilterTagList,
  FilterActions,
} from "./components";
import type { FilterModalProps } from "./types";

export const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  categories,
  maxPrice,
  currentFilters,
  restaurants,
  serviceTypes,
}: FilterModalProps) => {
  // Use filter state hook
  const {
    selectedCategories,
    priceRange,
    setPriceRange,
    showOnlyRecommended,
    setShowOnlyRecommended,
    selectedRestaurants,
    selectedServiceTypes,
    toggleCategory,
    toggleRestaurant,
    toggleServiceType,
    handleReset,
    activeFilterCount,
  } = useFilterState({ isOpen, currentFilters, maxPrice });

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle apply filters
  const handleApply = () => {
    onApply({
      selectedCategories,
      priceRange,
      showOnlyRecommended,
      selectedRestaurants: restaurants ? selectedRestaurants : undefined,
      selectedServiceTypes: serviceTypes ? selectedServiceTypes : undefined,
    });
    onClose();
  };

  // Transform data for FilterTagList
  const categoryItems = categories.map((cat) => ({ id: cat, label: cat }));
  const restaurantItems =
    restaurants?.map((r) => ({ id: r.id, label: r.name })) || [];
  const serviceTypeItems =
    serviceTypes?.map((st) => ({ id: st, label: st })) || [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Modal Container - Slides up on mobile */}
      <div className="bg-white w-full sm:max-w-lg sm:rounded-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-b-lg animate-in slide-in-from-bottom duration-300 sm:animate-in sm:fade-in">
        {/* Header */}
        <FilterHeader activeFilterCount={activeFilterCount} onClose={onClose} />

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Price Range Section */}
          <FilterPriceRange
            priceRange={priceRange}
            maxPrice={maxPrice}
            onChange={setPriceRange}
          />

          {/* Hotel Recommended Toggle */}
          <FilterToggle
            checked={showOnlyRecommended}
            onChange={setShowOnlyRecommended}
            label="Hotel Recommended"
            description="Show recommended items only"
          />

          {/* Restaurants Section (DineIn only) */}
          <FilterTagList
            title="Restaurants"
            items={restaurantItems}
            selectedItems={selectedRestaurants}
            onToggle={toggleRestaurant}
          />

          {/* Service Types Section (DineIn only) */}
          <FilterTagList
            title="Service Type"
            items={serviceTypeItems}
            selectedItems={selectedServiceTypes}
            onToggle={toggleServiceType}
          />

          {/* Categories Section */}
          <FilterTagList
            title="Categories"
            items={categoryItems}
            selectedItems={selectedCategories}
            onToggle={toggleCategory}
          />
        </div>

        {/* Footer Actions */}
        <FilterActions onReset={handleReset} onApply={handleApply} />
      </div>
    </div>
  );
};
