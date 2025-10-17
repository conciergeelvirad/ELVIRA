/**
 * Guest Type Definitions
 *
 * Core types for hotel guest management including guest records and personal data.
 */

import type { Tables, Insert, Update } from "../../queryUtils";

/**
 * Guest database table type
 */
export type GuestTable = Tables<"guests">;

/**
 * Guest personal data table type
 */
export type GuestPersonalDataTable = Tables<"guest_personal_data">;

/**
 * Staff personal data for guest creator
 */
export type StaffPersonalDataForGuest = {
  first_name: string;
  last_name: string;
};

/**
 * Staff info for guest creator
 */
export type StaffInfoForGuest = {
  id: string;
  staff_personal_data:
    | StaffPersonalDataForGuest
    | StaffPersonalDataForGuest[]
    | null;
};

/**
 * Complete guest with personal data
 */
export type Guest = GuestTable & {
  guest_personal_data?: GuestPersonalDataTable | GuestPersonalDataTable[];
  creator?: StaffInfoForGuest | null;
};

/**
 * Guest personal data structure
 */
export type GuestPersonalData = {
  guest_id: string;
  first_name: string;
  last_name: string;
  guest_email: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  country: string | null;
  language: string | null;
  additional_guests_data: Record<string, unknown> | null;
  updated_at: string;
};

/**
 * Guest insert type for creating new guests
 */
export type GuestInsert = Insert<"guests">;

/**
 * Guest update type for modifying existing guests
 */
export type GuestUpdate = Update<"guests">;

/**
 * Guest personal data insert type
 */
export type GuestPersonalDataInsert = Insert<"guest_personal_data">;

/**
 * Guest personal data update type
 */
export type GuestPersonalDataUpdate = Update<"guest_personal_data">;

/**
 * Guest creation data (guest + personal data)
 */
export type GuestCreationData = {
  guestData: GuestInsert;
  personalData: Omit<GuestPersonalDataInsert, "guest_id">;
};

/**
 * Guest update data (flexible updates)
 */
export type GuestUpdateData = {
  id: string;
  hotelId: string;
  guestData?: Partial<GuestInsert>;
  personalData?: Partial<Omit<GuestPersonalDataInsert, "guest_id">>;
};

/**
 * Guest deletion data
 */
export type GuestDeletionData = {
  id: string;
  hotelId: string;
};

/**
 * Guest with full personal data (normalized)
 */
export type GuestWithPersonalData = Omit<
  Guest,
  "guest_personal_data" | "creator"
> & {
  guest_personal_data: GuestPersonalData | null;
  creator?: {
    id: string;
    staff_personal_data: StaffPersonalDataForGuest | null;
  } | null;
};
