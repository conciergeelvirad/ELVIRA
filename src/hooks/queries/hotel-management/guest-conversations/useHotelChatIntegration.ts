/**
 * Hotel Guest Chat Integration Hook
 *
 * Bridges the gap between database guest_messages and the ChatInterface component
 * Handles:
 * - Real-time message fetching and updates
 * - Automatic translation of messages (guest → hotel, hotel → guest)
 * - Message sending with translation
 * - Displaying translated content alongside original
 */

import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  useConversationMessages,
  useSendMessage,
  conversationKeys,
} from "../../../../hooks/queries/hotel-management/guest-conversations";
import { useHotelMessageAnalysis } from "./useHotelMessageAnalysis";
import type { GuestMessageInsert } from "./guestConversation.types";
import type { Conversation, Message } from "../../../../types/chat";

interface UseHotelChatIntegrationProps {
  conversations: Conversation[];
  hotelId: string;
  staffProfileId: string;
}

export const useHotelChatIntegration = ({
  conversations,
  hotelId,
  staffProfileId,
}: UseHotelChatIntegrationProps) => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get active conversation details
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  // Get guest ID from active conversation
  const guestId = activeConversation?.guestId || null;

  // Fetch messages for active conversation
  const {
    data: dbMessages,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useConversationMessages(activeConversationId || undefined);

  // Get translation capabilities for active conversation
  const {
    guestLanguage,
    hotelLanguages,
    translateOutgoingMessage,
    isLoading: isLoadingLanguages,
  } = useHotelMessageAnalysis({
    hotelId,
    guestId: guestId || null,
  });

  // Send message mutation
  const sendMessageMutation = useSendMessage();

  // Transform database messages to chat UI format
  const transformedMessages: Message[] = (dbMessages || []).map((msg) => {
    const isHotelMessage = msg.sender_type === "hotel_staff";
    const creatorProfile = Array.isArray(msg.created_by_profile)
      ? msg.created_by_profile[0]
      : msg.created_by_profile;

    // Get guest data for room number
    const guestData = Array.isArray(msg.guests) ? msg.guests[0] : msg.guests;

    // Determine which text to display
    let displayContent = msg.message_text;

    // For guest messages that were translated, show the translated version to hotel staff
    if (!isHotelMessage && msg.is_translated && msg.translated_text) {
      displayContent = msg.translated_text;
    }

    // For hotel messages, show original (the translated version is for the guest)
    if (isHotelMessage) {
      displayContent = msg.message_text;
    }

    return {
      id: msg.id,
      content: displayContent,
      timestamp: new Date(msg.created_at),
      type: isHotelMessage ? "sent" : "received",
      sender: {
        id: msg.created_by || "guest",
        name: isHotelMessage
          ? creatorProfile?.display_name ||
            creatorProfile?.email ||
            "Hotel Staff"
          : "Guest",
        avatar: undefined,
        roomNumber: !isHotelMessage ? guestData?.room_number : undefined, // Add room number for guest messages
      },
      // Store additional metadata for display
      originalText: msg.message_text,
      translatedText: msg.translated_text,
      isTranslated: msg.is_translated || false,
      sentiment: msg.sentiment,
      urgency: msg.urgency,
    } as Message;
  });

  // Update conversations with fetched messages
  const conversationsWithMessages: Conversation[] = conversations.map(
    (conv) => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: transformedMessages,
        };
      }
      return conv;
    }
  );

  // Handle conversation selection
  const setActiveConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  // Handle sending message
  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      if (!content.trim() || !conversationId) return;

      try {
        // Translate message to guest's language if needed
        const { translatedText, wasTranslated } =
          await translateOutgoingMessage(content);

        // Prepare message data
        const messageData: GuestMessageInsert = {
          conversation_id: conversationId,
          message_text: content, // Original text in hotel language
          translated_text: wasTranslated ? translatedText : null,
          is_translated: wasTranslated,
          sender_type: "hotel_staff",
          created_by: staffProfileId,
          hotel_id: hotelId,
        };

        // Send message to database
        await sendMessageMutation.mutateAsync(messageData);

        // Update conversation's last_message_at timestamp
        await supabase
          .from("guest_conversation")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);

        // Refresh messages
        queryClient.invalidateQueries({
          queryKey: conversationKeys.messages(conversationId),
        });
      } catch (error) {
        console.error("❌ [Hotel Chat] Failed to send message:", error);
        throw error;
      }
    },
    [
      translateOutgoingMessage,
      staffProfileId,
      hotelId,
      sendMessageMutation,
      queryClient,
    ]
  );

  // Mark as read (placeholder for future implementation)
  const markAsRead = useCallback((conversationId: string) => {
    // TODO: Implement mark as read functionality
    console.log("Mark as read:", conversationId);
  }, []);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!activeConversationId) return;

    const channel = supabase
      .channel(`hotel-chat:${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guest_messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        () => {
          // Refresh messages when new message arrives
          queryClient.invalidateQueries({
            queryKey: conversationKeys.messages(activeConversationId),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, queryClient]);

  return {
    conversations: conversationsWithMessages,
    activeConversationId,
    searchQuery,
    setActiveConversation,
    sendMessage,
    setSearchQuery,
    markAsRead,
    isLoading: isLoadingMessages || isLoadingLanguages,
    error: messagesError,
    translationInfo: {
      guestLanguage,
      hotelLanguages,
      enabled: guestLanguage !== null && hotelLanguages !== null,
    },
  };
};
