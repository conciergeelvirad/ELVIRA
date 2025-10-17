import { AlertTriangle, AlertCircle, MessageSquare } from "lucide-react";
import { Message } from "../../types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isReceived = message.type === "received";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Determine if we should show alert badges (for guest messages from hotel perspective)
  const showAlertBadges =
    isReceived &&
    message.urgency &&
    message.sentiment &&
    (message.urgency.toLowerCase() === "high" ||
      message.urgency.toLowerCase() === "urgent" ||
      message.urgency.toLowerCase() === "medium") &&
    (message.sentiment.toLowerCase() === "negative" ||
      message.sentiment.toLowerCase() === "neutral");

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle className="w-3 h-3" />
            Urgent
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
            <AlertCircle className="w-3 h-3" />
            Medium
          </span>
        );
      default:
        return null;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "negative":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <MessageSquare className="w-3 h-3" />
            Negative
          </span>
        );
      case "neutral":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <MessageSquare className="w-3 h-3" />
            Neutral
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex mb-4 ${isReceived ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-xs lg:max-w-md ${isReceived ? "order-2" : "order-1"}`}
      >
        {isReceived && (
          <div className="flex items-center mb-1">
            <span className="text-xs font-medium text-gray-600">
              {message.sender.name}
            </span>
            {message.sender.roomNumber && (
              <span className="text-xs text-gray-500 ml-2 px-2 py-0.5 bg-gray-100 rounded">
                Room {message.sender.roomNumber}
              </span>
            )}
            <span className="text-xs text-gray-400 ml-2">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        <div
          className={`px-4 py-2 rounded-lg ${
            isReceived ? "bg-gray-100 text-gray-900" : "bg-blue-500 text-white"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>

        {/* Show alert badges for guest messages with medium/high urgency and negative/neutral sentiment */}
        {showAlertBadges && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.urgency && getUrgencyBadge(message.urgency)}
            {message.sentiment && getSentimentBadge(message.sentiment)}
          </div>
        )}

        {!isReceived && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}
      </div>

      {isReceived && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 order-1 mr-3">
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            message.sender.name.charAt(0).toUpperCase()
          )}
        </div>
      )}
    </div>
  );
};
