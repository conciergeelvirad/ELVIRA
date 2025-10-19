/**
 * Recommended Filter Component
 *
 * Allows filtering to show only recommended places
 */

import React from "react";
import { FilterPanel } from "../../../../../../components/common/FilterPanel";

interface RecommendedFilterProps {
  showRecommendedOnly: boolean;
  onToggle: (checked: boolean) => void;
}

export const RecommendedFilter: React.FC<RecommendedFilterProps> = ({
  showRecommendedOnly,
  onToggle,
}) => {
  return (
    <FilterPanel.Section title="Other">
      <FilterPanel.Checkbox
        label="⭐ Recommended"
        checked={showRecommendedOnly}
        onChange={onToggle}
      />
    </FilterPanel.Section>
  );
};
