/**
 * Message Transformers
 *
 * Utilities for transforming messages between database and UI formats
 */

import type { Message } from "../../../../../types/chat";
import type { MessageWithDetails } from "../../../../../hooks/queries/hotel-management/guest-conversations/guestConversation.types";

/**
 * Transform database message to chat UI message format
 */
export const transformMessage = (msg: MessageWithDetails): Message => {
  const isGuest = msg.sender_type === "guest";

  // For hotel staff messages, show translated text if available (for guest view)
  // For guest messages, always show original text
  const displayContent = !isGuest && msg.is_translated && msg.translated_text
    ? msg.translated_text
    : msg.message_text;

  return {
    id: msg.id,
    content: displayContent,
    timestamp: new Date(msg.created_at),
    type: isGuest ? "sent" : "received",
    sender: {
      id: msg.created_by || "",
      name: isGuest
        ? msg.guests?.guest_name || "Guest"
        : msg.created_by_profile?.email?.split("@")[0] || "Staff",
      avatar: undefined, // Can add avatar logic later
    },
  };
};

/**
 * Transform array of database messages to UI format
 */
export const transformMessages = (
  messages: MessageWithDetails[]
): Message[] => {
  return messages.map(transformMessage);
};

/**
 * Count unread staff messages
 */
export const countUnreadStaffMessages = (
  messages: MessageWithDetails[]
): number => {
  return messages.filter((msg) => msg.sender_type === "staff" && !msg.is_read)
    .length;
};

/**
 * Get unread message IDs for marking as read
 */
export const getUnreadMessageIds = (
  messages: MessageWithDetails[]
): string[] => {
  return messages
    .filter((msg) => msg.sender_type === "staff" && !msg.is_read)
    .map((msg) => msg.id);
};
