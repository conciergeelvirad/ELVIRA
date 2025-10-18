/**
 * Price Range Filter Component
 *
 * Allows filtering by price range using a slider
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMax: number;
  onPriceChange: (value: number) => void;
  currency?: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  currentMax,
  onPriceChange,
  currency = "$",
}) => {
  return (
    <FilterPanel.Slider
      label="Max Price"
      value={currentMax}
      onChange={onPriceChange}
      min={minPrice}
      max={maxPrice}
      step={10}
      formatValue={(value) => `${currency}${value}`}
    />
  );
};
