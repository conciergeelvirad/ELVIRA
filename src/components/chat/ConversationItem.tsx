import { Conversation } from "../../types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const ConversationItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div
      onClick={() => onClick(conversation.id)}
      className={`flex items-center p-3 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50 ${
        isActive ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="relative mr-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
          {conversation.avatar ? (
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            conversation.name.charAt(0).toUpperCase()
          )}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
            conversation.status
          )}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {conversation.name}
          </h4>
          {conversation.timestamp && (
            <span className="text-xs text-gray-500">
              {formatTime(conversation.timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage || "No messages yet"}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
