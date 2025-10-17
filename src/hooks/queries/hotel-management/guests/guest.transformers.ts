/**
 * Guest Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting guest data.
 */

import type {
  Guest,
  GuestWithPersonalData,
  GuestPersonalData,
} from "./guest.types";

// ============================================================================
// Transformation Utilities
// ============================================================================

/**
 * Normalizes guest personal data from array to single object
 */
export const normalizeGuestPersonalData = (
  guest: Guest
): GuestWithPersonalData => {
  console.log("🔄 [normalizeGuestPersonalData] Processing guest:", guest.id);
  console.log(
    "🔄 [normalizeGuestPersonalData] guest_personal_data type:",
    Array.isArray(guest.guest_personal_data)
      ? "array"
      : typeof guest.guest_personal_data
  );
  console.log(
    "🔄 [normalizeGuestPersonalData] guest_personal_data value:",
    guest.guest_personal_data
  );
  console.log("🔄 [normalizeGuestPersonalData] creator value:", guest.creator);

  const personalData = Array.isArray(guest.guest_personal_data)
    ? guest.guest_personal_data[0] || null
    : guest.guest_personal_data || null;

  // Normalize creator staff personal data from array to single object
  let normalizedCreator = guest.creator;
  if (guest.creator && guest.creator.staff_personal_data) {
    const staffPersonalData = Array.isArray(guest.creator.staff_personal_data)
      ? guest.creator.staff_personal_data[0] || null
      : guest.creator.staff_personal_data;

    normalizedCreator = {
      ...guest.creator,
      staff_personal_data: staffPersonalData,
    };
  }

  console.log(
    "🔄 [normalizeGuestPersonalData] Normalized personalData:",
    personalData
  );
  console.log(
    "🔄 [normalizeGuestPersonalData] Normalized creator:",
    normalizedCreator
  );

  return {
    ...guest,
    guest_personal_data: personalData as GuestPersonalData | null,
    creator: normalizedCreator,
  };
};

/**
 * Transforms multiple guests to normalized format
 */
export const normalizeGuests = (guests: Guest[]): GuestWithPersonalData[] => {
  console.log(
    "🔄 [normalizeGuests] Starting normalization of",
    guests.length,
    "guests"
  );
  const result = guests.map(normalizeGuestPersonalData);
  console.log(
    "🔄 [normalizeGuests] Normalization complete. Result count:",
    result.length
  );
  return result;
};

// ============================================================================
// Name Utilities
// ============================================================================

/**
 * Gets the full name from personal data or falls back to guest_name
 */
export const getGuestFullName = (guest: GuestWithPersonalData): string => {
  if (guest.guest_personal_data) {
    const { first_name, last_name } = guest.guest_personal_data;
    return `${first_name} ${last_name}`.trim();
  }
  return guest.guest_name;
};

/**
 * Gets the display name with room number
 */
export const getGuestDisplayName = (guest: GuestWithPersonalData): string => {
  const name = getGuestFullName(guest);
  return `${name} (Room ${guest.room_number})`;
};

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filters guests by active status
 */
export const filterActiveGuests = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return guests.filter((guest) => guest.is_active);
};

/**
 * Filters guests by DND (Do Not Disturb) status
 */
export const filterDNDGuests = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return guests.filter((guest) => guest.dnd_status);
};

/**
 * Filters guests by room number
 */
export const filterByRoomNumber = (
  guests: GuestWithPersonalData[],
  roomNumber: string
): GuestWithPersonalData[] => {
  return guests.filter((guest) => guest.room_number === roomNumber);
};

/**
 * Filters guests with expired access codes
 */
export const filterExpiredAccess = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  const now = new Date();
  return guests.filter((guest) => new Date(guest.access_code_expires_at) < now);
};

/**
 * Filters guests with valid (non-expired) access codes
 */
export const filterValidAccess = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  const now = new Date();
  return guests.filter(
    (guest) => new Date(guest.access_code_expires_at) >= now
  );
};

/**
 * Searches guests by name, room number, email, or phone
 */
