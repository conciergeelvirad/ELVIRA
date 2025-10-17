/**
 * Floating Widget Component (Refactored)
 *
 * A bell icon that floats in the bottom-right corner
 * Features:
 * - Bell rings when new messages arrive
 * - Shows unread message count badge on chat icon
 * - Expandable to show clock and chat buttons
 * - Stays behind modals (z-index controlled)
 */

import { useState, useEffect } from "react";
import { Bell, Clock, MessageCircle } from "lucide-react";
import { NotificationBadge } from "./NotificationBadge";

interface FloatingWidgetProps {
  onClockClick?: () => void;
  onChatClick?: () => void;
  unreadMessageCount?: number;
}

export const FloatingWidget = ({
  onClockClick,
  onChatClick,
  unreadMessageCount = 0,
}: FloatingWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [previousCount, setPreviousCount] = useState(unreadMessageCount);

  // Trigger bell ringing animation when new messages arrive
  useEffect(() => {
    if (unreadMessageCount > previousCount && unreadMessageCount > 0) {
      // New message received - ring the bell!
      setIsRinging(true);

      // Stop ringing after animation completes (600ms)
      const timer = setTimeout(() => {
        setIsRinging(false);
      }, 600);

      return () => clearTimeout(timer);
    }

    setPreviousCount(unreadMessageCount);
  }, [unreadMessageCount, previousCount]);

  const handleBellClick = () => {
    setIsExpanded(!isExpanded);
    // Stop ringing when user interacts with bell
    setIsRinging(false);
  };

  const handleClockClick = () => {
    onClockClick?.();
  };

  const handleChatClick = () => {
    onChatClick?.();
  };

  return (
    <>
      {/* Inject custom animations */}
      <style>{`
        @keyframes ring {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-12deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-12deg); }
          50% { transform: rotate(14deg); }
          60% { transform: rotate(-12deg); }
          70% { transform: rotate(8deg); }
          80% { transform: rotate(-8deg); }
          90% { transform: rotate(4deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes badge-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
        }

        .animate-ring {
          animation: ring 0.6s ease-in-out;
        }

        .animate-badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed bottom-20 right-4 z-30 flex flex-col items-end gap-3">
        {/* Secondary Buttons - Clock and Chat (appear above bell) */}
        {isExpanded && (
          <>
            {/* Chat Button with Badge */}
            <div className="relative">
              <button
                onClick={handleChatClick}
                className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center animate-fade-in"
                aria-label={`Chat${
                  unreadMessageCount > 0
                    ? ` - ${unreadMessageCount} unread messages`
                    : ""
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <NotificationBadge count={unreadMessageCount} />
            </div>

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
        <div className="relative">
          <button
            onClick={handleBellClick}
            className={`w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center ${
              isExpanded ? "rotate-12 scale-110" : ""
            } ${isRinging ? "animate-ring" : ""}`}
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
          </button>
          {/* Badge on bell when collapsed and there are unread messages */}
          {!isExpanded && unreadMessageCount > 0 && (
            <NotificationBadge count={unreadMessageCount} />
          )}
        </div>
      </div>
    </>
  );
};
