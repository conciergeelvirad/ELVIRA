/**
 * Price Level Filter Component
 *
 * Allows filtering by price level (€, €€, €€€, €€€€)
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";
import { PRICE_LEVELS } from "./filterConstants";

interface PriceLevelFilterProps {
  selectedPriceLevels: number[];
  onPriceLevelToggle: (level: number, checked: boolean) => void;
}

export const PriceLevelFilter: React.FC<PriceLevelFilterProps> = ({
  selectedPriceLevels,
  onPriceLevelToggle,
}) => {
  return (
    <FilterPanel.Section title="Price">
      {PRICE_LEVELS.map((price) => (
        <FilterPanel.Checkbox
          key={price.value}
          label={price.label}
          checked={selectedPriceLevels.includes(price.value)}
          onChange={(checked) => onPriceLevelToggle(price.value, checked)}
        />
      ))}
    </FilterPanel.Section>
  );
};
