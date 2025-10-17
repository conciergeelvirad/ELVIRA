import type {
  StaffConversation,
  StaffMessage,
} from "../../hooks/queries/chat/useStaffChatQueries";

// ===================================================
// TRANSFORMED TYPES (for UI consumption)
// ===================================================

export interface TransformedStaffConversation {
  id: string; // Either conversation ID or staff ID
  staffId?: string; // The actual staff member ID (for filtering duplicates)
  conversationId?: string; // The actual conversation ID (if exists)
  title: string;
  isGroup: boolean;
  staffName: string;
  staffPosition: string;
  staffAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  isExistingConversation?: boolean; // Flag to indicate if this is an actual conversation
}

export interface TransformedStaffMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string | null;
  fileUrl: string | null;
  voiceUrl: string | null;
  createdAt: Date;
  isDeleted: boolean;
}

// ===================================================
// TRANSFORM FUNCTIONS
// ===================================================

/**
 * Transform a staff message from the database to UI format.
 * Handles sender information and date parsing.
 */
export const transformStaffMessage = (
  message: StaffMessage
): TransformedStaffMessage => {
  const senderData = message.sender?.hotel_staff_personal_data;
  const senderName = senderData
    ? `${senderData.first_name} ${senderData.last_name}`.trim()
    : "Unknown User";

  return {
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    senderName,
    content: message.content,
    fileUrl: message.file_url,
    voiceUrl: message.voice_url,
    createdAt: message.created_at ? new Date(message.created_at) : new Date(),
    isDeleted: !!message.deleted_at,
  };
};

/**
 * Transform a single staff conversation to UI format.
 * Handles null checks, name formatting, and provides fallback values.
 */
export const transformStaffConversation = (
  conversation: StaffConversation
): TransformedStaffConversation | null => {
  try {
    // Validate required data
    if (!conversation || !conversation.id) {
      console.warn("Invalid conversation data:", conversation);
      return null;
    }

    // Extract staff data
    const staff = conversation.staff;
    const personalData = staff?.hotel_staff_personal_data;

    // Build staff name
    const staffName = personalData
      ? `${personalData.first_name} ${personalData.last_name}`.trim()
      : staff?.employee_id
      ? `Employee ${staff.employee_id}`
      : "Unknown Staff";

    // Build title (for group chats or custom titles)
    const title = conversation.is_group
      ? conversation.title || "Group Chat"
      : conversation.title || `Chat with ${staffName}`;

    return {
      id: conversation.id,
      staffId: staff?.id, // Store the staff member ID
      conversationId: conversation.id, // Store the conversation ID
      title,
      isGroup: conversation.is_group,
      staffName,
      staffPosition: staff?.position || "Staff Member",
      staffAvatar: personalData?.avatar_url || null,
      lastMessage: null, // Will be filled from last message if needed
      lastMessageAt: conversation.last_message_at
        ? new Date(conversation.last_message_at)
        : null,
      createdAt: new Date(conversation.created_at),
      isExistingConversation: true, // This is an actual conversation
    };
  } catch (error) {
    console.error("Error transforming conversation:", error);
    return null;
  }
};

/**
 * Transform an array of staff conversations.
 * Filters out invalid transformations and sorts by last message time.
 */
export const transformStaffConversations = (
  conversations: StaffConversation[]
): TransformedStaffConversation[] => {
  if (!Array.isArray(conversations)) {
    console.error("Invalid conversations array");
    return [];
  }

  console.log("🔄 Transforming conversations:", conversations.length);

  const transformed = conversations
    .map(transformStaffConversation)
    .filter((conv): conv is TransformedStaffConversation => conv !== null)
    .sort((a, b) => {
      // Sort by last message time, most recent first
      const timeA = a.lastMessageAt?.getTime() || 0;
      const timeB = b.lastMessageAt?.getTime() || 0;
      return timeB - timeA;
    });

  console.log("✅ Transformed conversations:", transformed.length);
  return transformed;
};

/**
 * Transform an array of staff messages.
 */
export const transformStaffMessages = (
  messages: StaffMessage[]
): TransformedStaffMessage[] => {
  if (!Array.isArray(messages)) {
    console.error("Invalid messages array");
    return [];
  }

  return messages.map(transformStaffMessage);
};

/**
 * Transform staff members into conversation-like format for the chat sidebar.
 * Used to display available staff to start new conversations.
 */
export const transformStaffMembersToConversations = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  staffMembers: any[]
): TransformedStaffConversation[] => {
  if (!Array.isArray(staffMembers)) {
    console.error("Invalid staff members array");
    return [];
  }

  const transformed = staffMembers
    .map((staff) => {
      try {
        if (!staff || !staff.id) return null;

        const personalData = staff.hotel_staff_personal_data;
        const staffName = personalData
          ? `${personalData.first_name} ${personalData.last_name}`.trim()
          : `Employee ${staff.employee_id}`;

        return {
          id: staff.id, // Use staff ID as the ID (since no conversation exists yet)
          staffId: staff.id, // Store the staff member ID
          conversationId: undefined, // No conversation exists yet
          title: `Chat with ${staffName}`,
          isGroup: false,
          staffName,
          staffPosition: staff.position || "Staff Member",
          staffAvatar: personalData?.avatar_url || null,
          lastMessage: null as string | null,
          lastMessageAt: null as Date | null,
          createdAt: new Date(),
          isExistingConversation: false, // This is just a contact, not a conversation yet
        };
      } catch (error) {
        console.error("Error transforming staff member:", error);
        return null;
      }
    })
    .filter((conv) => conv !== null) as TransformedStaffConversation[];

  return transformed.sort((a, b) => a.staffName.localeCompare(b.staffName)); // Sort alphabetically
};
