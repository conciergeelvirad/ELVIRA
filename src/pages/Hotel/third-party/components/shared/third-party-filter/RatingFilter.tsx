/**
 * Rating Filter Component
 *
 * Allows filtering by minimum rating using a slider
 */

import React from "react";
import { FilterPanel } from "../../../../../../components/common/FilterPanel";
import { formatRating } from "./filterConstants";

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  minRating,
  onRatingChange,
}) => {
  return (
    <div className="col-span-1">
      <FilterPanel.Slider
        label="Min Rating"
        value={minRating}
        onChange={onRatingChange}
        min={0}
        max={5}
        step={0.5}
        formatValue={formatRating}
      />
    </div>
  );
};
