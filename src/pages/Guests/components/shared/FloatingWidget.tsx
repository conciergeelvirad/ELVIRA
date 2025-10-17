/**
 * Floating Widget Component
 *
 * A bell icon that floats in the bottom-right corner
 * When clicked, shows two smaller buttons: clock and chat
 * Stays behind modals (z-index controlled)
 */

import { useState } from "react";
import { Bell, Clock, MessageCircle } from "lucide-react";

interface FloatingWidgetProps {
  onClockClick?: () => void;
  onChatClick?: () => void;
}

export const FloatingWidget = ({
  onClockClick,
  onChatClick,
}: FloatingWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBellClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClockClick = () => {
    onClockClick?.();
  };

  const handleChatClick = () => {
    onChatClick?.();
  };

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col items-end gap-3">
      {/* Secondary Buttons - Clock and Chat (appear above bell) */}
      {isExpanded && (
        <>
          {/* Chat Button */}
          <button
            onClick={handleChatClick}
            className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center animate-fade-in"
            aria-label="Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Clock Button */}
          <button
            onClick={handleClockClick}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center animate-fade-in"
            aria-label="Schedule"
          >
            <Clock className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Main Bell Button - Always at bottom */}
      <button
        onClick={handleBellClick}
        className={`w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center ${
          isExpanded ? "rotate-12 scale-110" : ""
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
      </button>
    </div>
  );
};
