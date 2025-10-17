export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split(".").reduce((current: unknown, key: string) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

type SortDirection = "asc" | "desc";

export const compareStrings = (
  a: string,
  b: string,
  direction: SortDirection
): number => {
  return direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);
};

export const compareNumbers = (
  a: number,
  b: number,
  direction: SortDirection
): number => {
  return direction === "asc" ? a - b : b - a;
};

export const compareDates = (
  a: Date,
  b: Date,
  direction: SortDirection
): number => {
  return direction === "asc"
    ? a.getTime() - b.getTime()
    : b.getTime() - a.getTime();
};

export const compareValues = (
  aValue: unknown,
  bValue: unknown,
  direction: SortDirection
): number => {
  if (aValue === null || aValue === undefined) return 1;
  if (bValue === null || bValue === undefined) return -1;

  if (typeof aValue === "string" && typeof bValue === "string") {
    return compareStrings(aValue, bValue, direction);
  }

  if (typeof aValue === "number" && typeof bValue === "number") {
    return compareNumbers(aValue, bValue, direction);
  }

  if (aValue instanceof Date && bValue instanceof Date) {
    return compareDates(aValue, bValue, direction);
  }

  const aString = String(aValue);
  const bString = String(bValue);
  return compareStrings(aString, bString, direction);
};

// Helper function to sort array by field
export const sortByField = <T extends Record<string, unknown>>(
  data: T[],
  field: string,
  direction: SortDirection
): T[] => {
  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);
    return compareValues(aValue, bValue, direction);
  });
};

// Helper function to create sort configuration
export const createSortConfig = (
  field: string,
  direction: SortDirection = "asc"
) => ({
  field,
  direction,
});
