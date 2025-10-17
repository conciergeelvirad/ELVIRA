/**
 * Third Party Places Utility Functions
 *
 * Helper functions for working with third-party places data.
 */

import type { Restaurant } from "../../services/googlePlaces.service";
import type { AmadeusActivity } from "../../services/amadeus/types";
import type {
  ApprovedThirdPartyPlace,
  ApprovalStatus,
} from "../../types/approved-third-party-places";

// ============================================================================
// APPROVAL STATUS HELPERS
// ============================================================================

/**
 * Get the approval status for a restaurant
 *
 * @param placeId - Google Place ID
 * @param approvedPlaces - Array of approved/rejected places
 * @returns The approval status ('pending', 'approved', 'rejected')
 */
export const getApprovalStatus = (
  placeId: string,
  approvedPlaces: ApprovedThirdPartyPlace[]
): ApprovalStatus => {
  const approved = approvedPlaces.find((ap) => ap.place_id === placeId);
  return approved?.status || "pending";
};

/**
 * Check if a place is recommended
 *
 * @param placeId - Google Place ID
 * @param approvedPlaces - Array of approved/rejected places
 * @returns True if the place is marked as recommended
 */
export const isRecommended = (
  placeId: string,
  approvedPlaces: ApprovedThirdPartyPlace[]
): boolean => {
  const place = approvedPlaces.find(
    (ap) => ap.place_id === placeId && ap.status === "approved"
  );
  return place?.recommended || false;
};

/**
 * Check if a place is approved
 */
export const isApproved = (
  placeId: string,
  approvedPlaces: ApprovedThirdPartyPlace[]
): boolean => {
  return getApprovalStatus(placeId, approvedPlaces) === "approved";
};

/**
 * Check if a place is rejected
 */
export const isRejected = (
  placeId: string,
  approvedPlaces: ApprovedThirdPartyPlace[]
): boolean => {
  return getApprovalStatus(placeId, approvedPlaces) === "rejected";
};

/**
 * Check if a place is pending
 */
export const isPending = (
  placeId: string,
  approvedPlaces: ApprovedThirdPartyPlace[]
): boolean => {
  return getApprovalStatus(placeId, approvedPlaces) === "pending";
};

// ============================================================================
// PLACE TYPE HELPERS
// ============================================================================

/**
 * Get the primary place type from a restaurant's types array
 *
 * Priority order: restaurant > bar > cafe > night_club > other
 *
 * @param types - Array of place types from Google Places
 * @returns The primary place type
 */
export const getPlaceType = (types: string[] = []): string => {
  // Type mappings for special cases
  const typeMapping: Record<string, string> = {
    travel_agency: "tour_agency",
    tourist_attraction: "tour_agency",
    gym: "gym",
    health: "gym",
    fitness: "gym",
  };

  // Priority types in order of preference
  const priorityTypes = [
    "restaurant",
    "bar",
    "cafe",
    "night_club",
    "tour_agency",
    "gym",
  ];

  // First check for mapped types
  for (const type of types) {
    const mappedType = typeMapping[type];
    if (mappedType) {
      return mappedType;
    }
  }

  // Then check for direct matches with priority types
  for (const priorityType of priorityTypes) {
    if (types.includes(priorityType)) {
      return priorityType;
    }
  }

  // Default fallback
  return types[0] || "establishment";
};

/**
 * Get display label for place type
 */
export const getPlaceTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    restaurant: "🍽️ Restaurant",
    bar: "🍺 Bar",
    cafe: "☕ Cafe",
    night_club: "🎵 Night Club",
    tour_agency: "🎯 Tour Agency",
    gym: "💪 Gym",
    establishment: "📍 Establishment",
  };

  return labels[type] || `📍 ${type}`;
};

// ============================================================================
// FILTERING HELPERS
// ============================================================================

export interface FilterCriteria {
  selectedTypes: string[];
  selectedStatuses: ApprovalStatus[];
  minRating: number;
  selectedPriceLevels: number[];
  showRecommendedOnly: boolean;
}

/**
 * Filter restaurants based on multiple criteria
 *
 * @param restaurants - Array of restaurants to filter
 * @param approvedPlaces - Array of approved/rejected places
 * @param criteria - Filter criteria
 * @returns Filtered array of restaurants
 */
