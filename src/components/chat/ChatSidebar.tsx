import { Search } from "lucide-react";
import { SearchInput } from "../common";
import { ConversationItem } from "./ConversationItem";
import { Conversation, ChatType } from "../../types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  searchQuery: string;
  chatType: ChatType;
  onConversationSelect: (id: string) => void;
  onSearchChange: (query: string) => void;
}

export const ChatSidebar = ({
  conversations,
  activeConversationId,
  searchQuery,
  chatType,
  onConversationSelect,
  onSearchChange,
}: ChatSidebarProps) => {
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.type === chatType &&
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTitle = () => {
    return chatType === "guest" ? "Guest Communication" : "Staff Members";
  };

  const getSearchPlaceholder = () => {
    return chatType === "guest"
      ? "Search conversations..."
      : "Search staff members...";
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {getTitle()}
        </h3>
        <SearchInput
          placeholder={getSearchPlaceholder()}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onClick={onConversationSelect}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Search className="w-8 h-8 mb-2" />
            <p className="text-sm">
              {searchQuery
                ? "No conversations found"
                : chatType === "guest"
                ? "No guest conversations"
                : "Staff communication will be implemented later"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
