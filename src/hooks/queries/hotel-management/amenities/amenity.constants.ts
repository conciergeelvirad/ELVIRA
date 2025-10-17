/**
 * Amenity Query Constants
 *
 * Query keys and patterns for amenity-related queries.
 */

/**
 * Query key factory for amenity-related queries
 */
export const amenitiesKeys = {
  all: ["amenities"] as const,
  lists: () => [...amenitiesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...amenitiesKeys.lists(), { ...filters }] as const,
  details: () => [...amenitiesKeys.all, "detail"] as const,
  detail: (id: string) => [...amenitiesKeys.details(), id] as const,
  active: (hotelId: string) =>
    [...amenitiesKeys.all, "active", hotelId] as const,
  byCategory: (hotelId: string, category: string) =>
    [...amenitiesKeys.all, "category", hotelId, category] as const,
} as const;
