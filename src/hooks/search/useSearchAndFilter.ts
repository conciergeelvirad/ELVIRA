// Keep the old interfaces for backwards compatibility
// (These are now defined in types/search.ts)
export type {
  FilterOption,
  SearchAndFilterState,
  SearchAndFilterActions,
  UseSearchAndFilterOptions,
  UseSearchAndFilterReturn,
} from "../../types/search";

// Legacy exports for backwards compatibility
export {
  useSearchAndFilter,
  useSimpleSearch,
} from "./useSearchAndFilterRefactored";
