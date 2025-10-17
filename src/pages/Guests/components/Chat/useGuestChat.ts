/**
 * useGuestChat Hook (Refactored)
 *
 * Custom hook for managing guest-to-staff chat functionality
 *
 * Features:
 * - Automatically creates or fetches existing conversation
 * - Fetches and displays messages
 * - Sends new messages
 * - Marks messages as read
 * - Real-time message subscriptions
 *
 * Uses existing query hooks from hotel-management/guest-conversations
 *
 * Refactored into:
 * - useConversationSetup: Handles conversation creation with staff assignment
 * - useMessageHandling: Manages message state and marking as read
 * - useMessageSubscription: Real-time message updates
 * - messageTransformers: Transform database messages to UI format
 * - staffAssignment: Find and assign suitable staff members
 */

import { useEffect, useRef } from "react";
import {
  useConversationByGuest,
  useConversationMessages,
  useSendMessage,
} from "../../../../hooks/queries/hotel-management/guest-conversations";
import type { Message } from "../../../../types/chat";
import {
  useMessageSubscription,
  useConversationSetup,
  useMessageHandling,
  useMessageAnalysis,
} from "./hooks";

interface UseGuestChatProps {
  guestId: string;
  hotelId: string;
}

interface UseGuestChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  conversationId: string | undefined;
  unreadCount: number;
}

export const useGuestChat = ({
  guestId,
  hotelId,
}: UseGuestChatProps): UseGuestChatReturn => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Query hooks
  const {
    data: conversation,
    isLoading: isLoadingConversation,
    error: conversationError,
  } = useConversationByGuest(guestId, hotelId);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useConversationMessages(conversation?.id);

  // Mutation hooks
  const { mutate: sendMessageMutation } = useSendMessage();

  const conversationId = conversation?.id;

  // Setup conversation creation
  const { createConversationWithStaff } = useConversationSetup({
    guestId,
    hotelId,
  });

  // Setup AI analysis and translation
  const { analyzeMessage } = useMessageAnalysis({
    guestId,
    hotelId,
    enabled: true,
  });

  // Handle message transformations and read status
  const { messages, unreadCount } = useMessageHandling({
    messagesData,
    conversationId,
  });

  // Setup realtime subscription
  useMessageSubscription({ conversationId });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Send a new message
   * Creates conversation if it doesn't exist (with assigned staff)
   * Automatically triggers AI analysis after sending
   */
  const sendMessage = async (content: string) => {
    // If no conversation exists, create one first
    if (!conversationId) {
      const newConversationId = await createConversationWithStaff();

      if (!newConversationId) {
        console.error(
          "❌ [useGuestChat] Cannot send message: Failed to create conversation"
        );
        return;
      }

      // Now send the message with the new conversation ID
      sendMessageMutation(
        {
          conversation_id: newConversationId,
          hotel_id: hotelId,
          message_text: content,
          sender_type: "guest",
          guest_id: guestId,
          is_read: false,
        },
        {
          onSuccess: (data) => {
            // Trigger AI analysis after message is saved
            analyzeMessage(data.id, content).catch((error) => {
              console.error(
                "⚠️ [useGuestChat] AI analysis failed (non-blocking):",
                error
              );
            });
          },
        }
      );
    } else {
      // Conversation exists, just send the message
      sendMessageMutation(
        {
          conversation_id: conversationId,
          hotel_id: hotelId,
          message_text: content,
          sender_type: "guest",
          guest_id: guestId,
          is_read: false,
        },
        {
          onSuccess: (data) => {
            // Trigger AI analysis after message is saved
            analyzeMessage(data.id, content).catch((error) => {
              console.error(
                "⚠️ [useGuestChat] AI analysis failed (non-blocking):",
                error
              );
            });
          },
        }
      );
    }
  };

  return {
    messages,
    isLoading: isLoadingConversation || isLoadingMessages,
    error: (conversationError || messagesError) as Error | null,
    sendMessage,
    conversationId,
    unreadCount,
  };
};
