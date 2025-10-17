/**
 * Hotel Guest Chat Hook
 *
 * Manages hotel staff conversations with guests
 * - Fetches and displays messages (with translations)
 * - Sends messages with automatic translation to guest language
 * - Real-time message updates
 * - Shows both original and translated text for context
 */

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  useConversationMessages,
  useSendMessage,
} from "./useGuestConversationQueries";
import { useHotelMessageAnalysis } from "./useHotelMessageAnalysis";
import type { GuestMessageInsert } from "./guestConversation.types";

interface UseHotelGuestChatProps {
  conversationId: string | null;
  hotelId: string;
  guestId: string | null;
  staffProfileId: string; // Current staff member's profile ID
}

interface ChatMessage {
  id: string;
  content: string;
  translatedContent?: string | null;
  timestamp: Date;
  isHotelMessage: boolean;
  senderName?: string;
  isTranslated?: boolean;
  sentiment?: string | null;
  urgency?: string | null;
}

export const useHotelGuestChat = ({
  conversationId,
  hotelId,
  guestId,
  staffProfileId,
}: UseHotelGuestChatProps) => {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);

  // Fetch messages from database
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useConversationMessages(conversationId || undefined);

  // Get translation capabilities
  const {
    guestLanguage,
    hotelLanguages,
    isLoading: isLoadingLanguages,
    translateOutgoingMessage,
  } = useHotelMessageAnalysis({
    hotelId,
    guestId,
  });

  // Send message mutation
  const sendMessageMutation = useSendMessage();

  // Transform database messages to chat format
  const messages: ChatMessage[] = (messagesData || []).map((msg) => {
    const isHotelMessage = msg.sender_type === "hotel_staff";
    const creatorProfile = Array.isArray(msg.created_by_profile)
      ? msg.created_by_profile[0]
      : msg.created_by_profile;

    return {
      id: msg.id,
      content: msg.message_text,
      translatedContent: msg.translated_text || null,
      timestamp: new Date(msg.created_at),
      isHotelMessage,
      senderName: isHotelMessage
        ? creatorProfile?.display_name || creatorProfile?.email || "Hotel Staff"
        : "Guest",
      isTranslated: msg.is_translated || false,
      sentiment: msg.sentiment || null,
      urgency: msg.urgency || null,
    };
  });

  /**
   * Sends a message from hotel staff to guest
   * Automatically translates if guest speaks different language
   */
  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || isSending) return;

    setIsSending(true);

    try {
      // Translate message to guest's language if needed
      const { translatedText, wasTranslated } = await translateOutgoingMessage(
        content
      );

      // Prepare message data
      const messageData: GuestMessageInsert = {
        conversation_id: conversationId,
        message_text: content, // Original message in hotel language
        translated_text: wasTranslated ? translatedText : null,
        is_translated: wasTranslated,
        sender_type: "hotel_staff",
        created_by: staffProfileId,
        hotel_id: hotelId,
      };

      // Send message to database
      await sendMessageMutation.mutateAsync(messageData);

      // Update conversation last_message_at
      await supabase
        .from("guest_conversation")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({
        queryKey: ["guest-conversations", "messages", conversationId],
      });
    } catch (error) {
      console.error("❌ [Hotel Chat] Failed to send message:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guest_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // Refresh messages when new message arrives
          queryClient.invalidateQueries({
            queryKey: ["guest-conversations", "messages", conversationId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return {
    messages,
    isLoading: isLoadingMessages || isLoadingLanguages,
    error: messagesError,
    sendMessage,
    isSending,
    guestLanguage,
    hotelLanguages,
    translationEnabled: guestLanguage !== null && hotelLanguages !== null,
  };
};
