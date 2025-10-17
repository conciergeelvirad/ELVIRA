/**
 * QA Recommendations Constants
 *
 * Contains query keys, default values, and Supabase select patterns.
 */

import type { QARecommendationType } from "./qaRecommendation.types";

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query keys for QA recommendations caching and invalidation
 */
export const qaRecommendationsKeys = {
  all: ["qa-recommendations"] as const,
  lists: () => [...qaRecommendationsKeys.all, "list"] as const,
  list: (hotelId: string) =>
    [...qaRecommendationsKeys.lists(), hotelId] as const,
  byCategory: (hotelId: string, category: string) =>
    [...qaRecommendationsKeys.all, "category", hotelId, category] as const,
  byType: (hotelId: string, type: QARecommendationType) =>
    [...qaRecommendationsKeys.all, "type", hotelId, type] as const,
  active: (hotelId: string) =>
    [...qaRecommendationsKeys.all, "active", hotelId] as const,
  details: () => [...qaRecommendationsKeys.all, "detail"] as const,
  detail: (id: string) => [...qaRecommendationsKeys.details(), id] as const,
  categories: (hotelId: string) =>
    [...qaRecommendationsKeys.all, "categories", hotelId] as const,
  search: (hotelId: string, searchText: string) =>
    [...qaRecommendationsKeys.all, "search", hotelId, searchText] as const,
};

// ============================================================================
// SUPABASE SELECT PATTERNS
// ============================================================================

/**
 * Standard select pattern for QA recommendations with profile and hotel data
 */
export const QA_RECOMMENDATION_WITH_DETAILS_SELECT = `
  *,
  created_by_profile:profiles!qa_recommendations_created_by_fkey(
    id,
    email
  ),
  hotels!qa_recommendations_hotel_id_fkey(
    id,
    name
  )
`;

/**
 * Simple select pattern (no joins)
 */
export const QA_RECOMMENDATION_SIMPLE_SELECT = "*";
