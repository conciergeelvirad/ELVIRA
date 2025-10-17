/**
 * QA Recommendations Type Definitions
 *
 * Contains all TypeScript interfaces and types related to QA recommendations.
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// BASE TYPES FROM DATABASE
// ============================================================================

/**
 * Base QA recommendation type from database
 */
export type QARecommendation = Tables<"qa_recommendations">;

/**
 * Type for inserting new QA recommendations
 */
export type QARecommendationInsert = Insert<"qa_recommendations">;

/**
 * Type for updating existing QA recommendations
 */
export type QARecommendationUpdate = Update<"qa_recommendations">;

// ============================================================================
// TYPE LITERALS & ENUMS
// ============================================================================

/**
 * Available QA recommendation types
 */
export type QARecommendationType = "Q&A" | "Recommendation";

/**
 * QA recommendation type enum
 */
export const QA_RECOMMENDATION_TYPES = ["Q&A", "Recommendation"] as const;

// ============================================================================
// EXTENDED TYPES WITH RELATIONSHIPS
// ============================================================================

/**
 * QA recommendation with joined profile and hotel data
 */
export type QARecommendationWithDetails = QARecommendation & {
  created_by_profile?: {
    id: string;
    email: string;
  };
  hotels?: {
    id: string;
    hotel_name: string;
  };
};
