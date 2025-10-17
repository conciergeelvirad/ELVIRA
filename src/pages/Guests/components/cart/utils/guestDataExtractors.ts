/**
 * Guest Data Extractors
 *
 * Utility functions for safely extracting data from guest session
 */

import type { GuestAuthResponse } from "../../../../../services/guestAuth.service";

/**
 * Get guest ID from session
 */
export const getGuestIdFromSession = (
  session: GuestAuthResponse | null
): string | undefined => {
  return session?.guestData?.id;
};

/**
 * Get hotel ID from session
 */
export const getHotelIdFromSession = (
  session: GuestAuthResponse | null
): string => {
  return session?.guestData?.hotel_id || "";
};

/**
 * Get hotel name from session
 */
export const getHotelNameFromSession = (
  session: GuestAuthResponse | null
): string => {
  return session?.hotelData?.name || "Hotel";
};

/**
 * Get guest name from session
 */
export const getGuestNameFromSession = (
  session: GuestAuthResponse | null
): string => {
  return session?.guestData?.guest_name || "Guest";
};

/**
 * Get room number from session
 */
export const getRoomNumberFromSession = (
  session: GuestAuthResponse | null
): string => {
  return session?.guestData?.room_number || "";
};

/**
 * Check if guest session is valid
 */
export const isValidGuestSession = (
  session: GuestAuthResponse | null
): boolean => {
  return !!(
    session?.guestData?.id &&
    session?.guestData?.hotel_id &&
    session?.guestData?.room_number
  );
};
