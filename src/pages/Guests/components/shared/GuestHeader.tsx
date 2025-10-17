/**
 * Guest Header Component
 *
 * Displays guest welcome message, hotel info, room number, and DND toggle
 * Mobile-optimized header for guest dashboard
 */

import { Bell, BellOff } from "lucide-react";

interface GuestHeaderProps {
  guestName: string;
  hotelName: string;
  roomNumber: string;
  isDndActive: boolean;
  isDndUpdating?: boolean;
  onDndToggle: (isActive: boolean) => void;
}

export const GuestHeader = ({
  guestName,
  hotelName,
  roomNumber,
  isDndActive,
  isDndUpdating = false,
  onDndToggle,
}: GuestHeaderProps) => {
  const handleDndToggle = async () => {
    try {
      await onDndToggle(!isDndActive);
    } catch (error) {
      console.error("❌ [Guest Header] Error toggling DND:", error);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between">
          {/* Guest Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Welcome, {guestName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {hotelName} • Room {roomNumber}
            </p>
          </div>

          {/* DND Toggle Button */}
          <button
            onClick={handleDndToggle}
            disabled={isDndUpdating}
            className={`
              ml-3 flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 
              rounded-md text-sm font-medium transition-all duration-200
              touch-manipulation min-h-[44px]
              ${
                isDndActive
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }
              ${isDndUpdating ? "opacity-50 cursor-not-allowed" : ""}
              active:scale-95
            `}
            aria-label={
              isDndActive ? "Turn off Do Not Disturb" : "Turn on Do Not Disturb"
            }
          >
            {isDndActive ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
            <span className="text-xs font-medium">
              DND {isDndActive ? "On" : "Off"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
