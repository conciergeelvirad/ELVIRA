import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useStaffChat } from "../../hooks/features/useStaffChat";
import { Conversation, ChatType } from "../../types";

interface StaffChatInterfaceProps {
  conversations: Conversation[];
  chatType: ChatType;
}

export const StaffChatInterface = ({
  conversations,
  chatType,
}: StaffChatInterfaceProps) => {
  const chat = useStaffChat(conversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSendMessage = async (content: string) => {
    if (chat.activeConversationId) {
      try {
        await chat.sendMessage(content);
      } catch (error) {
        console.error("Failed to send message:", error);
        // You could add a toast notification here
      }
    }
  };

  const handleConversationSelect = async (conversationId: string) => {
    console.log("👆 Conversation selected:", conversationId);

    // Check if this is a staff member (no existing conversation)
    const selectedConv = conversations.find((c) => c.id === conversationId);
    console.log("📋 Selected conversation data:", selectedConv);

    // If the conversation has no messages and lastMessage is "Start a conversation",
    // it means this is a staff member ID, not an existing conversation
    if (
      selectedConv &&
      selectedConv.lastMessage === "Start a conversation" &&
      selectedConv.messages.length === 0
    ) {
      console.log(
        "🆕 This is a staff member, creating/finding conversation:",
        conversationId
      );
      // Create a new conversation or find existing one
      const actualConversationId = await chat.createNewConversation(
        conversationId
      );
      if (actualConversationId) {
        console.log("✅ Conversation ready:", actualConversationId);
        // The hook will automatically set this as active in createNewConversation
      } else {
        console.error("❌ Failed to create/find conversation");
      }
    } else {
      // Existing conversation with messages, just open it
      console.log("📂 Opening existing conversation:", conversationId);
      chat.setActiveConversation(conversationId);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <ChatSidebar
        conversations={chat.conversations}
        activeConversationId={chat.activeConversationId}
        searchQuery={chat.searchQuery}
        chatType={chatType}
        onConversationSelect={handleConversationSelect}
        onSearchChange={chat.setSearchQuery}
      />

      <div className="flex-1 flex flex-col">
        {chat.activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
                  {chat.activeConversation.avatar ? (
                    <img
                      src={chat.activeConversation.avatar}
                      alt={chat.activeConversation.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    chat.activeConversation.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {chat.activeConversation.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {chat.activeConversation.status === "online"
                      ? "Online"
                      : chat.activeConversation.status === "away"
                      ? "Away"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : chat.messages.length > 0 ? (
                chat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Start a conversation
                  </p>
                  <p className="text-sm">
                    Send a message to begin chatting with{" "}
                    {chat.activeConversation.name}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder={`Message ${chat.activeConversation.name}...`}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Select a conversation
            </h3>
            <p className="text-sm">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
