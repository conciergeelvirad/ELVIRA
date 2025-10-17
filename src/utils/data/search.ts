// Search utility functions for filtering data

/**
 * Performs a text search across multiple fields of an item
 */
export const searchInFields = <T extends Record<string, unknown>>(
  item: T,
  searchTerm: string,
  searchFields: (keyof T)[]
): boolean => {
  if (!searchTerm.trim()) return true;

  const searchLower = searchTerm.toLowerCase();

  return searchFields.some((field) => {
    const value = item[field];
    if (value === null || value === undefined) return false;
    return String(value).toLowerCase().includes(searchLower);
  });
};

/**
 * Filters an array of items based on search term and fields
 */
export const filterBySearch = <T extends Record<string, unknown>>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return data;

  return data.filter((item) => searchInFields(item, searchTerm, searchFields));
};

/**
 * Filters data by a specific field value
 */
export const filterByField = <T extends Record<string, unknown>>(
  data: T[],
  filterField: keyof T,
  filterValue: string
): T[] => {
  if (!filterValue) return data;

  return data.filter((item) => {
    const value = item[filterField];
    return String(value) === filterValue;
  });
};

/**
 * Generates filter options from data with counts
 */
export const generateFilterOptions = <T extends Record<string, unknown>>(
  data: T[],
  filterField: keyof T
): Array<{ value: string; label: string; count: number }> => {
  const optionCounts = data.reduce((acc, item) => {
    const value = item[filterField];
    if (value) {
      const stringValue = String(value);
      acc[stringValue] = (acc[stringValue] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(optionCounts)
    .map(([value, count]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Normalizes search term for consistent searching
 */
export const normalizeSearchTerm = (term: string): string => {
  return term.trim().toLowerCase();
};

/**
 * Highlights search term in text
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string,
  highlightClass = "bg-yellow-200"
): string => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};
