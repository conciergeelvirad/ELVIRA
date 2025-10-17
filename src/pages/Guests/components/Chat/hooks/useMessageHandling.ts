/**
 * useMessageHandling Hook
 *
 * Manages message state, transformations, and marking as read
 */

import { useEffect, useState } from "react";
import { useMarkMessagesAsRead } from "../../../../../hooks/queries/hotel-management/guest-conversations";
import type { Message } from "../../../../../types/chat";
import type { MessageWithDetails } from "../../../../../hooks/queries/hotel-management/guest-conversations/guestConversation.types";
import {
  transformMessages,
  countUnreadStaffMessages,
  getUnreadMessageIds,
} from "../utils/messageTransformers";

interface UseMessageHandlingProps {
  messagesData: MessageWithDetails[] | undefined;
  conversationId: string | undefined;
}

interface UseMessageHandlingReturn {
  messages: Message[];
  unreadCount: number;
}

export const useMessageHandling = ({
  messagesData,
  conversationId,
}: UseMessageHandlingProps): UseMessageHandlingReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { mutate: markAsRead } = useMarkMessagesAsRead();

  // Transform and set messages when data changes
  useEffect(() => {
    if (messagesData) {
      const transformed = transformMessages(messagesData);
      setMessages(transformed);

      // Count unread staff messages
      const unread = countUnreadStaffMessages(messagesData);
      setUnreadCount(unread);
    }
  }, [messagesData, conversationId]);

  // Mark messages as read when chat is viewed
  useEffect(() => {
    if (conversationId && unreadCount > 0 && messagesData) {
      const messageIds = getUnreadMessageIds(messagesData);

      markAsRead({
        conversationId,
        messageIds,
      });
    }
  }, [conversationId, unreadCount, markAsRead, messagesData]);

  return {
    messages,
    unreadCount,
  };
};
