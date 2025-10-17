export type MessageType = "sent" | "received";
export type ChatType = "guest" | "staff";

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    roomNumber?: string; // Guest room number
  };
  // AI Analysis metadata (for guest messages)
  sentiment?: string | null;
  urgency?: string | null;
  topics?: string[] | null;
  // Translation metadata
  isTranslated?: boolean;
  originalText?: string;
  translatedText?: string | null;
}

export interface Conversation {
  id: string; // For staff: hotel_staff.id | For guest: conversation_id
  conversationId?: string; // Actual conversation ID if exists (for staff chat)
  name: string;
  lastMessage?: string;
  timestamp?: Date;
  unreadCount: number;
  avatar?: string;
  status: "online" | "offline" | "away";
  type: ChatType;
  messages: Message[];
  isExistingConversation?: boolean; // Flag to indicate if conversation already exists
  guestId?: string; // Guest ID for translation purposes
  staffId?: string; // Staff ID for staff chat
  roomNumber?: string; // Guest room number (for hotel staff view)
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  searchQuery: string;
}

export interface ChatActions {
  setActiveConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  setSearchQuery: (query: string) => void;
  markAsRead: (conversationId: string) => void;
}
