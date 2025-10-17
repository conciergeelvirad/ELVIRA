import { useState, useCallback } from "react";
import { ViewModeState, ViewModeActions } from "../../types/search";

export interface UseViewModeReturn extends ViewModeState, ViewModeActions {
  isGridView: boolean;
  isListView: boolean;
}

/**
 * Hook for managing view mode (grid/list) state
 */
export const useViewMode = (
  defaultMode: "grid" | "list" = "list"
): UseViewModeReturn => {
  const [mode, setViewMode] = useState<"grid" | "list">(defaultMode);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  return {
    mode,
    setViewMode,
    toggleViewMode,
    isGridView: mode === "grid",
    isListView: mode === "list",
  };
};
