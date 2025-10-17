/**
 * Guest Conversation Transformers
 * Utility functions for data transformation and filtering
 */

import type {
  GuestConversation,
  ConversationWithGuest,
  GuestMessage,
  MessageWithDetails,
  SenderType,
} from "./guestConversation.types";

// ============================================================================
// CONVERSATION UTILITIES
// ============================================================================

/**
 * Get the full name of the guest from conversation
 */
export const getGuestFullName = (
  conversation: ConversationWithGuest
): string => {
  const personalData = conversation.guests?.guest_personal_data?.[0];
  if (personalData?.first_name && personalData?.last_name) {
    return `${personalData.first_name} ${personalData.last_name}`;
  }
  return conversation.guests?.guest_name || "Unknown Guest";
};

/**
 * Get the full name of the assigned staff
 * Note: Staff data is not fetched in the query for simplicity
 */
export const getAssignedStaffName = (
  _conversation: ConversationWithGuest
): string | null => {
  // Staff details would need to be fetched separately if needed
  return null;
};

/**
 * Get guest room number
 */
export const getGuestRoomNumber = (
  conversation: ConversationWithGuest
): string => {
  return conversation.guests?.room_number || "N/A";
};

/**
 * Check if conversation has unread messages
 */
export const hasUnreadMessages = (
  conversation: ConversationWithGuest
): boolean => {
  return (conversation.unread_count ?? 0) > 0;
};

/**
 * Sort conversations by last message time (newest first)
 */
export const sortByLastMessage = (
  conversations: (GuestConversation | ConversationWithGuest)[]
): typeof conversations => {
  return [...conversations].sort((a, b) => {
    const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
    const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Filter conversations by status
 */
export const filterByStatus = (
  conversations: (GuestConversation | ConversationWithGuest)[],
  status: string
): typeof conversations => {
  return conversations.filter((conv) => conv.status === status);
};

/**
 * Filter conversations with unread messages
 */
export const filterUnreadConversations = (
  conversations: ConversationWithGuest[]
): ConversationWithGuest[] => {
  return conversations.filter((conv) => hasUnreadMessages(conv));
};

/**
 * Search conversations by guest name or room number
 */
export const searchConversations = (
  conversations: ConversationWithGuest[],
  searchText: string
): ConversationWithGuest[] => {
  if (!searchText.trim()) return conversations;

  const lowerSearch = searchText.toLowerCase().trim();

  return conversations.filter((conv) => {
    const guestName = getGuestFullName(conv).toLowerCase();
    const roomNumber = getGuestRoomNumber(conv).toLowerCase();
    const staffName = getAssignedStaffName(conv)?.toLowerCase() || "";

    return (
      guestName.includes(lowerSearch) ||
      roomNumber.includes(lowerSearch) ||
      staffName.includes(lowerSearch)
    );
  });
};

// ============================================================================
// MESSAGE UTILITIES
// ============================================================================

/**
 * Get message sender name
 */
export const getMessageSenderName = (message: MessageWithDetails): string => {
  if (message.sender_type === "guest") {
    return message.guests?.guest_name || "Guest";
  }
  return message.created_by_profile?.email || "Staff";
};

/**
 * Check if message is from guest
 */
export const isGuestMessage = (message: GuestMessage): boolean => {
  return message.sender_type === "guest";
};

/**
 * Check if message is unread
 */
export const isMessageUnread = (message: GuestMessage): boolean => {
  return !message.is_read;
};

/**
 * Filter messages by sender type
 */
export const filterMessagesBySender = (
  messages: GuestMessage[],
  senderType: SenderType
): GuestMessage[] => {
  return messages.filter((msg) => msg.sender_type === senderType);
};

/**
 * Get unread messages from a list
 */
export const getUnreadMessages = (messages: GuestMessage[]): GuestMessage[] => {
  return messages.filter((msg) => isMessageUnread(msg));
};

/**
 * Count unread messages
 */
export const countUnreadMessages = (messages: GuestMessage[]): number => {
  return getUnreadMessages(messages).length;
};

/**
 * Group messages by date
 */
export const groupMessagesByDate = (
  messages: GuestMessage[]
): Record<string, GuestMessage[]> => {
  const grouped: Record<string, GuestMessage[]> = {};

  messages.forEach((message) => {
    if (!message.created_at) return;

    const date = new Date(message.created_at).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(message);
  });

  return grouped;
};

/**
 * Format message timestamp for display
 */
export const formatMessageTime = (message: GuestMessage): string => {
  if (!message.created_at) return "";

  const date = new Date(message.created_at);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format conversation last message time
 */
export const formatLastMessageTime = (
  conversation: GuestConversation
): string => {
  if (!conversation.last_message_at) return "No messages";

  const date = new Date(conversation.last_message_at);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
