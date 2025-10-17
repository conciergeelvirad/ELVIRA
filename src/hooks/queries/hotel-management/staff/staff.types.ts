/**
 * Hotel Staff Type Definitions
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// BASE TYPES
// ============================================================================

export type HotelStaff = Tables<"hotel_staff">;
export type HotelStaffPersonalData = Tables<"hotel_staff_personal_data">;
export type HotelStaffInsert = Insert<"hotel_staff">;
export type HotelStaffPersonalDataInsert = Insert<"hotel_staff_personal_data">;
export type HotelStaffUpdate = Update<"hotel_staff">;
export type HotelStaffPersonalDataUpdate = Update<"hotel_staff_personal_data">;

// ============================================================================
// EXTENDED TYPES
// ============================================================================

/**
 * Staff member with personal data joined
 */
export type StaffWithPersonalData = HotelStaff & {
  personal_data?: HotelStaffPersonalData | HotelStaffPersonalData[];
};

/**
 * Transformed staff member for UI display
 */
export interface StaffMember extends Record<string, unknown> {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  hireDate: string;
  status: "active" | "inactive" | "terminated";
  photo?: string;
  dateOfBirth?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

/**
 * Combined staff and personal data for creation
 */
export interface StaffCreationData {
  staff: HotelStaffInsert;
  personalData: Omit<HotelStaffPersonalDataInsert, "staff_id">;
}

/**
 * Combined staff and personal data for updates
 */
export interface StaffUpdateData {
  staffId: string;
  staffUpdates?: HotelStaffUpdate;
  personalDataUpdates?: HotelStaffPersonalDataUpdate;
}

// ============================================================================
// ENUMS
// ============================================================================

export type StaffStatus = "active" | "inactive" | "terminated";
