import { useCallback } from "react";
import { useSelection } from "./useSelection";
import { useSorting } from "./useSorting";
import {
  areAllRowsSelected,
  areSomeRowsSelected,
  getAllRowIds,
} from "../../utils/ui/layout/table";
import { SortConfig } from "../../types/table";

export interface TableSelectionState {
  selectedIds: Set<string | number>;
  allSelected: boolean;
  someSelected: boolean;
  handleSelectAll: () => void;
  handleSelectRow: (id: string | number) => void;
}

export interface UseTableStateOptions<T> {
  data: T[];
  rows: Array<{ id: string | number }>;
  onSelectChange?: (id: string | number) => void;
  onSelectAll?: (ids: (string | number)[]) => void;
  defaultSort?: SortConfig;
}

export interface UseTableStateReturn<T> extends TableSelectionState {
  sortConfig: SortConfig | null;
  sortedData: T[];
  requestSort: (key: string) => void;
  clearSort: () => void;
}

/**
 * Hook for managing table state (selection, sorting)
 */
export const useTableState = <T extends Record<string, unknown>>({
  data,
  rows,
  onSelectChange,
  onSelectAll,
  defaultSort,
}: UseTableStateOptions<T>): UseTableStateReturn<T> => {
  // Use existing selection hook
  const selection = useSelection();

  // Use existing sorting hook with actual data
  const sorting = useSorting(data, defaultSort);

  // Derive selection state
  const allSelected = areAllRowsSelected(rows, selection.selectedIds);
  const someSelected = areSomeRowsSelected(rows, selection.selectedIds);

  // Handle select all functionality
  const handleSelectAll = useCallback(() => {
    const allRowIds = getAllRowIds(rows);
    if (onSelectAll) {
      if (allSelected) {
        onSelectAll([]);
        selection.clearSelection();
      } else {
        onSelectAll(allRowIds);
        selection.selectAll(allRowIds);
      }
    } else {
      if (allSelected) {
        selection.clearSelection();
      } else {
        selection.selectAll(allRowIds);
      }
    }
  }, [allSelected, rows, onSelectAll, selection]);

  // Handle individual row selection
  const handleSelectRow = useCallback(
    (id: string | number) => {
      selection.toggleSelect(id);
      if (onSelectChange) {
        onSelectChange(id);
      }
    },
    [selection, onSelectChange]
  );

  return {
    // Selection state
    selectedIds: selection.selectedIds,
    allSelected,
    someSelected,
    handleSelectAll,
    handleSelectRow,

    // Sorting state
    sortConfig: sorting.sortConfig,
    sortedData: sorting.sortedData,
    requestSort: sorting.requestSort,
    clearSort: sorting.clearSort,
  };
};
