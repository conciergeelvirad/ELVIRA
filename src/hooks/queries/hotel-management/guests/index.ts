/**
 * Guest Module Exports
 *
 * Centralized exports for guest-related types, constants, utilities, and hooks.
 */

// Types
export type {
  GuestTable,
  GuestPersonalDataTable,
  Guest,
  GuestPersonalData,
  GuestInsert,
  GuestUpdate,
  GuestPersonalDataInsert,
  GuestPersonalDataUpdate,
  GuestCreationData,
  GuestUpdateData,
  GuestDeletionData,
  GuestWithPersonalData,
} from "./guest.types";

// Constants
export { guestKeys, GUEST_SELECT, GUEST_BASIC_SELECT } from "./guest.constants";

// Transformers
export {
  // Transformation utilities
  normalizeGuestPersonalData,
  normalizeGuests,

  // Name utilities
  getGuestFullName,
  getGuestDisplayName,

  // Filtering utilities
  filterActiveGuests,
  filterDNDGuests,
  filterByRoomNumber,
  filterExpiredAccess,
  filterValidAccess,
  searchGuests,

  // Sorting utilities
  sortGuestsByName,
  sortGuestsByRoom,
  sortGuestsByCheckIn,
  sortGuestsByExpiration,

  // Grouping utilities
  groupGuestsByRoom,
  groupGuestsByStatus,
  groupGuestsByCountry,

  // Data extraction utilities
  getUniqueRooms,
  getUniqueCountries,
  getGuestsWithEmail,
  getGuestsWithPhone,

  // Status utilities
  isAccessExpired,
  getAccessStatus,
  getDaysUntilExpiration,

  // Formatting utilities
  formatGuestContact,
  formatGuestSummary,
} from "./guest.transformers";

// Query Hooks
export {
  useGuests,
  useGuestById,
  useCreateGuest,
  useUpdateGuest,
  useDeleteGuest,
} from "./useGuestQueries";
