/**
 * Recommended Places Type Definitions
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// BASE TYPES
// ============================================================================

export type RecommendedPlace = Tables<"hotel_recommended_places">;
export type RecommendedPlaceInsert = Insert<"hotel_recommended_places">;
export type RecommendedPlaceUpdate = Update<"hotel_recommended_places">;

// ============================================================================
// EXTENDED TYPES
// ============================================================================

/**
 * Recommended place with joined profile and hotel data
 */
export type RecommendedPlaceWithDetails = RecommendedPlace & {
  created_by_profile?: {
    id: string;
    email: string;
  };
  hotels?: {
    id: string;
    hotel_name: string;
  };
};
