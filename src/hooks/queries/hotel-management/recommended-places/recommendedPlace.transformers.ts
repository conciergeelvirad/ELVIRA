/**
 * Recommended Places Transformers
 * Utility functions for data transformation and filtering
 */

import type {
  RecommendedPlace,
  RecommendedPlaceWithDetails,
} from "./recommendedPlace.types";

// ============================================================================
// FILTER & SEARCH
// ============================================================================

/**
 * Filter recommended places by search text
 * Searches in place_name and address fields
 */
export const filterBySearchText = (
  places: RecommendedPlace[] | RecommendedPlaceWithDetails[],
  searchText: string
): typeof places => {
  if (!searchText.trim()) return places;

  const lowerSearch = searchText.toLowerCase().trim();

  return places.filter((place) => {
    const matchesName = place.place_name.toLowerCase().includes(lowerSearch);
    const matchesAddress = place.address?.toLowerCase().includes(lowerSearch);

    return matchesName || matchesAddress;
  });
};

/**
 * Filter only active recommended places
 */
export const filterActiveOnly = (
  places: RecommendedPlace[] | RecommendedPlaceWithDetails[]
): typeof places => {
  return places.filter((place) => place.is_active);
};

// ============================================================================
// SORTING
// ============================================================================

/**
 * Sort recommended places by name (alphabetically)
 */
export const sortByName = (
  places: RecommendedPlace[] | RecommendedPlaceWithDetails[]
): typeof places => {
  return [...places].sort((a, b) => a.place_name.localeCompare(b.place_name));
};

/**
 * Sort recommended places by creation date (newest first)
 */
export const sortByNewest = (
  places: RecommendedPlace[] | RecommendedPlaceWithDetails[]
): typeof places => {
  return [...places].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

// ============================================================================
// DATA EXTRACTION
// ============================================================================

/**
 * Extract place names for dropdown/select options
 */
export const extractPlaceNames = (
  places: RecommendedPlace[] | RecommendedPlaceWithDetails[]
): string[] => {
  return places.map((place) => place.place_name);
};

/**
 * Get place by ID from a list
 */
export const getPlaceById = (
  places: RecommendedPlace[] | RecommendedPlaceWithDetails[],
  placeId: string
): (typeof places)[0] | undefined => {
  return places.find((place) => place.id === placeId);
};

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Format place address for display
 * Returns "N/A" if address is null/empty
 */
export const formatAddress = (place: RecommendedPlace): string => {
  return place.address || "N/A";
};

/**
 * Format place for display with name and address
 */
export const formatPlaceDisplay = (place: RecommendedPlace): string => {
  const address = place.address ? ` - ${place.address}` : "";
  return `${place.place_name}${address}`;
};
