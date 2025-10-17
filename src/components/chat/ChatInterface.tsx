import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "../../hooks";
import { Conversation, Message, ChatType } from "../../types";

interface ChatInterfaceProps {
  conversations: Conversation[];
  chatType: ChatType;
  customChatHook?: ReturnType<typeof useChat>; // Allow passing custom hook
}

export const ChatInterface = ({
  conversations: initialConversations,
  chatType,
  customChatHook,
}: ChatInterfaceProps) => {
  // Use custom hook if provided, otherwise use default useChat
  const defaultChat = useChat(initialConversations);
  const chat = customChatHook || defaultChat;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = chat.conversations.find(
    (conv: Conversation) => conv.id === chat.activeConversationId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = (content: string) => {
    if (chat.activeConversationId) {
      chat.sendMessage(chat.activeConversationId, content);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <ChatSidebar
        conversations={chat.conversations}
        activeConversationId={chat.activeConversationId}
        searchQuery={chat.searchQuery}
        chatType={chatType}
        onConversationSelect={chat.setActiveConversation}
        onSearchChange={chat.setSearchQuery}
      />

      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
                  {activeConversation.avatar ? (
                    <img
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    activeConversation.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activeConversation.name}
                    </h3>
                    {activeConversation.roomNumber && (
                      <span className="text-sm text-gray-500">
                        • Room {activeConversation.roomNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {activeConversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.messages.length > 0 ? (
                activeConversation.messages.map((message: Message) => (
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
                    {activeConversation.name}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder={`Message ${activeConversation.name}...`}
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
