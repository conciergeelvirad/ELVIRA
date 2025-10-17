/**
 * Debounced Value Hook
 *
 * Delays updating a value until after a specified delay.
 * Useful for search inputs to prevent excessive API calls.
 */

import { useEffect, useState } from "react";

/**
 * Returns a debounced version of the provided value
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 *
 * @example
 * ```tsx
 * const [searchText, setSearchText] = useState("");
 * const debouncedSearch = useDebouncedValue(searchText, 300);
 *
 * // Only queries after 300ms of no typing
 * const { data } = useSearch(debouncedSearch);
 * ```
 */
export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
