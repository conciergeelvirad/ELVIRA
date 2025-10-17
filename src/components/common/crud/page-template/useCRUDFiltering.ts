/**
 * Custom hook for CRUD filtering logic
 *
 * Handles search query filtering across all item properties.
 */

import { useMemo } from "react";

/**
 * Hook to filter data based on search query
 *
 * @param data - The array of items to filter
 * @param searchQuery - The search string to filter by
 * @returns Filtered array of items
 *
 * @example
 * ```tsx
 * const filteredData = useCRUDFiltering(items, searchQuery);
 * ```
 */
export const useCRUDFiltering = <T extends Record<string, unknown>>(
  data: T[],
  searchQuery: string
): T[] => {
  return useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item: T) =>
      Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(query)
      )
    );
  }, [data, searchQuery]);
};
