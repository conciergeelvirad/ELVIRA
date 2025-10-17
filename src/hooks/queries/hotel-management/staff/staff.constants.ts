/**
 * Hotel Staff Constants
 * Query keys and Supabase select patterns
 */

// ============================================================================
// DEFAULT VALUES
// ============================================================================

// TODO: Replace with dynamic hotel ID from context or auth
export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query key factory for hotel staff
 * Follows React Query best practices for cache management
 */
export const hotelStaffKeys = {
  all: ["hotel_staff"] as const,
  lists: () => [...hotelStaffKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...hotelStaffKeys.lists(), { ...filters }] as const,
  details: () => [...hotelStaffKeys.all, "detail"] as const,
  detail: (id: string) => [...hotelStaffKeys.details(), id] as const,
};

// ============================================================================
// SUPABASE SELECT PATTERNS
// ============================================================================

/**
 * Select pattern for staff with personal data joined
 */
export const STAFF_WITH_PERSONAL_DATA_SELECT = `
  id,
  employee_id,
  position,
  department,
  status,
  hire_date,
  personal_data:hotel_staff_personal_data!hotel_staff_personal_data_staff_id_fkey(
    first_name,
    last_name,
    email,
    phone_number,
    avatar_url,
    date_of_birth,
    city,
    zip_code,
    address,
    emergency_contact_name,
    emergency_contact_number
  )
`;

/**
 * Select pattern for staff with all personal data fields
 */
export const STAFF_WITH_FULL_PERSONAL_DATA_SELECT = `
  *,
  personal_data:hotel_staff_personal_data!hotel_staff_personal_data_staff_id_fkey(*)
`;

/**
 * Simple select pattern for staff (all columns, no joins)
 */
export const STAFF_SIMPLE_SELECT = "*";
