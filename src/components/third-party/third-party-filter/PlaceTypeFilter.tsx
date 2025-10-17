/**
 * Place Type Filter Component
 *
 * Allows filtering by place type (restaurant, bar, cafe, night club)
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";
import { PLACE_TYPES } from "./filterConstants";

interface PlaceTypeFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string, checked: boolean) => void;
}

export const PlaceTypeFilter: React.FC<PlaceTypeFilterProps> = ({
  selectedTypes,
  onTypeToggle,
}) => {
  return (
    <FilterPanel.Section title="Type">
      {PLACE_TYPES.map((type) => (
        <FilterPanel.Checkbox
          key={type.value}
          label={type.label}
          checked={selectedTypes.includes(type.value)}
          onChange={(checked) => onTypeToggle(type.value, checked)}
        />
      ))}
    </FilterPanel.Section>
  );
};
