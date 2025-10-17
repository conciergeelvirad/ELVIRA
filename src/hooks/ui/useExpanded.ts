import { useState, useCallback } from 'react';

export interface UseExpandedReturn {
  expandedIds: Set<string | number>;
  isExpanded: (id: string | number) => boolean;
  toggleExpanded: (id: string | number) => void;
  expandAll: (ids: (string | number)[]) => void;
  collapseAll: () => void;
}

export const useExpanded = (
  initialExpanded: (string | number)[] = [],
  singleExpand: boolean = false
): UseExpandedReturn => {
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(
    new Set(initialExpanded)
  );

  const isExpanded = useCallback(
    (id: string | number) => expandedIds.has(id),
    [expandedIds]
  );

  const toggleExpanded = useCallback(
    (id: string | number) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);

        if (next.has(id)) {
          next.delete(id);
        } else {
          if (singleExpand) {
            return new Set([id]);
          }
          next.add(id);
        }

        return next;
      });
    },
    [singleExpand]
  );

  const expandAll = useCallback((ids: (string | number)[]) => {
    if (singleExpand) return;
    setExpandedIds(new Set(ids));
  }, [singleExpand]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return {
    expandedIds,
    isExpanded,
    toggleExpanded,
    expandAll,
    collapseAll,
  };
};
