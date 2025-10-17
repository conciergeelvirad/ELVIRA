/**
 * Recommended Places Constants
 * Query keys and Supabase select patterns
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query key factory for recommended places
 * Follows React Query best practices for cache management
 */
export const recommendedPlacesKeys = {
  all: ["recommended-places"] as const,
  lists: () => [...recommendedPlacesKeys.all, "list"] as const,
  list: (hotelId: string) =>
    [...recommendedPlacesKeys.lists(), hotelId] as const,
  active: (hotelId: string) =>
    [...recommendedPlacesKeys.all, "active", hotelId] as const,
  details: () => [...recommendedPlacesKeys.all, "detail"] as const,
  detail: (id: string) => [...recommendedPlacesKeys.details(), id] as const,
  search: (hotelId: string, searchText: string) =>
    [...recommendedPlacesKeys.list(hotelId), "search", searchText] as const,
};

// ============================================================================
// SUPABASE SELECT PATTERNS
// ============================================================================

/**
 * Select pattern for recommended places with joined profile and hotel data
 */
export const RECOMMENDED_PLACE_WITH_DETAILS_SELECT = `
  *,
  created_by_profile:profiles!hotel_recommended_places_created_by_fkey(
    id,
    email
  ),
  hotels!hotel_recommended_places_hotel_id_fkey(
    id,
    hotel_name
  )
`;

/**
 * Simple select pattern for recommended places (all columns, no joins)
 */
export const RECOMMENDED_PLACE_SIMPLE_SELECT = "*";
