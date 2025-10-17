import { useState, useMemo } from "react";
import { GenericDashboardLayout } from "../../components/layout";
import { PageContainer, PageHeader } from "../../components/common";
import { HOTEL_NAVIGATION } from "../../constants";
import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";
import { useHotelNotifications } from "../../hooks/queries/hotel-management/notifications";
import { canAccessRoute } from "../../utils/ui/permission";
import { ChatManagementPage } from "./ChatManagementPage";
import { GuestManagementPage } from "./GuestManagementPage";
import { EmergencyContactsPage } from "./EmergencyContactsPage";
import { QARecommendationsPage } from "./QARecommendationsPage";
import { AnnouncementsPage } from "./AnnouncementsPage";
import { ThirdPartyManagementPage } from "./ThirdPartyManagementPage";
import { HotelStaffPage } from "./HotelStaffPage";
import { AmenitiesPage } from "./AmenitiesPage";
import { HotelRestaurantPage } from "./HotelRestaurantPage";
import { HotelShopPage } from "./HotelShopPage";
import { SettingsPage } from "./SettingsPage";
import { AISupportPage } from "./AISupportPage";

export const HotelDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const { hotelStaff } = useHotelStaff();

  // Fetch notification counts for pending orders
  const { data: notifications } = useHotelNotifications(hotelStaff?.hotel_id);

  // Filter navigation items based on user's role and add badge counts
  const filteredNavigationItems = useMemo(() => {
    return HOTEL_NAVIGATION.filter((item) =>
      canAccessRoute(hotelStaff, item.id)
    ).map((item) => {
      // Add badge counts for specific sections
      if (item.id === "hotel-shop") {
        return { ...item, badgeCount: notifications?.shopOrders || 0 };
      }
      if (item.id === "hotel-restaurant") {
        return { ...item, badgeCount: notifications?.dineInOrders || 0 };
      }
      if (item.id === "amenities") {
        return { ...item, badgeCount: notifications?.amenityRequests || 0 };
      }
      return item;
    });
  }, [hotelStaff, notifications]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <PageContainer>
            <PageHeader title="Hotel Overview" />
            <p className="text-gray-600 mt-4">
              Hotel operations dashboard overview
            </p>
          </PageContainer>
        );
      case "hotel-staff":
        return <HotelStaffPage />;
      case "chat-management":
        return <ChatManagementPage />;
      case "guest-management":
        return <GuestManagementPage />;
      case "amenities":
        return <AmenitiesPage />;
      case "hotel-restaurant":
        return <HotelRestaurantPage />;
      case "hotel-shop":
        return <HotelShopPage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "qa-recommendations":
        return <QARecommendationsPage />;
      case "emergency-contacts":
        return <EmergencyContactsPage />;
      case "third-party-management":
        return <ThirdPartyManagementPage />;
      case "ai-support":
        return <AISupportPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <PageContainer>
            <PageHeader title="Hotel Overview" />
          </PageContainer>
        );
    }
  };

  return (
    <GenericDashboardLayout
      title="Centro Hotel Mondial"
      subtitle={hotelStaff?.position || "Staff Member"}
      systemLabel=""
      navigationItems={filteredNavigationItems}
      activeItem={activeSection}
      onNavigate={setActiveSection}
    >
      {renderContent()}
    </GenericDashboardLayout>
  );
};
