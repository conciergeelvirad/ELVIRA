/**
 * Shared types for AmenityRequestsTable components
 */

// Re-export the ExtendedAmenityRequest from the queries folder
export type {
  ExtendedAmenityRequest,
  AmenityRequest,
} from "../../../hooks/queries/hotel-management/amenity-requests/amenity-request.types";

/**
 * Type for status filter selection
 * Includes all request statuses plus "all" option
 */
export type StatusFilter =
  | "pending"
  | "approved"
  | "rejected"
  | "delivered"
  | "all";

/**
 * Available status values for filtering
 */
export const STATUS_OPTIONS = [
  "all",
  "pending",
  "approved",
  "rejected",
  "delivered",
] as const;
