/**
 * Restaurant Detail Modal Component
 *
 * Displays detailed information about a restaurant.
 */

import { restaurantDetailFields } from "./RestaurantColumns";
import type { Restaurant } from "../../../../../hooks/queries/hotel-management/restaurants";

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

/**
 * Restaurant detail modal content
 */
export const RestaurantDetail = ({ restaurant }: RestaurantDetailProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {restaurantDetailFields.map((field) => {
        const Icon = field.icon;
        const value =
          typeof field.accessor === "function"
            ? field.accessor(restaurant)
            : restaurant[field.key as keyof Restaurant];

        return (
          <div key={field.key} className="flex items-start space-x-3">
            {Icon && (
              <div className="mt-1">
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">{field.label}</p>
              <p className="mt-1 text-sm text-gray-900 break-words whitespace-pre-wrap">
                {String(value)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
