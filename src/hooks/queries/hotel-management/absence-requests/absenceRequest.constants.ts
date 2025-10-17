/**
 * Absence Request Constants
 *
 * Contains query keys, default values, and other constants.
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query keys for absence requests caching and invalidation
 *
 * @example
 * ```ts
 * absenceRequestKeys.all                      // ["absence-requests"]
 * absenceRequestKeys.lists()                  // ["absence-requests", "list"]
 * absenceRequestKeys.list({ hotelId: "..." }) // ["absence-requests", "list", { hotelId: "..." }]
 * absenceRequestKeys.detail("request-id")     // ["absence-requests", "detail", "request-id"]
 * ```
 */
export const absenceRequestKeys = {
  all: ["absence-requests"] as const,
  lists: () => [...absenceRequestKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...absenceRequestKeys.lists(), { ...filters }] as const,
  details: () => [...absenceRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...absenceRequestKeys.details(), id] as const,
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default hotel ID (temporary - should come from context)
 */
export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

// ============================================================================
// SUPABASE SELECT PATTERNS
// ============================================================================

/**
 * Standard select pattern for absence requests with staff data
 */
export const ABSENCE_REQUEST_WITH_STAFF_SELECT = `
  *,
  staff:hotel_staff!staff_id (
    id,
    employee_id,
    position,
    department,
    hotel_staff_personal_data (
      first_name,
      last_name,
      email,
      phone_number,
      avatar_url
    )
  )
`;