export const searchGuests = (
  guests: GuestWithPersonalData[],
  searchTerm: string
): GuestWithPersonalData[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return guests;

  return guests.filter((guest) => {
    const fullName = getGuestFullName(guest).toLowerCase();
    const roomNumber = guest.room_number.toLowerCase();
    const email = guest.guest_personal_data?.guest_email?.toLowerCase() || "";
    const phone = guest.guest_personal_data?.phone_number?.toLowerCase() || "";

    return (
      fullName.includes(term) ||
      roomNumber.includes(term) ||
      email.includes(term) ||
      phone.includes(term)
    );
  });
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sorts guests by name (ascending)
 */
export const sortGuestsByName = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return [...guests].sort((a, b) => {
    const nameA = getGuestFullName(a).toLowerCase();
    const nameB = getGuestFullName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts guests by room number (ascending)
 */
export const sortGuestsByRoom = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return [...guests].sort((a, b) => {
    return a.room_number.localeCompare(b.room_number, undefined, {
      numeric: true,
    });
  });
};

/**
 * Sorts guests by check-in date (most recent first)
 */
export const sortGuestsByCheckIn = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return [...guests].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sorts guests by access code expiration (soonest first)
 */
export const sortGuestsByExpiration = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return [...guests].sort((a, b) => {
    return (
      new Date(a.access_code_expires_at).getTime() -
      new Date(b.access_code_expires_at).getTime()
    );
  });
};

// ============================================================================
// Grouping Utilities
// ============================================================================

/**
 * Groups guests by room number
 */
export const groupGuestsByRoom = (
  guests: GuestWithPersonalData[]
): Record<string, GuestWithPersonalData[]> => {
  return guests.reduce((acc, guest) => {
    const room = guest.room_number;
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(guest);
    return acc;
  }, {} as Record<string, GuestWithPersonalData[]>);
};

/**
 * Groups guests by active status
 */
export const groupGuestsByStatus = (
  guests: GuestWithPersonalData[]
): { active: GuestWithPersonalData[]; inactive: GuestWithPersonalData[] } => {
  return guests.reduce(
    (acc, guest) => {
      if (guest.is_active) {
        acc.active.push(guest);
      } else {
        acc.inactive.push(guest);
      }
      return acc;
    },
    { active: [], inactive: [] } as {
      active: GuestWithPersonalData[];
      inactive: GuestWithPersonalData[];
    }
  );
};

/**
 * Groups guests by country
 */
export const groupGuestsByCountry = (
  guests: GuestWithPersonalData[]
): Record<string, GuestWithPersonalData[]> => {
  return guests.reduce((acc, guest) => {
    const country = guest.guest_personal_data?.country || "Unknown";
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(guest);
    return acc;
  }, {} as Record<string, GuestWithPersonalData[]>);
};

// ============================================================================
// Data Extraction Utilities
// ============================================================================

/**
 * Extracts unique room numbers from guests
 */
export const getUniqueRooms = (guests: GuestWithPersonalData[]): string[] => {
  const rooms = new Set(guests.map((guest) => guest.room_number));
  return Array.from(rooms).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
};

/**
 * Extracts unique countries from guest personal data
 */
export const getUniqueCountries = (
  guests: GuestWithPersonalData[]
): string[] => {
  const countries = new Set(
    guests
      .map((guest) => guest.guest_personal_data?.country)
      .filter((country): country is string => !!country)
  );
  return Array.from(countries).sort();
};

/**
 * Extracts guests with email addresses
 */
export const getGuestsWithEmail = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return guests.filter((guest) => guest.guest_personal_data?.guest_email);
};

/**
 * Extracts guests with phone numbers
 */
export const getGuestsWithPhone = (
  guests: GuestWithPersonalData[]
): GuestWithPersonalData[] => {
  return guests.filter((guest) => guest.guest_personal_data?.phone_number);
};

// ============================================================================
// Status Utilities
// ============================================================================

/**
 * Checks if a guest's access code is expired
 */
export const isAccessExpired = (guest: GuestWithPersonalData): boolean => {
  return new Date(guest.access_code_expires_at) < new Date();
};

/**
 * Gets the access status text
 */
export const getAccessStatus = (guest: GuestWithPersonalData): string => {
  if (!guest.is_active) return "Inactive";
  if (isAccessExpired(guest)) return "Expired";
  return "Active";
};

/**
 * Calculates days until access expires (negative if expired)
 */
export const getDaysUntilExpiration = (
  guest: GuestWithPersonalData
): number => {
  const now = new Date();
  const expiresAt = new Date(guest.access_code_expires_at);
  const diffTime = expiresAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats guest contact information
 */
export const formatGuestContact = (
  personalData: GuestPersonalData | null
): string => {
  if (!personalData) return "No contact info";

  const parts: string[] = [];
  if (personalData.guest_email) parts.push(personalData.guest_email);
  if (personalData.phone_number) parts.push(personalData.phone_number);

  return parts.join(" • ") || "No contact info";
};

/**
 * Formats guest personal info summary
 */
export const formatGuestSummary = (guest: GuestWithPersonalData): string => {
  const name = getGuestFullName(guest);
  const room = guest.room_number;
  const status = getAccessStatus(guest);
  return `${name} - Room ${room} (${status})`;
};
