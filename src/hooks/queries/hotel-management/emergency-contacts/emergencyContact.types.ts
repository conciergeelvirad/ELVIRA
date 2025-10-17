/**
 * Emergency Contact Type Definitions
 *
 * Core types for hotel emergency contact management.
 */

import type { Tables, Insert, Update } from "../../queryUtils";

/**
 * Emergency contact database table type
 */
export type EmergencyContactTable = Tables<"emergency_contacts">;

/**
 * Emergency contact type (using table type directly)
 */
export type EmergencyContact = EmergencyContactTable;

/**
 * Emergency contact insert type for creating new contacts
 */
export type EmergencyContactInsert = Insert<"emergency_contacts">;

/**
 * Emergency contact update type for modifying existing contacts
 */
export type EmergencyContactUpdate = Update<"emergency_contacts">;

/**
 * Emergency contact update data with ID
 */
export type EmergencyContactUpdateData = {
  id: string;
  updates: EmergencyContactUpdate;
};

/**
 * Emergency contact category types
 */
export type EmergencyContactCategory =
  | "medical"
  | "police"
  | "fire"
  | "security"
  | "maintenance"
  | "general";
