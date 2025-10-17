/**
 * Recommended Places Module
 * Barrel export for all recommended places-related functionality
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  RecommendedPlace,
  RecommendedPlaceInsert,
  RecommendedPlaceUpdate,
  RecommendedPlaceWithDetails,
} from "./recommendedPlace.types";

// ============================================================================
// CONSTANT EXPORTS
// ============================================================================

export {
  recommendedPlacesKeys,
  RECOMMENDED_PLACE_WITH_DETAILS_SELECT,
  RECOMMENDED_PLACE_SIMPLE_SELECT,
} from "./recommendedPlace.constants";

// ============================================================================
// TRANSFORMER EXPORTS
// ============================================================================

export {
  filterBySearchText,
  filterActiveOnly,
  sortByName,
  sortByNewest,
  extractPlaceNames,
  getPlaceById,
  formatAddress,
  formatPlaceDisplay,
} from "./recommendedPlace.transformers";

// ============================================================================
// QUERY HOOK EXPORTS
// ============================================================================

export {
  useRecommendedPlaces,
  useActiveRecommendedPlaces,
  useRecommendedPlaceById,
  useSearchRecommendedPlaces,
} from "./useRecommendedPlaceQueries";

// ============================================================================
// MUTATION HOOK EXPORTS
// ============================================================================

export {
  useCreateRecommendedPlace,
  useUpdateRecommendedPlace,
  useDeleteRecommendedPlace,
  useTogglePlaceActive,
} from "./useRecommendedPlaceQueries";
