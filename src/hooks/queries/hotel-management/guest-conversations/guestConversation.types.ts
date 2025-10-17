/**
 * Guest Conversation Type Definitions
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// BASE TYPES
// ============================================================================

export type GuestConversation = Tables<"guest_conversation">;
export type GuestMessage = Tables<"guest_messages">;
export type GuestConversationInsert = Insert<"guest_conversation">;
export type GuestMessageInsert = Insert<"guest_messages">;
export type GuestConversationUpdate = Update<"guest_conversation">;
export type GuestMessageUpdate = Update<"guest_messages">;

// ============================================================================
// EXTENDED TYPES
// ============================================================================

/**
 * Conversation with guest details
 *
 * Note: The conversation is between the guest and the hotel.
 * assigned_staff_id is stored but references profiles table for staff user accounts.
 * For simplicity, we don't fetch staff details in the initial query.
 */
export type ConversationWithGuest = GuestConversation & {
  guests?: {
    id: string;
    guest_name: string;
    room_number: string;
    guest_personal_data?: {
      first_name: string;
      last_name: string;
      guest_email: string;
      phone_number: string;
    }[];
  };
  unread_count?: number;
  last_message?: GuestMessage;
};

/**
 * Message with related guest and profile data
 */
export type MessageWithDetails = GuestMessage & {
  guests?: {
    id: string;
    guest_name: string;
    room_number: string;
  };
  created_by_profile?: {
    id: string;
    email: string;
  };
};

// ============================================================================
// ENUMS
// ============================================================================

export type SenderType = "guest" | "staff";
export type ConversationStatus = "open" | "closed" | "pending";
