/**
 * Guest Conversation Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  conversationKeys,
  CONVERSATION_WITH_GUEST_SELECT,
  MESSAGE_WITH_DETAILS_SELECT,
} from "./guestConversation.constants";
import type {
  GuestConversationInsert,
  GuestConversationUpdate,
  GuestMessageInsert,
  GuestMessageUpdate,
  ConversationWithGuest,
  MessageWithDetails,
} from "./guestConversation.types";

// ============================================================================
// CONVERSATION QUERY HOOKS
// ============================================================================

/**
 * Get all conversations for a hotel
 * Includes guest and assigned staff details
 */
export const useGuestConversations = (hotelId: string) => {
  return useQuery({
    queryKey: conversationKeys.list(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .select(CONVERSATION_WITH_GUEST_SELECT)
        .eq("hotel_id", hotelId)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data as ConversationWithGuest[];
    },
    enabled: !!hotelId,
  });
};

/**
 * Get a single conversation by ID
 * Includes guest and assigned staff details
 */
export const useConversationById = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      const { data, error } = await supabase
        .from("guest_conversation")
        .select(CONVERSATION_WITH_GUEST_SELECT)
        .eq("id", conversationId)
        .single();

      if (error) throw error;
      return data as ConversationWithGuest;
    },
    enabled: !!conversationId,
  });
};

/**
 * Get conversation by guest ID
 * Useful for finding existing conversation for a guest
 * Returns null if no conversation exists yet
 */
export const useConversationByGuest = (
  guestId: string | undefined,
  hotelId: string
) => {
  return useQuery({
    queryKey: conversationKeys.byGuest(guestId || ""),
    queryFn: async () => {
      if (!guestId) {
        throw new Error("Guest ID is required");
      }

      const { data, error } = await supabase
        .from("guest_conversation")
        .select(CONVERSATION_WITH_GUEST_SELECT)
        .eq("guest_id", guestId)
        .eq("hotel_id", hotelId)
        .maybeSingle();

      if (error) throw error;
      return data as ConversationWithGuest | null;
    },
    enabled: !!guestId,
  });
};

// ============================================================================
// MESSAGE QUERY HOOKS
// ============================================================================

/**
 * Get all messages for a conversation
 * Includes guest and creator profile details
 */
export const useConversationMessages = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      const { data, error } = await supabase
        .from("guest_messages")
        .select(MESSAGE_WITH_DETAILS_SELECT)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as MessageWithDetails[];
    },
    enabled: !!conversationId,
  });
};

/**
 * Get unread messages count for a conversation
 */
export const useUnreadMessagesCount = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.unreadCount(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      const { count, error } = await supabase
        .from("guest_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .eq("sender_type", "guest");

      if (error) throw error;
      return count || 0;
    },
    enabled: !!conversationId,
  });
};

// ============================================================================
// CONVERSATION MUTATION HOOKS
// ============================================================================

/**
 * Create a new conversation
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationData: GuestConversationInsert) => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .insert(conversationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.list(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.byGuest(data.guest_id),
      });
    },
  });
};

/**
 * Update a conversation
 */
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: GuestConversationUpdate;
      hotelId: string;
    }) => {
      const { data, error } = await supabase
        .from("guest_conversation")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.list(variables.hotelId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.byGuest(data.guest_id),
      });
    },
  });
};

/**
 * Delete a conversation
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
      hotelId: string;
      guestId: string;
    }) => {
      const { error } = await supabase
        .from("guest_conversation")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.list(variables.hotelId),
      });
      queryClient.removeQueries({
        queryKey: conversationKeys.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.byGuest(variables.guestId),
      });
    },
  });
};

// ============================================================================
// MESSAGE MUTATION HOOKS
// ============================================================================

/**
 * Send a message in a conversation
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: GuestMessageInsert) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate messages list for this conversation
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(data.conversation_id),
      });
      // Invalidate conversation to update last_message_at
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(data.conversation_id),
      });
      // Invalidate hotel conversations list
      if (data.hotel_id) {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.list(data.hotel_id),
        });
      }
    },
  });
};

/**
 * Mark message(s) as read
 */
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageIds,
    }: {
      messageIds: string[];
      conversationId: string;
    }) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .update({ is_read: true })
        .in("id", messageIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.unreadCount(variables.conversationId),
      });
    },
  });
};

/**
 * Update a message
 */
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: GuestMessageUpdate;
      conversationId: string;
    }) => {
      const { data, error } = await supabase
        .from("guest_messages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(variables.conversationId),
      });
    },
  });
};

/**
 * Delete a message
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; conversationId: string }) => {
      const { error } = await supabase
        .from("guest_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(variables.conversationId),
      });
    },
  });
};
