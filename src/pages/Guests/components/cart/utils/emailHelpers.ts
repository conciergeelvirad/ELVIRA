/**
 * Email Helpers
 *
 * Utility functions for handling email notifications in cart checkouts
 * Extracts guest and hotel data from session for email sending
 */

import type {
  GuestAuthResponse,
  GuestPersonalData,
} from "../../../../../services/guestAuth.service";

/**
 * Extract guest email from personal data
 * Handles both array and single object formats
 */
export const extractGuestEmail = (
  guestPersonalData: GuestPersonalData | GuestPersonalData[] | undefined
): string => {
  if (!guestPersonalData) return "";

  return Array.isArray(guestPersonalData)
    ? guestPersonalData[0]?.guest_email || ""
    : guestPersonalData?.guest_email || "";
};

/**
 * Build base email data common to all order types
 * Includes guest name, email, room number, and hotel name
 */
export const buildBaseEmailData = (session: GuestAuthResponse | null) => {
  if (!session) {
    return {
      guestName: "Guest",
      guestEmail: "",
      roomNumber: "",
      hotelName: "Hotel",
    };
  }

  return {
    guestName: session.guestData?.guest_name || "Guest",
    guestEmail: extractGuestEmail(session.guestData?.guest_personal_data),
    roomNumber: session.guestData?.room_number || "",
    hotelName: session.hotelData?.name || "Hotel",
  };
};

/**
 * Validate that email can be sent (guest email exists)
 */
export const canSendEmail = (session: GuestAuthResponse | null): boolean => {
  const email = extractGuestEmail(session?.guestData?.guest_personal_data);
  return email.length > 0 && email.includes("@");
};
