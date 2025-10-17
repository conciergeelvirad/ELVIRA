import { User, Settings as SettingsIcon } from "lucide-react";
import { TabPage, type TabConfig } from "../../components/common";
import { ControlPanel, HotelProfileTab } from "../../components/settings";
import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";
import { useMemo } from "react";

export const SettingsPage = () => {
  const { hotelStaff } = useHotelStaff();

  const isAdminOrManager = useMemo(() => {
    return (
      hotelStaff?.position === "Hotel Admin" ||
      (hotelStaff?.position === "Hotel Staff" &&
        hotelStaff?.department === "Manager")
    );
  }, [hotelStaff]);

  // Create and filter tabs based on user role
  const tabs = useMemo(() => {
    const allTabs: TabConfig[] = [
      {
        id: "profile",
        label: "Profile",
        icon: User,
        content: <HotelProfileTab />,
      },
      // Control Panel tab only for admin/manager
      {
        id: "control-panel",
        label: "Control Panel",
        icon: SettingsIcon,
        content: <ControlPanel />,
      },
    ];

    return allTabs.filter((tab) => {
      if (tab.id === "control-panel") {
        // Only show control panel for admin/manager
        return isAdminOrManager;
      }
      // Show other tabs for everyone
      return true;
    });
  }, [isAdminOrManager]);

  return <TabPage title="Settings" tabs={tabs} defaultTab="control-panel" />;
};
