import { useState, useCallback, useMemo } from "react";
import { SortConfig } from "../../types/table";
import { getNestedValue, compareValues } from "../../utils/data/sorting";

export interface UseSortingReturn<T> {
  sortConfig: SortConfig | null;
  sortedData: T[];
  requestSort: (key: string) => void;
  clearSort: () => void;
}

export const useSorting = <T extends Record<string, any>>(
  data: T[],
  defaultSort?: SortConfig
): UseSortingReturn<T> => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    defaultSort || null
  );

  const requestSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
      return compareValues(aValue, bValue, sortConfig.direction);
    });

    return sorted;
  }, [data, sortConfig]);

  return {
    sortConfig,
    sortedData,
    requestSort,
    clearSort,
  };
};
