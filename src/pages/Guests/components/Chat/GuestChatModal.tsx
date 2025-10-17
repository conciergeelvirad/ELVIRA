/**
 * Guest Chat Modal Component
 *
 * Full-screen chat interface for guests to communicate with hotel staff
 *
 * Features:
 * - Uses existing common chat components (ChatMessage, ChatInput, etc.)
 * - Full-screen modal with createPortal
 * - Body scroll lock when open
 * - Auto-scroll to bottom on new messages
 * - Loading and error states
 * - Clean, mobile-friendly design
 */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, AlertCircle, Phone } from "lucide-react";
import { ChatMessage } from "../../../../components/chat/ChatMessage";
import { ChatInput } from "../../../../components/chat/ChatInput";
import { useGuestChat } from "./useGuestChat";

interface GuestChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
  guestName: string;
  roomNumber: string;
  hotelId: string;
  hotelName: string;
  receptionPhone?: string | null;
}

export const GuestChatModal = ({
  isOpen,
  onClose,
  guestId,
  guestName,
  roomNumber,
  hotelId,
  hotelName,
  receptionPhone,
}: GuestChatModalProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use guest chat hook
  const { messages, isLoading, error, sendMessage } = useGuestChat({
    guestId,
    hotelId,
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Full Screen Chat Container */}
      <div className="absolute inset-0 bg-white flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{hotelName}</h2>
            <p className="text-xs text-green-100">Chat with Hotel Staff</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Phone Icon */}
            {receptionPhone && (
              <a
                href={`tel:${receptionPhone}`}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                aria-label="Call reception"
                title={`Call: ${receptionPhone}`}
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading messages...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-medium mb-1">
                  Failed to load chat
                </p>
                <p className="text-xs text-gray-500">{error.message}</p>
              </div>
            </div>
          )}

          {/* Messages List */}
          {!isLoading && !error && (
            <>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-sm">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-sm text-gray-700 font-medium mb-1">
                      Start a conversation
                    </p>
                    <p className="text-xs text-gray-500">
                      Send a message to connect with our hotel staff. We're here
                      to help!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area - using common ChatInput component */}
        <div className="flex-shrink-0 border-t border-gray-200">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || !!error}
            placeholder="Type your message to hotel staff..."
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
