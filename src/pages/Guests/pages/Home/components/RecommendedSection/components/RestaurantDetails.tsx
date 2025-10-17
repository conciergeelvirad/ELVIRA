/**
 * Restaurant Details Component
 *
 * Displays detailed restaurant information including:
 * - Rating and price level
 * - Contact information
 * - Opening hours
 * - Recent reviews
 */

import { Star, Clock, DollarSign } from "lucide-react";
import { CardRating } from "../../../../../components/common/CardRating";
import { ContactInfo } from "../../../../../components/common/ContactInfo";
import type { Restaurant } from "../../../../../../../services/googlePlaces.service";

interface RestaurantDetailsProps {
  restaurant: Restaurant;
}

export const RestaurantDetails = ({ restaurant }: RestaurantDetailsProps) => {
  return (
    <div className="mb-4 space-y-4">
      {/* Rating & Price Level */}
      {(restaurant.rating || restaurant.price_level) && (
        <div className="flex items-center gap-4">
          {restaurant.rating && (
            <CardRating
              rating={restaurant.rating}
              reviewCount={restaurant.user_ratings_total}
              size="md"
            />
          )}
          {restaurant.price_level && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                {"$".repeat(restaurant.price_level)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      <ContactInfo
        address={restaurant.formatted_address || restaurant.vicinity}
        phone={restaurant.formatted_phone_number}
        website={restaurant.website}
        name={restaurant.name}
        placeId={restaurant.place_id}
      />

      {/* Opening Hours */}
      {restaurant.opening_hours?.weekday_text && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Opening Hours
          </h4>
          <div className="space-y-1">
            {restaurant.opening_hours.weekday_text.map((day, idx) => (
              <p key={idx} className="text-xs text-gray-700">
                {day}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {restaurant.reviews && restaurant.reviews.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Recent Reviews
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {restaurant.reviews.slice(0, 3).map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {review.author_name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">
                      {review.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 line-clamp-3">
                  {review.text}
                </p>
                {review.relative_time_description && (
                  <span className="text-xs text-gray-500">
                    {review.relative_time_description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
