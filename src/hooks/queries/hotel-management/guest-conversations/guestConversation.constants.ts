/**
 * Guest Conversation Constants
 * Query keys and Supabase select patterns
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query key factory for guest conversations and messages
 * Follows React Query best practices for cache management
 */
export const conversationKeys = {
  all: ["guest-conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (hotelId: string) => [...conversationKeys.lists(), hotelId] as const,
  details: () => [...conversationKeys.all, "detail"] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  byGuest: (guestId: string) =>
    [...conversationKeys.all, "guest", guestId] as const,
  messages: (conversationId: string) =>
    [...conversationKeys.all, "messages", conversationId] as const,
  unreadCount: (conversationId: string) =>
    [...conversationKeys.messages(conversationId), "unread"] as const,
};

// ============================================================================
// SUPABASE SELECT PATTERNS
// ============================================================================

/**
 * Select pattern for conversations with full guest details
 * Note: Conversation is between guest and hotel
 * assigned_staff_id references profiles table (for staff user accounts)
 */
export const CONVERSATION_WITH_GUEST_SELECT = `
  *,
  guests!guest_conversation_guest_id_fkey(
    id,
    guest_name,
    room_number,
    guest_personal_data(
      first_name,
      last_name,
      guest_email,
      phone_number
    )
  )
`;

/**
 * Select pattern for messages with guest and profile details
 */
export const MESSAGE_WITH_DETAILS_SELECT = `
  *,
  guests(
    id,
    guest_name,
    room_number
  ),
  created_by_profile:profiles!guest_messages_created_by_fkey(
    id,
    email
  )
`;

/**
 * Simple select pattern for conversations (all columns, no joins)
 */
export const CONVERSATION_SIMPLE_SELECT = "*";

/**
 * Simple select pattern for messages (all columns, no joins)
 */
export const MESSAGE_SIMPLE_SELECT = "*";
