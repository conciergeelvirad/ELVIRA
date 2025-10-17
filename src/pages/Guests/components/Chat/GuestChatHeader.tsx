/**
 * Guest Chat Header Component
 *
 * Chat header with:
 * - Hotel name
 * - "Chat with Hotel Staff" subtitle
 * - Close button
 * - Clean, compact design for mobile
 */

import { X } from "lucide-react";

interface GuestChatHeaderProps {
  hotelName: string;
  onClose: () => void;
}

export const GuestChatHeader = ({
  hotelName,
  onClose,
}: GuestChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
      {/* Hotel Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold truncate">{hotelName}</h2>
        <p className="text-xs text-blue-100">Chat with Hotel Staff</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors ml-3"
        aria-label="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
