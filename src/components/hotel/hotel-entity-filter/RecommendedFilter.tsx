/**
 * Recommended Filter Component
 *
 * Toggle filter for hotel recommended items
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";
import { Star } from "lucide-react";

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
        label="Recommended"
        checked={showRecommendedOnly}
        onChange={onToggle}
        icon={<Star className="w-3 h-3 text-yellow-500" />}
      />
    </FilterPanel.Section>
  );
};
