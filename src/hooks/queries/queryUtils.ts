/**
 * Reusable Query Utilities
 *
 * This file contains common patterns and utilities used across all query hooks
 * to reduce code duplication and maintain consistency.
 */

import type { Database } from "../../types/supabase";

// ============================================================================
// TYPE HELPERS
// ============================================================================

/**
 * Extract table row type from database
 */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/**
 * Extract table insert type from database
 */
export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

/**
 * Extract table update type from database
 */
export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

/**
 * Create standardized query keys for a resource
 *
 * @example
 * const staffKeys = createQueryKeys("staff");
 * staffKeys.all // ["staff"]
 * staffKeys.lists() // ["staff", "list"]
 * staffKeys.list(hotelId) // ["staff", "list", hotelId]
 * staffKeys.detail(id) // ["staff", "detail", id]
 */
export const createQueryKeys = <TResourceName extends string>(
  resourceName: TResourceName
) => ({
  all: [resourceName] as const,
  lists: () => [resourceName, "list"] as const,
  list: (hotelId: string) => [resourceName, "list", hotelId] as const,
  listWithFilters: (hotelId: string, filters: Record<string, unknown>) =>
    [resourceName, "list", hotelId, filters] as const,
  active: (hotelId: string) => [resourceName, "active", hotelId] as const,
  details: () => [resourceName, "detail"] as const,
  detail: (id: string) => [resourceName, "detail", id] as const,
  search: (hotelId: string, searchText: string) =>
    [resourceName, "search", hotelId, searchText] as const,
});

// ============================================================================
// COMMON QUERY OPTIONS
// ============================================================================

/**
 * Standard query options for enabled state
 */
export const createQueryOptions = {
  /**
   * Enable query when hotelId is provided
   */
  withHotelId: (hotelId: string | undefined) => ({
    enabled: !!hotelId,
  }),

  /**
   * Enable query when id is provided
   */
  withId: (id: string | undefined) => ({
    enabled: !!id,
  }),

  /**
   * Enable query when multiple conditions are met
   */
  withConditions: (...conditions: (string | boolean | undefined)[]) => ({
    enabled: conditions.every((condition) => !!condition),
  }),
};

// ============================================================================
// MUTATION HELPERS
// ============================================================================

/**
 * Standard mutation options for invalidating queries
 */
export const createMutationOptions = <
  T extends { hotel_id: string; id: string }
>(
  queryKeys: ReturnType<typeof createQueryKeys>,
  queryClient: {
    invalidateQueries: (options: { queryKey: readonly unknown[] }) => void;
  }
) => ({
  /**
   * Invalidate list queries after creating a resource
   */
  onCreateSuccess: (data: T) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.lists(),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.active(data.hotel_id),
    });
  },

  /**
   * Invalidate relevant queries after updating a resource
   */
  onUpdateSuccess: (data: T) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.lists(),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.active(data.hotel_id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.detail(data.id),
    });
  },

  /**
   * Invalidate all queries after deleting a resource
   */
  onDeleteSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.all,
    });
  },
});

// ============================================================================
// FILTER BUILDERS
// ============================================================================

/**
 * Build standard filters for queries
 */
export const buildFilters = {
  /**
   * Filter by hotel_id
   */
  byHotel: (hotelId: string) => ({
    hotel_id: hotelId,
  }),

  /**
   * Filter by active status
   */
  active: () => ({
    is_active: true,
  }),

  /**
   * Filter by hotel and active status
   */
  byHotelAndActive: (hotelId: string) => ({
    hotel_id: hotelId,
    is_active: true,
  }),

  /**
   * Filter by status field
   */
  byStatus: (status: string) => ({
    status,
  }),
};

// ============================================================================
// ORDER BUILDERS
// ============================================================================

/**
 * Build standard ordering for queries
 */
export const buildOrdering = {
  /**
   * Order by created_at descending (newest first)
   */
  newestFirst: { column: "created_at", ascending: false } as const,

  /**
   * Order by created_at ascending (oldest first)
   */
  oldestFirst: { column: "created_at", ascending: true } as const,

  /**
   * Order by name/title ascending (alphabetical)
   */
  alphabetical: (column: string) => ({ column, ascending: true } as const),

  /**
   * Order by updated_at descending (recently updated first)
   */
  recentlyUpdated: { column: "updated_at", ascending: false } as const,
};

// ============================================================================
// SEARCH HELPERS
// ============================================================================

/**
 * Build search conditions for Supabase
 */
export const buildSearchCondition = (
  searchText: string,
  ...fields: string[]
): string => {
  if (!searchText || fields.length === 0) return "";

  return fields.map((field) => `${field}.ilike.%${searchText}%`).join(",");
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Standard error handler for queries
 */
export const handleQueryError = (error: Error, context?: string) => {
  const message = context ? `${context}: ${error.message}` : error.message;

  console.error(message, error);
  throw error;
};

// ============================================================================
// TRANSFORMATION HELPERS
// ============================================================================

/**
 * Safely access nested array data (handle both array and single object)
 */
export const getFirstItem = <T>(data: T | T[] | undefined): T | undefined => {
  if (!data) return undefined;
  return Array.isArray(data) ? data[0] : data;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

/**
 * Truncate text to specified length
 */
export const truncateText = (
  text: string | null,
  maxLength: number
): string => {
  if (!text) return "-";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
