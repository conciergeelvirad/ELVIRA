/**
 * Hotel Guest Chat Message Component
 *
 * Displays chat messages in hotel staff view with:
 * - Original message text
 * - Translated text (if available)
 * - Translation indicator
 * - Sentiment and urgency badges
 * - Timestamp
 */

import { MessageSquare, Globe, AlertCircle } from "lucide-react";

const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

interface HotelChatMessageProps {
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

export const HotelChatMessage = ({
  content,
  translatedContent,
  timestamp,
  isHotelMessage,
  senderName,
  isTranslated,
  sentiment,
  urgency,
}: HotelChatMessageProps) => {
  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency?.toLowerCase()) {
      case "high":
      case "urgent":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`flex ${
        isHotelMessage ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          isHotelMessage
            ? "bg-[#8B7355] text-white"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Sender Name */}
        {senderName && (
          <div
            className={`text-xs font-medium mb-1 ${
              isHotelMessage ? "text-white/80" : "text-gray-500"
            }`}
          >
            {senderName}
          </div>
        )}

        {/* Guest message with translation */}
        {!isHotelMessage && isTranslated && translatedContent && (
          <>
            {/* Original guest message (translated version shown to staff) */}
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-gray-500">
                  Translated to{" "}
                  {translatedContent ? "your language" : "English"}
                </span>
              </div>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {translatedContent}
              </p>
            </div>

            {/* Original text (collapsed/smaller) */}
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                View original message
              </summary>
              <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-gray-200 whitespace-pre-wrap">
                {content}
              </p>
            </details>
          </>
        )}

        {/* Hotel message with translation indicator */}
        {isHotelMessage && isTranslated && (
          <>
            {/* Your message (in hotel language) */}
            <p className="text-sm whitespace-pre-wrap">{content}</p>

            {/* Translation indicator */}
            <div className="flex items-center gap-1 mt-2 text-xs text-white/70">
              <Globe className="w-3 h-3" />
              <span>Translated for guest</span>
            </div>
          </>
        )}

        {/* Regular message without translation */}
        {!isTranslated && (
          <p
            className={`text-sm whitespace-pre-wrap ${
              isHotelMessage ? "text-white" : "text-gray-900"
            }`}
          >
            {content}
          </p>
        )}

        {/* Sentiment and Urgency Badges (Guest messages only) */}
        {!isHotelMessage && (sentiment || urgency) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {sentiment && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                  sentiment
                )}`}
              >
                <MessageSquare className="w-3 h-3" />
                {sentiment}
              </span>
            )}
            {urgency && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                  urgency
                )}`}
              >
                <AlertCircle className="w-3 h-3" />
                {urgency}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${
            isHotelMessage ? "text-white/70" : "text-gray-500"
          }`}
        >
          {formatMessageTime(timestamp)}
        </div>
      </div>
    </div>
  );
};
