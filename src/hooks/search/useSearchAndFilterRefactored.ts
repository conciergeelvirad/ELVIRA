import { useMemo, useCallback } from "react";
import { useSearch } from "./useSearch";
import { useFilter } from "./useFilter";
import { useViewMode } from "../ui/useViewMode";
import { useSorting } from "../data-display/useSorting";
import { filterBySearch, filterByField } from "../../utils/data/search";
import { sortByField } from "../../utils/data/sorting";
import {
  UseSearchAndFilterOptions,
  UseSearchAndFilterReturn,
} from "../../types/search";

/**
 * Comprehensive hook that combines search, filter, sort, and view mode functionality
 */
export const useSearchAndFilter = <T extends Record<string, unknown>>({
  data,
  searchFields,
  filterField,
  initialSearchTerm = "",
  defaultViewMode = "list",
  defaultSortBy = "",
  defaultSortDirection = "asc",
  customFilter,
  customSort,
}: UseSearchAndFilterOptions<T>): UseSearchAndFilterReturn<T> => {
  // Individual hooks for each concern
  const search = useSearch({
    data,
    searchFields,
    initialSearchTerm,
    customFilter: customFilter
      ? (item, searchTerm) => customFilter(item, searchTerm, "")
      : undefined,
  });

  const filter = useFilter({
    data: search.filteredData,
    filterField: filterField!,
    initialFilterValue: "",
  });

  const viewMode = useViewMode(defaultViewMode);

  const sorting = useSorting(
    filter.filteredData,
    defaultSortBy
      ? { key: defaultSortBy, direction: defaultSortDirection }
      : undefined
  );

  // Combined filtered data with all filters applied
  const combinedFilteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (search.searchTerm.trim()) {
      if (customFilter) {
        result = result.filter((item) =>
          customFilter(item, search.searchTerm, filter.filterValue)
        );
      } else {
        result = filterBySearch(result, search.searchTerm, searchFields);
      }
    }

    // Apply field filter
    if (filter.filterValue && filterField) {
      result = filterByField(result, filterField, filter.filterValue);
    }

    // Apply sorting
    if (sorting.sortConfig) {
      if (customSort) {
        result.sort((a, b) =>
          customSort(
            a,
            b,
            sorting.sortConfig!.key,
            sorting.sortConfig!.direction
          )
        );
      } else {
        result = sortByField(
          result,
          sorting.sortConfig.key,
          sorting.sortConfig.direction
        );
      }
    }

    return result;
  }, [
    data,
    search.searchTerm,
    filter.filterValue,
    filterField,
    sorting.sortConfig,
    searchFields,
    customFilter,
    customSort,
  ]);

  // Actions
  const toggleSort = useCallback(
    (field: string) => {
      sorting.requestSort(field);
    },
    [sorting]
  );

  const setSortBy = useCallback(
    (field: string) => {
      sorting.requestSort(field);
    },
    [sorting]
  );

  const setSortDirection = useCallback(
    (direction: "asc" | "desc") => {
      if (sorting.sortConfig) {
        sorting.requestSort(sorting.sortConfig.key);
        if (sorting.sortConfig.direction !== direction) {
          sorting.requestSort(sorting.sortConfig.key);
        }
      }
    },
    [sorting]
  );

  const clearAll = useCallback(() => {
    search.clearSearch();
    filter.clearFilter();
    sorting.clearSort();
  }, [search, filter, sorting]);

  const reset = useCallback(() => {
    clearAll();
    viewMode.setViewMode(defaultViewMode);
  }, [clearAll, viewMode, defaultViewMode]);

  // Derived state
  const hasActiveFilters = Boolean(
    search.searchTerm.trim() || filter.filterValue
  );

  return {
    // State
    searchTerm: search.searchTerm,
    isActive: search.isActive,
    filterValue: filter.filterValue,
    mode: viewMode.mode,
    sortBy: sorting.sortConfig?.key || "",
    sortDirection: sorting.sortConfig?.direction || "asc",

    // Actions
    setSearchTerm: search.setSearchTerm,
    clearSearch: search.clearSearch,
    setFilterValue: filter.setFilterValue,
    toggleFilter: filter.toggleFilter,
    clearFilter: filter.clearFilter,
    setViewMode: viewMode.setViewMode,
    toggleViewMode: viewMode.toggleViewMode,
    setSortBy,
    setSortDirection,
    toggleSort,
    clearAll,
    reset,

    // Computed values
    filteredData: combinedFilteredData,
    totalItems: combinedFilteredData.length,
    hasResults: combinedFilteredData.length > 0,
    filterOptions: filter.filterOptions,
    hasActiveFilters,
  };
};

// Simplified hook aliases for common use cases
export const useSimpleSearch = <T extends Record<string, unknown>>(
  data: T[],
  searchFields: (keyof T)[],
  initialSearchTerm = ""
) => {
  return useSearch({
    data,
    searchFields,
    initialSearchTerm,
  });
};
