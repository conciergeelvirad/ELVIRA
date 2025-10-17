import { useState, useMemo } from "react";
import { filterByField, generateFilterOptions } from "../../utils/data/search";
import { UseFilterOptions, UseFilterReturn } from "../../types/search";

/**
 * Hook for field-based filtering functionality
 */
export const useFilter = <T extends Record<string, unknown>>({
  data,
  filterField,
  initialFilterValue = "",
}: UseFilterOptions<T>): UseFilterReturn<T> => {
  const [filterValue, setFilterValue] = useState(initialFilterValue);
  const [isActive, setIsActive] = useState(false);

  const filteredData = useMemo(() => {
    return filterByField(data, filterField, filterValue);
  }, [data, filterField, filterValue]);

  const filterOptions = useMemo(() => {
    return generateFilterOptions(data, filterField);
  }, [data, filterField]);

  const toggleFilter = () => setIsActive((prev) => !prev);

  const clearFilter = () => {
    setFilterValue("");
    setIsActive(false);
  };

  return {
    filterValue,
    isActive,
    filteredData,
    totalItems: filteredData.length,
    hasResults: filteredData.length > 0,
    filterOptions,
    setFilterValue,
    toggleFilter,
    clearFilter,
  };
};
