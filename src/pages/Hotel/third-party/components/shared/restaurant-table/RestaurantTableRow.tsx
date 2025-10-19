/**
 * Restaurant Table Row Component
 *
 * Individual table row with all restaurant data cells
 */

import React from "react";
import { MapPin, DollarSign, ExternalLink } from "lucide-react";
import { Badge } from "../../../../../../components/common";
import { RestaurantNameCell } from "./RestaurantNameCell";
import { RestaurantRatingCell } from "./RestaurantRatingCell";
import { RestaurantStatusCell } from "./RestaurantStatusCell";

interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
  types?: string[];
}

interface RestaurantTableRowProps {
  restaurant: Restaurant;
  onRowClick?: (restaurant: Restaurant) => void;
  onViewInMaps: (restaurant: Restaurant) => void;
}

export const RestaurantTableRow: React.FC<RestaurantTableRowProps> = ({
  restaurant,
  onRowClick,
  onViewInMaps,
}) => {
  const getPriceLevelText = (level?: number): string => {
    if (!level) return "N/A";
    return "$".repeat(level);
  };

  const photoUrl =
    restaurant.photos && restaurant.photos.length > 0
      ? restaurant.photos[0].photo_reference
      : undefined;

  const category =
    restaurant.types && restaurant.types.length > 0
      ? restaurant.types[0].replace(/_/g, " ")
      : undefined;

  return (
    <tr
      onClick={() => onRowClick?.(restaurant)}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* Restaurant Name with Photo */}
      <td className="px-6 py-4">
        <RestaurantNameCell
          name={restaurant.name}
          photoUrl={photoUrl}
          category={category}
        />
      </td>

      {/* Address */}
      <td className="px-6 py-4">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700 line-clamp-2">
            {restaurant.vicinity}
          </span>
        </div>
      </td>

      {/* Rating */}
      <td className="px-6 py-4">
        <RestaurantRatingCell
          rating={restaurant.rating}
          reviewCount={restaurant.user_ratings_total}
        />
      </td>

      {/* Price Level */}
      <td className="px-6 py-4">
        <Badge
          variant="success"
          icon={<DollarSign className="w-3 h-3" />}
          size="sm"
        >
          {getPriceLevelText(restaurant.price_level)}
        </Badge>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <RestaurantStatusCell
          businessStatus={restaurant.business_status}
          isOpen={restaurant.opening_hours?.open_now}
        />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewInMaps(restaurant);
          }}
          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-1.5" />
          View
        </button>
      </td>
    </tr>
  );
};
