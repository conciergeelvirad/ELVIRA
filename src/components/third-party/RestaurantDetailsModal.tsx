/**
 * Restaurant Details Modal
 *
 * Displays comprehensive information about a restaurant from Google Places
 * Refactored to use smaller, reusable components
 */

import { Modal, ModalBody, ModalFooter } from "../common/ui/Modal";
import { Restaurant } from "../../services/googlePlaces.service";
import { LoadingSpinner } from "../common";
import { ExternalLink } from "lucide-react";
import {
  RestaurantPhotosGallery,
  RestaurantRatingDisplay,
  RestaurantBasicInfo,
  RestaurantServiceOptions,
  RestaurantFoodBeverage,
  RestaurantCategories,
  RestaurantReviews,
  RestaurantAccessibility,
  RestaurantCoordinates,
} from "./restaurant-details";

interface RestaurantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  isLoadingDetails?: boolean;
}

export const RestaurantDetailsModal = ({
  isOpen,
  onClose,
  restaurant,
  isLoadingDetails = false,
}: RestaurantDetailsModalProps) => {
  if (!restaurant) return null;

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      restaurant.name
    )}&query_place_id=${restaurant.place_id}`;
    window.open(url, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={restaurant.name} size="xl">
      <ModalBody>
        {isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" color="primary" />
            <span className="mt-3 text-gray-600 text-lg">
              Loading detailed information...
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Photos Gallery */}
            {restaurant.photos && restaurant.photos.length > 0 && (
              <RestaurantPhotosGallery
                photos={restaurant.photos}
                restaurantName={restaurant.name}
              />
            )}

            {/* Rating and Reviews Summary */}
            {restaurant.rating && (
              <RestaurantRatingDisplay
                rating={restaurant.rating}
                totalReviews={restaurant.user_ratings_total}
              />
            )}

            {/* Basic Information */}
            <RestaurantBasicInfo
              formattedAddress={restaurant.formatted_address}
              vicinity={restaurant.vicinity}
              formattedPhoneNumber={restaurant.formatted_phone_number}
              internationalPhoneNumber={restaurant.international_phone_number}
              website={restaurant.website}
              priceLevel={restaurant.price_level}
              openingHours={restaurant.opening_hours}
              businessStatus={restaurant.business_status}
            />

            {/* Service Options */}
            <RestaurantServiceOptions
              dineIn={restaurant.dine_in}
              takeout={restaurant.takeout}
              delivery={restaurant.delivery}
              reservable={restaurant.reservable}
            />

            {/* Food & Beverage */}
            <RestaurantFoodBeverage
              servesBreakfast={restaurant.serves_breakfast}
              servesLunch={restaurant.serves_lunch}
              servesDinner={restaurant.serves_dinner}
              servesBeer={restaurant.serves_beer}
              servesWine={restaurant.serves_wine}
              servesVegetarianFood={restaurant.serves_vegetarian_food}
            />

            {/* Categories/Types */}
            {restaurant.types && (
              <RestaurantCategories types={restaurant.types} />
            )}

            {/* Customer Reviews */}
            {restaurant.reviews && restaurant.reviews.length > 0 && (
              <RestaurantReviews reviews={restaurant.reviews} />
            )}

            {/* Accessibility */}
            <RestaurantAccessibility
              wheelchairAccessibleEntrance={
                restaurant.wheelchair_accessible_entrance
              }
            />

            {/* Location Coordinates */}
            <RestaurantCoordinates location={restaurant.geometry.location} />
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-between w-full">
          <button
            onClick={openInGoogleMaps}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Google Maps
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
