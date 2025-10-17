/**
 * Emergency Contact Query Constants
 *
 * Query keys for emergency contact-related queries.
 */

/**
 * Default hotel ID (temporary - should be passed as parameter)
 */
export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

/**
 * Query key factory for emergency contact-related queries
 */
export const emergencyContactKeys = {
  all: ["emergency_contacts"] as const,
  lists: () => [...emergencyContactKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...emergencyContactKeys.lists(), { ...filters }] as const,
  details: () => [...emergencyContactKeys.all, "detail"] as const,
  detail: (id: string) => [...emergencyContactKeys.details(), id] as const,
  byCategory: (hotelId: string, category: string) =>
    [...emergencyContactKeys.all, "category", hotelId, category] as const,
} as const;
