/**
 * Emergency Contact Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting emergency contact data.
 */

import type { EmergencyContact } from "./emergencyContact.types";

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filters active contacts
 */
export const filterActiveContacts = (
  contacts: EmergencyContact[]
): EmergencyContact[] => {
  return contacts.filter((contact) => contact.is_active);
};

/**
 * Filters contacts by creator
 */
export const filterByCreator = (
  contacts: EmergencyContact[],
  creatorId: string
): EmergencyContact[] => {
  return contacts.filter((contact) => contact.created_by === creatorId);
};

/**
 * Searches contacts by name or phone
 */
export const searchEmergencyContacts = (
  contacts: EmergencyContact[],
  searchTerm: string
): EmergencyContact[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return contacts;

  return contacts.filter((contact) => {
    const name = contact.contact_name?.toLowerCase() || "";
    const phone = contact.phone_number?.toLowerCase() || "";

    return name.includes(term) || phone.includes(term);
  });
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sorts contacts by name (alphabetically)
 */
export const sortContactsByName = (
  contacts: EmergencyContact[]
): EmergencyContact[] => {
  return [...contacts].sort((a, b) => {
    const nameA = a.contact_name?.toLowerCase() || "";
    const nameB = b.contact_name?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts contacts by creation date (newest first)
 */
export const sortContactsByDate = (
  contacts: EmergencyContact[]
): EmergencyContact[] => {
  return [...contacts].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sorts contacts by phone number
 */
export const sortContactsByPhone = (
  contacts: EmergencyContact[]
): EmergencyContact[] => {
  return [...contacts].sort((a, b) => {
    const phoneA = a.phone_number?.toLowerCase() || "";
    const phoneB = b.phone_number?.toLowerCase() || "";
    return phoneA.localeCompare(phoneB);
  });
};

/**
 * Sorts contacts by active status (active first)
 */
export const sortContactsByStatus = (
  contacts: EmergencyContact[]
): EmergencyContact[] => {
  return [...contacts].sort((a, b) => {
    if (a.is_active === b.is_active) return 0;
    return a.is_active ? -1 : 1;
  });
};

// ============================================================================
// Grouping Utilities
// ============================================================================

/**
 * Groups contacts by active status
 */
export const groupContactsByStatus = (
  contacts: EmergencyContact[]
): { active: EmergencyContact[]; inactive: EmergencyContact[] } => {
  return contacts.reduce(
    (acc, contact) => {
      if (contact.is_active) {
        acc.active.push(contact);
      } else {
        acc.inactive.push(contact);
      }
      return acc;
    },
    { active: [], inactive: [] } as {
      active: EmergencyContact[];
      inactive: EmergencyContact[];
    }
  );
};

/**
 * Groups contacts by creator
 */
export const groupContactsByCreator = (
  contacts: EmergencyContact[]
): Record<string, EmergencyContact[]> => {
  return contacts.reduce((acc, contact) => {
    const creator = contact.created_by || "unknown";
    if (!acc[creator]) {
      acc[creator] = [];
    }
    acc[creator].push(contact);
    return acc;
  }, {} as Record<string, EmergencyContact[]>);
};

/**
 * Groups contacts by first letter of name
 */
export const groupContactsByLetter = (
  contacts: EmergencyContact[]
): Record<string, EmergencyContact[]> => {
  return contacts.reduce((acc, contact) => {
    const firstLetter = contact.contact_name?.charAt(0).toUpperCase() || "#";
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {} as Record<string, EmergencyContact[]>);
};

// ============================================================================
// Data Extraction Utilities
// ============================================================================

/**
 * Extracts unique creators from contacts
 */
export const getUniqueCreators = (contacts: EmergencyContact[]): string[] => {
  const creators = new Set(
    contacts
      .map((contact) => contact.created_by)
      .filter((creator): creator is string => !!creator)
  );
  return Array.from(creators).sort();
};

/**
 * Gets active contacts only
 */
export const getActiveContacts = (
  contacts: EmergencyContact[]
): EmergencyContact[] => {
  return contacts.filter((contact) => contact.is_active);
};

/**
 * Counts active vs inactive contacts
 */
export const getContactCounts = (
  contacts: EmergencyContact[]
): { active: number; inactive: number; total: number } => {
  const active = contacts.filter((c) => c.is_active).length;
  const inactive = contacts.filter((c) => !c.is_active).length;
  return { active, inactive, total: contacts.length };
};

/**
 * Gets the most recently added contact
 */
export const getMostRecentContact = (
  contacts: EmergencyContact[]
): EmergencyContact | null => {
  if (contacts.length === 0) return null;
  return sortContactsByDate(contacts)[0];
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats phone number for display
 */
export const formatPhoneNumber = (phoneNumber: string | null): string => {
  if (!phoneNumber) return "N/A";

  // Basic formatting
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  return phoneNumber;
};

/**
 * Formats contact summary
 */
export const formatContactSummary = (contact: EmergencyContact): string => {
  const name = contact.contact_name || "Unknown Contact";
  const phone = formatPhoneNumber(contact.phone_number);
  const status = contact.is_active ? "Active" : "Inactive";
  return `${name} - ${phone} (${status})`;
};

/**
 * Gets contact initials
 */
export const getContactInitials = (contactName: string | null): string => {
  if (!contactName) return "?";

  const words = contactName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Formats contact name for display (title case)
 */
export const formatContactName = (contactName: string | null): string => {
  if (!contactName) return "Unknown";

  return contactName
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
