/**
 * useMessageSubscription Hook
 *
 * Manages real-time subscription to new messages in a conversation
 */

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../../lib/supabase";
import { conversationKeys } from "../../../../../hooks/queries/hotel-management/guest-conversations";

interface UseMessageSubscriptionProps {
  conversationId: string | undefined;
  onNewMessage?: () => void;
}

export const useMessageSubscription = ({
  conversationId,
  onNewMessage,
}: UseMessageSubscriptionProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`guest-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guest_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // Invalidate messages query to trigger refetch
          queryClient.invalidateQueries({
            queryKey: conversationKeys.messages(conversationId),
          });

          // Trigger callback if provided
          onNewMessage?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage, queryClient]);
};
