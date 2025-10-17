/**
 * Bottom Navigation Component
 *
 * Mobile-first bottom navigation bar with 5 tabs
 * Tabs: Home, Services, Dine In, Shop, Logout
 * Can be hidden when modals or filters are open
 */

import {
  Home,
  Wrench,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useCart } from "../../../../contexts/CartContext";

export type NavigationTab =
  | "home"
  | "services"
  | "dine-in"
  | "shop"
  | "qa"
  | "tours"
  | "gastronomy"
  | "logout";

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isVisible?: boolean;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "services",
    label: "Services",
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    id: "dine-in",
    label: "Dine In",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    id: "shop",
    label: "Shop",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    id: "logout",
    label: "Logout",
    icon: <LogOut className="w-5 h-5" />,
  },
];

export const BottomNavigation = ({
  activeTab,
  onTabChange,
  isVisible = true,
}: BottomNavigationProps) => {
  const { getTotalItemsByType } = useCart();
  const dineInCartCount = getTotalItemsByType("food");
  const shopCartCount = getTotalItemsByType("product");

  const handleTabClick = (tabId: NavigationTab) => {
    onTabChange(tabId);
  };

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white/80 backdrop-blur-lg border-t border-gray-200/50 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "translate-y-full"}
        safe-area-inset-bottom
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5 h-16 sm:h-18">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                relative flex flex-col items-center justify-center gap-1
                transition-all duration-200 touch-manipulation
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50/30"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/30"
                }
                active:scale-95
                ${item.id === "logout" ? "text-red-600" : ""}
              `}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon */}
              <div
                className={`
                  relative
                  transition-transform duration-200
                  ${isActive ? "scale-110" : "scale-100"}
                `}
              >
                {item.icon}

                {/* Cart Badge for Dine In tab */}
                {item.id === "dine-in" && dineInCartCount > 0 && (
                  <span
                    className="
                      absolute -top-1.5 -right-1.5
                      bg-red-500 text-white
                      text-[9px] font-bold
                      rounded-full
                      h-4 w-4
                      flex items-center justify-center
                      border border-white
                      shadow-sm
                    "
                  >
                    {dineInCartCount > 9 ? "9+" : dineInCartCount}
                  </span>
                )}

                {/* Cart Badge for Shop tab */}
                {item.id === "shop" && shopCartCount > 0 && (
                  <span
                    className="
                      absolute -top-1.5 -right-1.5
                      bg-red-500 text-white
                      text-[9px] font-bold
                      rounded-full
                      h-4 w-4
                      flex items-center justify-center
                      border border-white
                      shadow-sm
                    "
                  >
                    {shopCartCount > 9 ? "9+" : shopCartCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs font-medium transition-all duration-200
                  ${isActive ? "font-semibold" : ""}
                `}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
