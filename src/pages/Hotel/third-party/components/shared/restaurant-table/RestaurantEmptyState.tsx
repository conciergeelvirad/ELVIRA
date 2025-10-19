/**
 * Restaurant Empty State Component
 *
 * Displayed when no restaurants are found
 */

import React from "react";
import { MapPin } from "lucide-react";

interface RestaurantEmptyStateProps {
  title?: string;
  message?: string;
}

export const RestaurantEmptyState: React.FC<RestaurantEmptyStateProps> = ({
  title = "No restaurants found in this area.",
  message = "Try increasing the search radius or adjusting your filters.",
}) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-600 font-medium">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
    </div>
  );
};
