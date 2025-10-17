// Table layout utilities and constants

/**
 * Calculate column span for table cells based on features
 */
export const calculateTableColSpan = ({
  columnsLength,
  selectable = false,
  expandable = false,
  actionsColumn = false,
}: {
  columnsLength: number;
  selectable?: boolean;
  expandable?: boolean;
  actionsColumn?: boolean;
}): number => {
  let span = columnsLength;
  if (selectable) span += 1;
  if (expandable) span += 1;
  if (actionsColumn) span += 1;
  return span;
};

/**
 * Get table container classes
 */
export const getTableContainerClasses = (className?: string): string => {
  return `flex flex-col bg-white rounded-xl shadow overflow-hidden ${
    className || ""
  }`.trim();
};

/**
 * Get table wrapper classes for horizontal scrolling
 */
export const getTableWrapperClasses = (): string => {
  return "overflow-x-auto";
};

/**
 * Get base table classes
 */
export const getTableClasses = (): string => {
  return "w-full";
};

/**
 * Get table body classes
 */
export const getTableBodyClasses = (): string => {
  return "";
};

/**
 * Check if all rows are selected
 */
export const areAllRowsSelected = (
  rows: Array<{ id: string | number }>,
  selectedIds: Set<string | number>
): boolean => {
  return rows.length > 0 && rows.every((row) => selectedIds.has(row.id));
};

/**
 * Check if some but not all rows are selected
 */
export const areSomeRowsSelected = (
  rows: Array<{ id: string | number }>,
  selectedIds: Set<string | number>
): boolean => {
  const allSelected = areAllRowsSelected(rows, selectedIds);
  return rows.some((row) => selectedIds.has(row.id)) && !allSelected;
};

/**
 * Get all row IDs from rows array
 */
export const getAllRowIds = (
  rows: Array<{ id: string | number }>
): (string | number)[] => {
  return rows.map((row) => row.id);
};
