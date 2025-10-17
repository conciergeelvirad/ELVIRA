/**
 * Guest Dashboard (Refactored)
 *
 * Main dashboard for authenticated guests.
 * Integrates all pages with shared layout (header, announcements, navigation)
 *
 * Refactored into:
 * - useGuestSession: Session loading, validation, and logout
 * - useTabNavigation: Tab state and navigation logic
 * - useDndManagement: Do Not Disturb status management
 */

import { useState } from "react";
import type { GuestData } from "../../services/guestAuth.service";
import { GuestLayout, NavigationTab } from "./components/shared";
import {
  HomePage,
  ServicesPage,
  DineInPage,
  ShopPage,
  QAPage,
  ToursPage,
  GastronomyPage,
} from "./pages";
import { useGuestSession, useTabNavigation, useDndManagement } from "./hooks";
import { CartProvider } from "../../contexts/CartContext";

export const GuestDashboard = () => {
  // Guest session management
  const { guestData, hotelData, isLoading, handleLogout } = useGuestSession();

  // Local state for guest data updates (for DND)
  const [localGuestData, setLocalGuestData] = useState<GuestData | null>(
    guestData
  );

  // Update local guest data when session loads
  if (guestData && !localGuestData) {
    setLocalGuestData(guestData);
  }

  // Tab navigation
  const { activeTab, handleTabChange } = useTabNavigation({
    onLogout: handleLogout,
  });

  // DND management
  const { isDndActive, isDndUpdating, handleDndToggle } = useDndManagement({
    guestData: localGuestData,
    onGuestDataUpdate: setLocalGuestData,
  });

  // Loading state
  if (isLoading || !localGuestData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the active page
  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomePage
            guestData={localGuestData}
            hotelId={localGuestData.hotel_id}
            onNavigate={(tab) => handleTabChange(tab as NavigationTab)}
          />
        );
      case "services":
        return <ServicesPage />;
      case "dine-in":
        return <DineInPage />;
      case "shop":
        return <ShopPage />;
      case "tours":
        return <ToursPage />;
      case "gastronomy":
        return <GastronomyPage />;
      case "qa":
        return <QAPage />;
      default:
        return (
          <HomePage
            guestData={localGuestData}
            hotelId={localGuestData.hotel_id}
            onNavigate={(tab) => handleTabChange(tab as NavigationTab)}
          />
        );
    }
  };

  return (
    <CartProvider>
      <GuestLayout
        guestId={localGuestData.id}
        guestName={localGuestData.guest_name}
        hotelName={hotelData?.name || "Hotel"}
        roomNumber={localGuestData.room_number}
        hotelId={localGuestData.hotel_id}
        receptionPhone={hotelData?.reception_phone}
        isDndActive={isDndActive}
        isDndUpdating={isDndUpdating}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onDndToggle={handleDndToggle}
      >
        {renderActivePage()}
      </GuestLayout>
    </CartProvider>
  );
};
