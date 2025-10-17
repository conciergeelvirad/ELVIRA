/**
 * Restaurant List Component
 *
 * Displays a list of nearby restaurants from Google Places API
 */

import React from "react";
import { MapPin, Star, Clock, DollarSign, ExternalLink } from "lucide-react";
import { Badge, StatusBadge } from "../common";

// Restaurant type definition (matches Google Places API response)
export interface Restaurant {
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

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
}) => {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No restaurants found in this area
      </div>
    );
  }

  const getPriceLevelText = (level?: number): string => {
    if (!level) return "Price not available";
    return "$".repeat(level);
  };

  const openInGoogleMaps = (restaurant: Restaurant) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      restaurant.name
    )}&query_place_id=${restaurant.place_id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.place_id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          {/* Restaurant Image */}
          {restaurant.photos && restaurant.photos.length > 0 ? (
            <img
              src={restaurant.photos[0].photo_reference}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Restaurant Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {restaurant.name}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex items-start">
              <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
              {restaurant.vicinity}
            </p>

            {/* Rating and Status */}
            <div className="flex items-center justify-between mb-3">
              {restaurant.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {restaurant.rating.toFixed(1)}
                  </span>
                  {restaurant.user_ratings_total && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({restaurant.user_ratings_total})
                    </span>
                  )}
                </div>
              )}

              {restaurant.opening_hours?.open_now !== undefined && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span
                    className={`text-xs font-medium ${
                      restaurant.opening_hours.open_now
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {restaurant.opening_hours.open_now ? "Open" : "Closed"}
                  </span>
                </div>
              )}
            </div>

            {/* Price Level */}
            {restaurant.price_level && (
              <div className="flex items-center mb-3">
                <Badge
                  variant="success"
                  icon={<DollarSign className="w-3 h-3" />}
                  size="xs"
                >
                  {getPriceLevelText(restaurant.price_level)}
                </Badge>
              </div>
            )}

            {/* Business Status */}
            {restaurant.business_status && (
              <div className="mb-3">
                <StatusBadge
                  status={
                    restaurant.business_status === "OPERATIONAL"
                      ? "active"
                      : "inactive"
                  }
                  label={restaurant.business_status}
                  variant="soft"
                  size="sm"
                />
              </div>
            )}

            {/* View on Google Maps Button */}
            <button
              onClick={() => openInGoogleMaps(restaurant)}
              className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Google Maps
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
