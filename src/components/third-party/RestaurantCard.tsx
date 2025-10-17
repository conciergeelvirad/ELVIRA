/**
 * Restaurant Card Component
 *
 * Wrapper around ThirdPartyCard that transforms Google Places data
 * into the generic ThirdPartyData format.
 *
 * This component now uses the shared generic system for consistency
 * across all third-party types (restaurants, tours, hotels, etc.)
 */

import { type Restaurant } from "../../services/googlePlaces.service";
import type { ApprovalStatus } from "../../types/approved-third-party-places";
import { ThirdPartyCard } from "./shared/ThirdPartyCard";
import type { ThirdPartyData } from "./shared/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onApprove?: (restaurant: Restaurant) => void;
  onReject?: (restaurant: Restaurant) => void;
  onView?: (restaurant: Restaurant) => void;
  onToggleRecommended?: (restaurant: Restaurant) => void;
  currentStatus?: ApprovalStatus | null;
  isRecommended?: boolean;
  isLoading?: boolean;
}

export const RestaurantCard = ({
  restaurant,
  onApprove,
  onReject,
  onView,
  onToggleRecommended,
  currentStatus,
  isRecommended = false,
}: RestaurantCardProps) => {
  // Transform Google Places restaurant data to generic ThirdPartyData format
  const genericData: ThirdPartyData = {
    id: restaurant.place_id,
    name: restaurant.name,
    type: "restaurant",
    rating: restaurant.rating,
    reviewCount: restaurant.user_ratings_total,
    location: {
      address: restaurant.vicinity || restaurant.formatted_address,
      latitude: restaurant.geometry.location.lat,
      longitude: restaurant.geometry.location.lng,
    },
    categories: restaurant.types,
    images: restaurant.photo_url ? [restaurant.photo_url] : undefined,
    price: restaurant.price_level
      ? {
          level: restaurant.price_level,
        }
      : undefined,
    status: {
      isApproved: currentStatus === "approved",
      isRecommended: isRecommended,
      isPending: currentStatus === "pending",
      isRejected: currentStatus === "rejected",
    },
    metadata: {
      openingHours: restaurant.opening_hours?.weekday_text,
      phone: restaurant.formatted_phone_number,
      website: restaurant.website,
      cuisine: restaurant.types?.filter(
        (t) => !t.includes("point_of_interest") && !t.includes("establishment")
      ),
    },
    googlePlaceId: restaurant.place_id,
  };

  return (
    <ThirdPartyCard
      {...genericData}
      onView={onView ? () => onView(restaurant) : undefined}
      onApprove={onApprove ? () => onApprove(restaurant) : undefined}
      onReject={onReject ? () => onReject(restaurant) : undefined}
      onRecommend={
        onToggleRecommended ? () => onToggleRecommended(restaurant) : undefined
      }
    />
  );
};
