/**
 * Guest Layout Component
 *
 * Main layout wrapper for all guest pages
 * Includes: Header, Announcement Banner, Content Area, Bottom Navigation, Floating Widget
 * Manages shared state and navigation logic
 */

import { ReactNode, useState } from "react";
import { GuestHeader } from "./GuestHeader";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { BottomNavigation, NavigationTab } from "./BottomNavigation";
import { FloatingWidget } from "./FloatingWidget/FloatingWidget";
import { RequestHistoryModal } from "./RequestHistoryModal";
import { GuestChatModal } from "../Chat";
import { useConversationByGuest } from "../../../../hooks/queries/hotel-management/guest-conversations";

interface GuestLayoutProps {
  guestId: string;
  guestName: string;
  hotelName: string;
  roomNumber: string;
  hotelId: string;
  receptionPhone?: string | null;
  isDndActive?: boolean;
  isDndUpdating?: boolean;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onDndToggle: (isActive: boolean) => void;
  hideNavigation?: boolean;
  children: ReactNode;
}

export const GuestLayout = ({
  guestId,
  guestName,
  hotelName,
  roomNumber,
  hotelId,
  receptionPhone,
  isDndActive = false,
  isDndUpdating = false,
  activeTab,
  onTabChange,
  onDndToggle,
  hideNavigation = false,
  children,
}: GuestLayoutProps) => {
  // Modal state
  const [isRequestHistoryOpen, setIsRequestHistoryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch conversation to get unread message count
  const { data: conversation } = useConversationByGuest(guestId, hotelId);
  const unreadMessageCount = conversation?.unread_count || 0;

  const handleClockClick = () => {
    setIsRequestHistoryOpen(true);
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseRequestHistory = () => {
    setIsRequestHistoryOpen(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <GuestHeader
        guestName={guestName}
        hotelName={hotelName}
        roomNumber={roomNumber}
        isDndActive={isDndActive}
        isDndUpdating={isDndUpdating}
        onDndToggle={onDndToggle}
      />

      {/* Announcement Banner - fetches from database */}
      <AnnouncementBanner hotelId={hotelId} />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>

      {/* Floating Widget - Available on all pages */}
      <FloatingWidget
        onClockClick={handleClockClick}
        onChatClick={handleChatClick}
        unreadMessageCount={unreadMessageCount}
      />

      {/* Request History Modal */}
      <RequestHistoryModal
        isOpen={isRequestHistoryOpen}
        onClose={handleCloseRequestHistory}
        guestId={guestId}
      />

      {/* Guest Chat Modal */}
      <GuestChatModal
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        guestId={guestId}
        guestName={guestName}
        roomNumber={roomNumber}
        hotelId={hotelId}
        hotelName={hotelName}
        receptionPhone={receptionPhone}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        isVisible={!hideNavigation}
      />
    </div>
  );
};
