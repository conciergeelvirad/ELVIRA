/**
 * useGuestHotelId Hook
 *
 * Extracts hotel ID from guest session
 * Reusable across all guest pages
 */

import { getGuestSession } from "../../../services/guestAuth.service";

export const useGuestHotelId = (): string => {
  const session = getGuestSession();
  return session?.guestData?.hotel_id || "";
};
