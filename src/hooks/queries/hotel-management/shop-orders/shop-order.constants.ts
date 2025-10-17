/**
 * Shop Order Constants
 *
 * Query keys and constant values for shop orders management.
 */

// ============================================================================
// Query Keys
// ============================================================================

/**
 * Factory for generating shop order query keys
 * Follows React Query best practices for key structure
 */
export const shopOrderKeys = {
  all: ["shop-orders"] as const,
  lists: () => [...shopOrderKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...shopOrderKeys.lists(), { ...filters }] as const,
  details: () => [...shopOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...shopOrderKeys.details(), id] as const,
};

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";
