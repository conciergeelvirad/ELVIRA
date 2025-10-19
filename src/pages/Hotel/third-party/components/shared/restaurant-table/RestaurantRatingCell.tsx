/**
 * Restaurant Rating Cell Component
 *
 * Displays star rating with review count
 */

import React from "react";
import { Star } from "lucide-react";

interface RestaurantRatingCellProps {
  rating?: number;
  reviewCount?: number;
}

export const RestaurantRatingCell: React.FC<RestaurantRatingCellProps> = ({
  rating,
  reviewCount,
}) => {
  if (!rating) {
    return <span className="text-sm text-gray-500">No rating</span>;
  }

  return (
    <div className="flex items-center">
      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
      <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
      {reviewCount && (
        <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
      )}
    </div>
  );
};
