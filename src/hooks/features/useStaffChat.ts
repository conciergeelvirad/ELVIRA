import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import {
  useStaffConversationMessages,
  useSendStaffMessage,
  useCreateStaffConversation,
  staffChatKeys,
} from "../queries/chat/useStaffChatQueries";
import type { Conversation, Message } from "../../types";

interface UseStaffChatReturn {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | undefined;
  messages: Message[];
  isLoadingMessages: boolean;
  searchQuery: string;
  setActiveConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  createNewConversation: (staffId: string) => Promise<string | null>;
}

export const useStaffChat = (
  initialConversations: Conversation[] = []
): UseStaffChatReturn => {
  const queryClient = useQueryClient();
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [creatingConversationWith, setCreatingConversationWith] = useState<
    string | null
  >(null);

  // Mutations
  const sendMessageMutation = useSendStaffMessage();
  const createConversationMutation = useCreateStaffConversation();

  // Fetch messages for active conversation
  const { data: messagesData = [], isLoading: isLoadingMessages } =
    useStaffConversationMessages(activeConversationId || undefined);

  // Get current user ID
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    getSession();
  }, []);

  // Update conversations when prop changes
  useEffect(() => {
    setConversations(initialConversations);
    // Clear creating state when conversations update (means new conversation was created)
    setCreatingConversationWith(null);
  }, [initialConversations]);

  // Transform database messages to UI format
  const messages: Message[] = messagesData.map((msg) => {
    const isCurrentUser = msg.sender_id === currentUserId;
    const senderData = msg.sender?.hotel_staff_personal_data;
    const senderName = senderData
      ? `${senderData.first_name} ${senderData.last_name}`.trim()
      : "Unknown";

    return {
      id: msg.id,
      content: msg.content || "",
      timestamp: new Date(msg.created_at),
      type: isCurrentUser ? ("sent" as const) : ("received" as const),
      sender: {
        id: msg.sender_id,
        name: isCurrentUser ? "You" : senderName,
      },
    };
  });

  // Update active conversation with messages
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const updatedActiveConversation = activeConversation
    ? { ...activeConversation, messages }
    : undefined;

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!activeConversationId) return;

    console.log(
      "🔔 Setting up real-time subscription for:",
      activeConversationId
    );

    const channel = supabase
      .channel(`staff-messages-${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "staff_messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          console.log("📨 New message received:", payload);
          // Invalidate messages query to refetch
          queryClient.invalidateQueries({
            queryKey: staffChatKeys.messages(activeConversationId),
          });
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    return () => {
      console.log("🔕 Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, queryClient]);

  // Set up real-time subscription for conversation updates
  useEffect(() => {
    console.log("🔔 Setting up real-time subscription for conversations");

    const channel = supabase
      .channel("staff-conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "staff_conversations",
        },
        (payload) => {
          console.log("💬 Conversation updated:", payload);
          // Invalidate conversations query to refetch
          queryClient.invalidateQueries({
            queryKey: staffChatKeys.conversations(),
          });
        }
      )
      .subscribe((status) => {
        console.log("📡 Conversations subscription status:", status);
      });

    return () => {
      console.log("🔕 Cleaning up conversations subscription");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const setActiveConversation = useCallback((id: string) => {
    console.log("📂 Setting active conversation:", id);
    setActiveConversationId(id);
    // Clear the creating state when switching to any conversation
    setCreatingConversationWith(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId) {
        console.error("❌ No active conversation");
        return;
      }

      try {
        console.log("📤 Sending message:", { activeConversationId, content });
        await sendMessageMutation.mutateAsync({
          conversationId: activeConversationId,
          content,
        });
        console.log("✅ Message sent successfully");
      } catch (error) {
        console.error("❌ Error sending message:", error);
        throw error;
      }
    },
    [activeConversationId, sendMessageMutation]
  );

  const createNewConversation = useCallback(
    async (staffId: string) => {
      if (creatingConversationWith === staffId) {
        console.log("⚠️ Already creating conversation with this staff member");
        return;
      }

      setCreatingConversationWith(staffId);
      console.log("🆕 Creating new conversation with staff:", staffId);

      try {
        console.log(
          "🔍 Checking for existing conversation with staff:",
          staffId
        );

        // Check if conversation already exists
        const existingConv = conversations.find((conv) => {
          const otherParticipants = conv.participants?.filter(
            (p) => p.staff_id !== currentUserId
          );
          return otherParticipants?.some((p) => p.staff_id === staffId);
        });

        if (existingConv) {
          console.log("✅ Found existing conversation:", existingConv.id);
          setActiveConversation(existingConv.id);
          setCreatingConversationWith(null);
          return;
        }

        console.log(
          "📝 No existing conversation found, creating new one with staff:",
          staffId
        );

        // Simply create the conversation with the hotel_staff.id
        // The database now expects hotel_staff.id in staff_conversation_participants
        const conversation = await createConversationMutation.mutateAsync({
          participantId: staffId, // This is hotel_staff.id
        });

        console.log("✅ Conversation created:", conversation.id);
        setActiveConversation(conversation.id);
      } catch (error) {
        console.error("❌ Error creating conversation:", error);
      } finally {
        setCreatingConversationWith(null);
      }
    },
    [
      conversations,
      currentUserId,
      creatingConversationWith,
      createConversationMutation,
      setActiveConversation,
    ]
  );

  return {
    conversations,
    activeConversationId,
    activeConversation: updatedActiveConversation,
    messages,
    isLoadingMessages,
    searchQuery,
    setActiveConversation,
    sendMessage,
    setSearchQuery,
    createNewConversation,
  };
};
