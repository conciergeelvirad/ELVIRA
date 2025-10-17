/**
 * Approved Places Query Keys Factory
 *
 * Centralized query keys for approved third-party places.
 * This ensures consistency and makes it easier to invalidate/refetch queries.
 */

import type { ApprovalStatus } from "../../../types/approved-third-party-places";

/**
 * Query keys for approved third-party places
 *
 * @example
 * approvedPlacesKeys.all // ["approved-third-party-places"]
 * approvedPlacesKeys.byHotel(hotelId) // ["approved-third-party-places", hotelId]
 * approvedPlacesKeys.byHotelAndStatus(hotelId, "approved") // ["approved-third-party-places", hotelId, "approved"]
 */
export const approvedPlacesKeys = {
  all: ["approved-third-party-places"] as const,
  byHotel: (hotelId: string) => [...approvedPlacesKeys.all, hotelId] as const,
  byHotelAndStatus: (hotelId: string, status: ApprovalStatus) =>
    [...approvedPlacesKeys.byHotel(hotelId), status] as const,
  byPlaceId: (hotelId: string, placeId: string) =>
    [...approvedPlacesKeys.byHotel(hotelId), "place", placeId] as const,
} as const;
