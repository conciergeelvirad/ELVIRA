import { useState, useCallback } from "react";
import { ChatState, ChatActions, Conversation, Message } from "../types/chat";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChat = (
  initialConversations: Conversation[] = []
): ChatState & ChatActions => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  }, []);

  const setActiveConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      // Mark conversation as read when opened
      markAsRead(id);
    },
    [markAsRead]
  );

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const newMessage: Message = {
      id: generateId(),
      content,
      timestamp: new Date(),
      type: "sent",
      sender: {
        id: "current-user",
        name: "You",
      },
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content,
              timestamp: new Date(),
            }
          : conv
      )
    );
  }, []);

  return {
    conversations,
    activeConversationId,
    searchQuery,
    setActiveConversation,
    sendMessage,
    setSearchQuery,
    markAsRead,
  };
};
