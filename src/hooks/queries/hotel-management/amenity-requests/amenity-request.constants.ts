/**
 * Amenity Request Constants
 *
 * Query keys and constant values for amenity requests management.
 */

// ============================================================================
// Query Keys
// ============================================================================

/**
 * Factory for generating amenity request query keys
 * Follows React Query best practices for key structure
 */
export const amenityRequestKeys = {
  all: ["amenity-requests"] as const,
  lists: () => [...amenityRequestKeys.all, "list"] as const,
  list: (hotelId: string) => [...amenityRequestKeys.lists(), hotelId] as const,
  details: () => [...amenityRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...amenityRequestKeys.details(), id] as const,
};

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";
