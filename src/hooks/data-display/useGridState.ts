import { useState, useCallback } from "react";

export interface GridSelectionState {
  selectedIds: Set<string | number>;
  isSelected: (id: string | number) => boolean;
  select: (id: string | number) => void;
  deselect: (id: string | number) => void;
  toggle: (id: string | number) => void;
  selectAll: (ids: (string | number)[]) => void;
  deselectAll: () => void;
  getSelectedCount: () => number;
}

export interface GridExpansionState {
  expandedIds: Set<string | number>;
  isExpanded: (id: string | number) => boolean;
  expand: (id: string | number) => void;
  collapse: (id: string | number) => void;
  toggle: (id: string | number) => void;
  collapseAll: () => void;
}

export interface GridEditState {
  editingId: string | number | null;
  isEditing: (id: string | number) => boolean;
  startEdit: (id: string | number) => void;
  cancelEdit: () => void;
}

/**
 * Hook for managing grid selection state
 */
export const useGridSelection = (
  initialSelected: Set<string | number> = new Set()
): GridSelectionState => {
  const [selectedIds, setSelectedIds] = useState(initialSelected);

  const isSelected = useCallback(
    (id: string | number) => selectedIds.has(id),
    [selectedIds]
  );

  const select = useCallback((id: string | number) => {
    setSelectedIds((prev) => new Set(prev).add(id));
  }, []);

  const deselect = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const toggle = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((ids: (string | number)[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedCount = useCallback(() => selectedIds.size, [selectedIds]);

  return {
    selectedIds,
    isSelected,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    getSelectedCount,
  };
};

/**
 * Hook for managing grid expansion state
 */
export const useGridExpansion = (
  initialExpanded: Set<string | number> = new Set()
): GridExpansionState => {
  const [expandedIds, setExpandedIds] = useState(initialExpanded);

  const isExpanded = useCallback(
    (id: string | number) => expandedIds.has(id),
    [expandedIds]
  );

  const expand = useCallback((id: string | number) => {
    setExpandedIds((prev) => new Set(prev).add(id));
  }, []);

  const collapse = useCallback((id: string | number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const toggle = useCallback((id: string | number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return {
    expandedIds,
    isExpanded,
    expand,
    collapse,
    toggle,
    collapseAll,
  };
};

/**
 * Hook for managing grid edit state
 */
export const useGridEdit = (
  initialEditingId: string | number | null = null
): GridEditState => {
  const [editingId, setEditingId] = useState(initialEditingId);

  const isEditing = useCallback(
    (id: string | number) => editingId === id,
    [editingId]
  );

  const startEdit = useCallback((id: string | number) => {
    setEditingId(id);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  return {
    editingId,
    isEditing,
    startEdit,
    cancelEdit,
  };
};
