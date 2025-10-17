/**
 * Amenity Type Definitions
 *
 * Core types for hotel amenity management.
 */

import type { Tables, Insert, Update } from "../../queryUtils";

/**
 * Amenity database table type
 */
export type AmenityTable = Tables<"amenities">;

/**
 * Amenity type (using table type directly)
 */
export type Amenity = AmenityTable;

/**
 * Amenity insert type for creating new amenities
 */
export type AmenityInsert = Insert<"amenities">;

/**
 * Amenity update type for modifying existing amenities
 */
export type AmenityUpdate = Update<"amenities">;

/**
 * Amenity with ID for updates
 */
export type AmenityUpdateData = AmenityUpdate & {
  id: string;
};

/**
 * Amenity category types
 */
export type AmenityCategory =
  | "spa"
  | "fitness"
  | "pool"
  | "restaurant"
  | "bar"
  | "business"
  | "entertainment"
  | "other";

/**
 * Amenity availability status
 */
export type AmenityAvailability =
  | "available"
  | "busy"
  | "maintenance"
  | "closed";
