/**
 * useTabNavigation Hook
 *
 * Manages tab navigation state and changes
 */

import { useState } from "react";
import type { NavigationTab } from "../components/shared";

interface UseTabNavigationProps {
  onLogout: () => void;
}

interface UseTabNavigationReturn {
  activeTab: NavigationTab;
  handleTabChange: (tab: NavigationTab) => void;
}

export const useTabNavigation = ({
  onLogout,
}: UseTabNavigationProps): UseTabNavigationReturn => {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");

  const handleTabChange = (tab: NavigationTab) => {
    if (tab === "logout") {
      onLogout();
      return;
    }

    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabChange,
  };
};
