/**
 * useFilterState Hook
 *
 * Manages filter state for filterable list pages
 * Handles filter modal, price range, categories, and search
 */

import { useState, useEffect, useMemo } from "react";
import type { FilterOptions } from "../components/common";

interface UseFilterStateProps {
  initialMaxPrice?: number;
  items: Array<{ price: number }>; // Products, menu items, or services
}

export const useFilterState = ({
  initialMaxPrice = 1000,
  items,
}: UseFilterStateProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    selectedCategories: [],
    priceRange: { min: 0, max: initialMaxPrice },
    showOnlyRecommended: false,
  });

  // Calculate max price from items
  const maxPrice = useMemo(() => {
    if (items.length === 0) return initialMaxPrice;

    // Filter out items with price 0 (no price info) before calculating max
    const itemsWithPrice = items.filter((item) => item.price > 0);

    if (itemsWithPrice.length === 0) return initialMaxPrice;

    return Math.ceil(Math.max(...itemsWithPrice.map((item) => item.price)));
  }, [items, initialMaxPrice]);

  // Update price range when maxPrice changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min: 0, max: maxPrice },
    }));
  }, [maxPrice]);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    isFilterModalOpen,
    openFilterModal,
    closeFilterModal,
    maxPrice,
  };
};
