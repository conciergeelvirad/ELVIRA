/**
 * QA Recommendations Module
 * Barrel export for all QA recommendations-related functionality
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  QARecommendation,
  QARecommendationInsert,
  QARecommendationUpdate,
  QARecommendationType,
  QARecommendationWithDetails,
} from "./qaRecommendation.types";

export { QA_RECOMMENDATION_TYPES } from "./qaRecommendation.types";

// ============================================================================
// CONSTANT EXPORTS
// ============================================================================

export {
  qaRecommendationsKeys,
  QA_RECOMMENDATION_WITH_DETAILS_SELECT,
  QA_RECOMMENDATION_SIMPLE_SELECT,
} from "./qaRecommendation.constants";

// ============================================================================
// TRANSFORMER EXPORTS
// ============================================================================

export {
  extractUniqueCategories,
  groupByCategory,
  filterBySearchText,
  sortByCategoryAndDate,
} from "./qaRecommendation.transformers";

// ============================================================================
// QUERY HOOK EXPORTS
// ============================================================================

export {
  useQARecommendations,
  useActiveQARecommendations,
  useQARecommendationsByCategory,
  useQARecommendationsByType,
  useQARecommendationById,
  useSearchQARecommendations,
  useQACategories,
} from "./useQARecommendationQueries";

// ============================================================================
// MUTATION HOOK EXPORTS
// ============================================================================

export {
  useCreateQARecommendation,
  useUpdateQARecommendation,
  useDeleteQARecommendation,
  useToggleQARecommendationActive,
  useBulkCreateQARecommendations,
} from "./useQARecommendationQueries";
