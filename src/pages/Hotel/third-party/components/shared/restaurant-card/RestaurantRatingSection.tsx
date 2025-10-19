/**
 * Restaurant Rating Section Component
 *
 * Displays rating with star icon and review count
 */

import { Star } from "lucide-react";

export const createRestaurantRatingSection = (
  rating: number,
  reviewCount?: number
) => ({
  icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />,
  content: (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      {reviewCount && (
        <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
      )}
    </div>
  ),
});
