/**
 * Absence Request Type Definitions
 *
 * Contains all TypeScript interfaces and types related to absence requests.
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// BASE TYPES FROM DATABASE
// ============================================================================

/**
 * Base absence request type from database
 */
export type AbsenceRequest = Tables<"absence_requests">;

/**
 * Type for inserting new absence requests
 */
export type AbsenceRequestInsert = Insert<"absence_requests">;

/**
 * Type for updating existing absence requests
 */
export type AbsenceRequestUpdate = Update<"absence_requests">;

// ============================================================================
// EXTENDED TYPES WITH RELATIONSHIPS
// ============================================================================

/**
 * Absence request with staff relationship data from database join
 */
export interface ExtendedAbsenceRequest extends AbsenceRequest {
  staff?: {
    id: string;
    employee_id: string;
    position: string;
    department: string;
    hotel_staff_personal_data: Array<{
      first_name: string;
      last_name: string;
      email: string;
      phone_number?: string;
      avatar_url?: string;
    }>;
  } | null;
}

// ============================================================================
// UI-FRIENDLY TYPES
// ============================================================================

/**
 * Transformed absence request optimized for UI display
 *
 * Flattens nested staff data and converts snake_case to camelCase
 */
export interface AbsenceRequestWithStaff extends Record<string, unknown> {
  // Request data
  id: string;
  staffId: string;
  hotelId: string;
  requestType: "vacation" | "sick" | "personal" | "training" | "other";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  dataProcessingConsent: boolean;
  consentDate: string | null;

  // Flattened staff information
  staffName: string | null;
  staffEmail: string | null;
  staffPosition: string | null;
  staffDepartment: string | null;
  staffEmployeeId: string | null;
  staffAvatar: string | null;
}

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Available absence request types
 */
export const ABSENCE_REQUEST_TYPES = [
  "vacation",
  "sick",
  "personal",
  "training",
  "other",
] as const;

/**
 * Available absence request statuses
 */
export const ABSENCE_REQUEST_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
] as const;

/**
 * Type for absence request type
 */
export type AbsenceRequestType = (typeof ABSENCE_REQUEST_TYPES)[number];

/**
 * Type for absence request status
 */
export type AbsenceRequestStatus = (typeof ABSENCE_REQUEST_STATUSES)[number];
