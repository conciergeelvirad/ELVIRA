/**
 * useFilterState Hook
 *
 * Manages local filter state for the filter modal
 */

import { useState, useEffect } from "react";
import type { FilterOptions } from "../types";

interface UseFilterStateProps {
  isOpen: boolean;
  currentFilters: FilterOptions;
  maxPrice: number;
}

interface UseFilterStateReturn {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: { min: number; max: number };
  setPriceRange: React.Dispatch<
    React.SetStateAction<{ min: number; max: number }>
  >;
  showOnlyRecommended: boolean;
  setShowOnlyRecommended: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRestaurants: string[];
  setSelectedRestaurants: React.Dispatch<React.SetStateAction<string[]>>;
  selectedServiceTypes: string[];
  setSelectedServiceTypes: React.Dispatch<React.SetStateAction<string[]>>;
  toggleCategory: (category: string) => void;
  toggleRestaurant: (restaurantId: string) => void;
  toggleServiceType: (serviceType: string) => void;
  handleReset: () => void;
  activeFilterCount: number;
}

export const useFilterState = ({
  isOpen,
  currentFilters,
  maxPrice,
}: UseFilterStateProps): UseFilterStateReturn => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.selectedCategories
  );
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(
    currentFilters.showOnlyRecommended
  );
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>(
    currentFilters.selectedRestaurants || []
  );
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    currentFilters.selectedServiceTypes || []
  );

  // Reset local state when modal opens or currentFilters change
  useEffect(() => {
    setSelectedCategories(currentFilters.selectedCategories);
    setPriceRange(currentFilters.priceRange);
    setShowOnlyRecommended(currentFilters.showOnlyRecommended);
    setSelectedRestaurants(currentFilters.selectedRestaurants || []);
    setSelectedServiceTypes(currentFilters.selectedServiceTypes || []);
  }, [isOpen, currentFilters]);

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle restaurant toggle
  const toggleRestaurant = (restaurantId: string) => {
    setSelectedRestaurants((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  // Handle service type toggle
  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(serviceType)
        ? prev.filter((type) => type !== serviceType)
        : [...prev, serviceType]
    );
  };

  // Handle reset filters
  const handleReset = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: maxPrice });
    setShowOnlyRecommended(false);
    setSelectedRestaurants([]);
    setSelectedServiceTypes([]);
  };

  // Count active filters
  const activeFilterCount =
    selectedCategories.length +
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0) +
    (showOnlyRecommended ? 1 : 0) +
    selectedRestaurants.length +
    selectedServiceTypes.length;

  return {
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    showOnlyRecommended,
    setShowOnlyRecommended,
    selectedRestaurants,
    setSelectedRestaurants,
    selectedServiceTypes,
    setSelectedServiceTypes,
    toggleCategory,
    toggleRestaurant,
    toggleServiceType,
    handleReset,
    activeFilterCount,
  };
};
