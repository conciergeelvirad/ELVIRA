/**
 * Restaurant Rating Display Component
 *
 * Shows the overall rating and total number of reviews in a highlighted card
 */

import React from "react";
import { Star } from "lucide-react";

interface RestaurantRatingDisplayProps {
  rating: number;
  totalReviews?: number;
}

export const RestaurantRatingDisplay: React.FC<
  RestaurantRatingDisplayProps
> = ({ rating, totalReviews }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
      </div>
      {totalReviews && (
        <span className="text-gray-600">
          Based on {totalReviews.toLocaleString()} reviews
        </span>
      )}
    </div>
  );
};
