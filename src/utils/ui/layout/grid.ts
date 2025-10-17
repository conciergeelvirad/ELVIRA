// Grid layout utilities and constants

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;
export type GridGap = "sm" | "md" | "lg";

export const GRID_COLS_MAP: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

export const GAP_MAP: Record<GridGap, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

/**
 * Get responsive grid classes for specified columns
 */
export const getGridClasses = (columns: GridColumns): string => {
  return GRID_COLS_MAP[columns];
};

/**
 * Get gap classes for specified spacing
 */
export const getGapClasses = (gap: GridGap): string => {
  return GAP_MAP[gap];
};

/**
 * Get complete grid layout classes
 */
export const getGridLayoutClasses = (
  columns: GridColumns,
  gap: GridGap = "md"
): string => {
  return `grid ${getGridClasses(columns)} ${getGapClasses(gap)}`;
};

/**
 * Calculate the number of skeleton items to show for loading state
 */
export const getSkeletonCount = (
  columns: GridColumns,
  rows: number = 2
): number => {
  return columns * rows;
};
