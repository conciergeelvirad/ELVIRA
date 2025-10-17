import { useState, useMemo } from "react";
import { filterBySearch } from "../../utils/data/search";
import { UseSearchOptions, UseSearchReturn } from "../../types/search";

/**
 * Hook for simple text search functionality
 */
export const useSearch = <T extends Record<string, unknown>>({
  data,
  searchFields,
  initialSearchTerm = "",
  customFilter,
}: UseSearchOptions<T>): UseSearchReturn<T> => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    if (customFilter) {
      return data.filter((item) => customFilter(item, searchTerm));
    }

    return filterBySearch(data, searchTerm, searchFields);
  }, [data, searchTerm, searchFields, customFilter]);

  const clearSearch = () => setSearchTerm("");

  return {
    searchTerm,
    isActive: Boolean(searchTerm.trim()),
    filteredData,
    totalItems: filteredData.length,
    hasResults: filteredData.length > 0,
    setSearchTerm,
    clearSearch,
  };
};
