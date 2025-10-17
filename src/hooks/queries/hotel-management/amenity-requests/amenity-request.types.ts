/**
 * Amenity Request Type Definitions
 *
 * TypeScript types for amenity request functionality.
 * Handles guest requests for hotel amenities with status tracking.
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// Database Table Types
// ============================================================================

export type AmenityRequest = Tables<"amenity_requests">;
export type AmenityRequestInsert = Insert<"amenity_requests">;
export type AmenityRequestUpdate = Update<"amenity_requests">;

// ============================================================================
// Extended Types with Relations
// ============================================================================

/**
 * Extended amenity request with related amenity and guest info
 */
export type ExtendedAmenityRequest = AmenityRequest & {
  amenities?: {
    id: string;
    name: string;
  } | null;
  guests?: {
    id: string;
    room_number: string;
    guest_personal_data?: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
};

// ============================================================================
// Operation Types
// ============================================================================

/**
 * Data for updating an existing amenity request
 */
export type AmenityRequestUpdateData = {
  id: string;
  updates: AmenityRequestUpdate;
  hotelId: string;
};

/**
 * Data for updating amenity request status
 */
export type AmenityRequestStatusUpdateData = {
  id: string;
  status: AmenityRequest["status"];
  hotelId: string;
};

/**
 * Data for deleting an amenity request
 */
export type AmenityRequestDeletionData = {
  id: string;
  hotelId: string;
};
