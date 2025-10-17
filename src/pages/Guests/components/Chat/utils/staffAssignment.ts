/**
 * Staff Assignment Utilities
 *
 * Find and assign suitable staff members for guest conversations
 * Note: Conversations are between GUEST and HOTEL, staff assignment is optional for routing
 */

import { supabase } from "../../../../../lib/supabase";

/**
 * Find a suitable staff member for the guest conversation
 * Priority: Manager > Reception staff
 * Returns profile ID (from profiles table) to assign to conversation
 * This is OPTIONAL - conversation is with hotel, staff is just for routing
 */
export const findAvailableStaff = async (
  hotelId: string
): Promise<string | null> => {
  // Query hotel staff profiles for assignment
  // Note: assigned_staff_id references profiles table, not hotel_staff
  const { data: staffData, error } = await supabase
    .from("hotel_staff")
    .select("user_id")
    .eq("hotel_id", hotelId)
    .in("position", ["Hotel Admin", "Hotel Staff"])
    .in("department", ["Manager", "Reception"])
    .eq("status", "active")
    .order("department", { ascending: true }) // Manager first
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  if (staffData?.user_id) {
    return staffData.user_id; // Return profile ID, not hotel_staff ID
  }

  return null;
};
