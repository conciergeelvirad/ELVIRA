/**
 * Guest Conversations Module
 * Barrel export for all guest conversation-related functionality
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  GuestConversation,
  GuestMessage,
  GuestConversationInsert,
  GuestMessageInsert,
  GuestConversationUpdate,
  GuestMessageUpdate,
  ConversationWithGuest,
  MessageWithDetails,
  SenderType,
  ConversationStatus,
} from "./guestConversation.types";

// ============================================================================
// CONSTANT EXPORTS
// ============================================================================

export {
  conversationKeys,
  CONVERSATION_WITH_GUEST_SELECT,
  MESSAGE_WITH_DETAILS_SELECT,
  CONVERSATION_SIMPLE_SELECT,
  MESSAGE_SIMPLE_SELECT,
} from "./guestConversation.constants";

// ============================================================================
// TRANSFORMER EXPORTS
// ============================================================================

export {
  // Conversation utilities
  getGuestFullName,
  getAssignedStaffName,
  getGuestRoomNumber,
  hasUnreadMessages,
  sortByLastMessage,
  filterByStatus,
  filterUnreadConversations,
  searchConversations,
  // Message utilities
  getMessageSenderName,
  isGuestMessage,
  isMessageUnread,
  filterMessagesBySender,
  getUnreadMessages,
  countUnreadMessages,
  groupMessagesByDate,
  formatMessageTime,
  formatLastMessageTime,
} from "./guestConversation.transformers";

// ============================================================================
// CONVERSATION QUERY HOOK EXPORTS
// ============================================================================

export {
  useGuestConversations,
  useConversationById,
  useConversationByGuest,
} from "./useGuestConversationQueries";

// ============================================================================
// MESSAGE QUERY HOOK EXPORTS
// ============================================================================

export {
  useConversationMessages,
  useUnreadMessagesCount,
} from "./useGuestConversationQueries";

// ============================================================================
// CONVERSATION MUTATION HOOK EXPORTS
// ============================================================================

export {
  useCreateConversation,
  useUpdateConversation,
  useDeleteConversation,
} from "./useGuestConversationQueries";

// ============================================================================
// MESSAGE MUTATION HOOK EXPORTS
// ============================================================================

export {
  useSendMessage,
  useMarkMessagesAsRead,
  useUpdateMessage,
  useDeleteMessage,
} from "./useGuestConversationQueries";

// ============================================================================
// HOTEL CHAT HOOK EXPORTS (with translation support)
// ============================================================================

export { useHotelMessageAnalysis } from "./useHotelMessageAnalysis";
export { useHotelGuestChat } from "./useHotelGuestChat";
export { useHotelChatIntegration } from "./useHotelChatIntegration";
