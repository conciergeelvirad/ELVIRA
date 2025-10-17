// Type definitions for search and filter functionality

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchState {
  searchTerm: string;
  isActive: boolean;
}

export interface FilterState {
  filterValue: string;
  isActive: boolean;
}

export interface ViewModeState {
  mode: "grid" | "list";
}

export interface SearchAndFilterState
  extends SearchState,
    FilterState,
    ViewModeState {
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface SearchActions {
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

export interface FilterActions {
  setFilterValue: (value: string) => void;
  toggleFilter: () => void;
  clearFilter: () => void;
}

export interface ViewModeActions {
  setViewMode: (mode: "grid" | "list") => void;
  toggleViewMode: () => void;
}

export interface SearchAndFilterActions
  extends SearchActions,
    FilterActions,
    ViewModeActions {
  setSortBy: (field: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  toggleSort: (field: string) => void;
  clearAll: () => void;
  reset: () => void;
}

export interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  initialSearchTerm?: string;
  customFilter?: (item: T, searchTerm: string) => boolean;
}

export interface UseFilterOptions<T> {
  data: T[];
  filterField: keyof T;
  initialFilterValue?: string;
}

export interface UseSearchAndFilterOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterField?: keyof T;
  initialSearchTerm?: string;
  defaultViewMode?: "grid" | "list";
  defaultSortBy?: string;
  defaultSortDirection?: "asc" | "desc";
  customFilter?: (item: T, searchTerm: string, filterValue: string) => boolean;
  customSort?: (
    a: T,
    b: T,
    sortBy: string,
    direction: "asc" | "desc"
  ) => number;
}

export interface SearchResult<T> {
  filteredData: T[];
  totalItems: number;
  hasResults: boolean;
}

export interface FilterResult<T> extends SearchResult<T> {
  filterOptions: FilterOption[];
}

export interface UseSearchReturn<T>
  extends SearchState,
    SearchActions,
    SearchResult<T> {}

export interface UseFilterReturn<T>
  extends FilterState,
    FilterActions,
    FilterResult<T> {}

export interface UseSearchAndFilterReturn<T>
  extends SearchAndFilterState,
    SearchAndFilterActions,
    FilterResult<T> {
  hasActiveFilters: boolean;
}
