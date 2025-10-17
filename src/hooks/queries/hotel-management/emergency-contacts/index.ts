/**
 * Emergency Contacts Module
 *
 * Centralized exports for emergency contact management functionality.
 */

// Type exports
export type {
  EmergencyContact,
  EmergencyContactInsert,
  EmergencyContactUpdate,
  EmergencyContactUpdateData,
} from "./emergencyContact.types";

// Constants exports
export {
  emergencyContactKeys,
  DEFAULT_HOTEL_ID,
} from "./emergencyContact.constants";

// Transformer exports
export {
  // Filtering
  filterActiveContacts,
  filterByCreator,
  searchEmergencyContacts,

  // Sorting
  sortContactsByName,
  sortContactsByDate,
  sortContactsByPhone,
  sortContactsByStatus,

  // Grouping
  groupContactsByStatus,
  groupContactsByCreator,
  groupContactsByLetter,

  // Data Extraction
  getUniqueCreators,
  getActiveContacts,
  getContactCounts,
  getMostRecentContact,

  // Formatting
  formatPhoneNumber,
  formatContactSummary,
  getContactInitials,
  formatContactName,
} from "./emergencyContact.transformers";

// Query hook exports
export {
  useEmergencyContacts,
  useEmergencyContactById,
  useActiveEmergencyContacts,
  useEmergencyContactsByCreator,
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
  useToggleEmergencyContactStatus,
} from "./useEmergencyContactQueries";