export const filterRestaurants = (
  restaurants: Restaurant[],
  approvedPlaces: ApprovedThirdPartyPlace[],
  criteria: FilterCriteria
): Restaurant[] => {
  const {
    selectedTypes,
    selectedStatuses,
    minRating,
    selectedPriceLevels,
    showRecommendedOnly,
  } = criteria;

  const filterActive =
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    minRating > 0 ||
    selectedPriceLevels.length > 0 ||
    showRecommendedOnly;

  return restaurants.filter((restaurant) => {
    // Type filter
    const placeType = getPlaceType(restaurant.types);
    const matchesType =
      !filterActive ||
      selectedTypes.length === 0 ||
      selectedTypes.includes(placeType);

    // Status filter
    const status = getApprovalStatus(restaurant.place_id, approvedPlaces);
    const matchesStatus =
      !filterActive ||
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(status);

    // Rating filter
    const matchesRating =
      !filterActive || (restaurant.rating || 0) >= minRating;

    // Price level filter
    const matchesPriceLevel =
      !filterActive ||
      selectedPriceLevels.length === 0 ||
      !restaurant.price_level ||
      selectedPriceLevels.includes(restaurant.price_level);

    // Recommended filter
    const recommended = isRecommended(restaurant.place_id, approvedPlaces);
    const matchesRecommended =
      !filterActive || !showRecommendedOnly || recommended;

    return (
      matchesType &&
      matchesStatus &&
      matchesRating &&
      matchesPriceLevel &&
      matchesRecommended
    );
  });
};

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Format rating for display
 */
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)} ⭐`;
};

/**
 * Format price level for display
 */
export const formatPriceLevel = (priceLevel: number): string => {
  const symbols = "€".repeat(priceLevel);
  return symbols;
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: ApprovalStatus): string => {
  const colors: Record<ApprovalStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get status icon
 */
export const getStatusIcon = (status: ApprovalStatus): string => {
  const icons: Record<ApprovalStatus, string> = {
    pending: "⏳",
    approved: "✅",
    rejected: "❌",
  };

  return icons[status] || "❓";
};

// ============================================================================
// SORTING HELPERS
// ============================================================================

export type SortOption = "rating" | "distance" | "name" | "price";

/**
 * Sort restaurants by specified criteria
 *
 * @param restaurants - Array of restaurants to sort
 * @param sortBy - Sort criteria
 * @param ascending - Sort direction
 * @returns Sorted array of restaurants
 */
export const sortRestaurants = (
  restaurants: Restaurant[],
  sortBy: SortOption = "rating",
  ascending: boolean = false
): Restaurant[] => {
  const sorted = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);

      case "distance":
        // Distance sorting - would need to be calculated separately
        return 0;

      case "name":
        return a.name.localeCompare(b.name);

      case "price":
        return (a.price_level || 0) - (b.price_level || 0);

      default:
        return 0;
    }
  });

  return ascending ? sorted.reverse() : sorted;
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Check if a restaurant has valid coordinates
 */
export const hasValidCoordinates = (restaurant: Restaurant): boolean => {
  return Boolean(
    restaurant.geometry?.location?.lat &&
      restaurant.geometry?.location?.lng &&
      !isNaN(restaurant.geometry.location.lat) &&
      !isNaN(restaurant.geometry.location.lng)
  );
};

/**
 * Check if a restaurant has minimum required data
 */
export const hasMinimumData = (restaurant: Restaurant): boolean => {
  return Boolean(
    restaurant.place_id && restaurant.name && hasValidCoordinates(restaurant)
  );
};

/**
 * Converts an AmadeusActivity (tour) to Restaurant format
 * This allows tours to be processed using the same approval system as restaurants
 */
export const convertTourToRestaurant = (tour: AmadeusActivity): Restaurant => ({
  place_id: tour.id,
  name: tour.name,
  vicinity: tour.shortDescription || "",
  types: ["travel_agency", "point_of_interest"],
  geometry: {
    location: {
      lat: tour.geoCode.latitude,
      lng: tour.geoCode.longitude,
    },
  },
  rating: tour.rating,
  user_ratings_total: 0,
  photos: tour.pictures?.map((url) => ({
    photo_reference: url,
    height: 400,
    width: 600,
  })),
});
