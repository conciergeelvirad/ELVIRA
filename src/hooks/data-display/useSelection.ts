import { useState, useCallback } from 'react';

export interface UseSelectionReturn {
  selectedIds: Set<string | number>;
  isSelected: (id: string | number) => boolean;
  toggleSelect: (id: string | number) => void;
  selectAll: (ids: (string | number)[]) => void;
  clearSelection: () => void;
  selectRange: (startId: string | number, endId: string | number, allIds: (string | number)[]) => void;
  handleShiftSelect: (id: string | number, allIds: (string | number)[]) => void;
}

export const useSelection = (initialSelected: (string | number)[] = []): UseSelectionReturn => {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(initialSelected)
  );
  const [lastSelectedId, setLastSelectedId] = useState<string | number | null>(null);

  const isSelected = useCallback(
    (id: string | number) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleSelect = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setLastSelectedId(id);
  }, []);

  const selectAll = useCallback((ids: (string | number)[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  const selectRange = useCallback(
    (startId: string | number, endId: string | number, allIds: (string | number)[]) => {
      const startIndex = allIds.indexOf(startId);
      const endIndex = allIds.indexOf(endId);

      if (startIndex === -1 || endIndex === -1) return;

      const rangeStart = Math.min(startIndex, endIndex);
      const rangeEnd = Math.max(startIndex, endIndex);
      const rangeIds = allIds.slice(rangeStart, rangeEnd + 1);

      setSelectedIds((prev) => {
        const next = new Set(prev);
        rangeIds.forEach((id) => next.add(id));
        return next;
      });
    },
    []
  );

  const handleShiftSelect = useCallback(
    (id: string | number, allIds: (string | number)[]) => {
      if (lastSelectedId) {
        selectRange(lastSelectedId, id, allIds);
      } else {
        toggleSelect(id);
      }
    },
    [lastSelectedId, selectRange, toggleSelect]
  );

  return {
    selectedIds,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    selectRange,
    handleShiftSelect,
  };
};
