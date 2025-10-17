/**
 * Guest Query Constants
 *
 * Query keys and select patterns for guest-related queries.
 */

/**
 * Query key factory for guest-related queries
 */
export const guestKeys = {
  all: ["guests"] as const,
  lists: () => [...guestKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...guestKeys.lists(), { ...filters }] as const,
  details: () => [...guestKeys.all, "detail"] as const,
  detail: (id: string) => [...guestKeys.details(), id] as const,
  active: (hotelId: string) => [...guestKeys.all, "active", hotelId] as const,
  byRoom: (hotelId: string, roomNumber: string) =>
    [...guestKeys.all, "byRoom", hotelId, roomNumber] as const,
} as const;

/**
 * Select pattern for guest with personal data
 */
export const GUEST_SELECT = `
  id,
  hotel_id,
  room_number,
  guest_name,
  access_code_expires_at,
  is_active,
  dnd_status,
  created_at,
  updated_at,
  created_by,
  hashed_verification_code,
  guest_personal_data(
    guest_id,
    first_name,
    last_name,
    guest_email,
    phone_number,
    date_of_birth,
    country,
    language,
    additional_guests_data,
    updated_at
  )
` as const;

/**
 * Select pattern for basic guest info (no personal data)
 */
export const GUEST_BASIC_SELECT = `
  id,
  hotel_id,
  room_number,
  guest_name,
  access_code_expires_at,
  is_active,
  dnd_status,
  created_at,
  updated_at,
  created_by,
  hashed_verification_code
` as const;
