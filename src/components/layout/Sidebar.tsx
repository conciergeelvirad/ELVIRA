import { X, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { Avatar, SidebarButton } from "../common";
import { HOTEL_NAVIGATION } from "../../constants/navigation";
import { useSettings } from "../../contexts";

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (itemId: string) => void;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({
  activeItem = "overview",
  onNavigate,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { hotelName, hotelInitials } = useSettings();

  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
  };

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-[220px]"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <Avatar initials={hotelInitials || "HT"} size="md" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {hotelName || "Hotel Dashboard"}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Hotel Admin
                </span>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Avatar initials={hotelInitials || "HT"} size="md" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {!isCollapsed && (
          <span className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide block whitespace-nowrap">
            Elvira Management System
          </span>
        )}

        <nav className="mt-2">
          {HOTEL_NAVIGATION.map((item) => {
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <SidebarButton
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                isHovered={isHovered}
                isCollapsed={isCollapsed}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                title={isCollapsed ? item.label : undefined}
              />
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4 space-y-2">
        {onToggleCollapse && (
          <SidebarButton
            icon={isCollapsed ? ChevronRight : ChevronLeft}
            label="Collapse"
            isCollapsed={isCollapsed}
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hover:bg-gray-50 rounded-lg"
          />
        )}
        <SidebarButton
          icon={LogOut}
          label="Log Out"
          isCollapsed={isCollapsed}
          onClick={() => {}}
          title={isCollapsed ? "Log Out" : undefined}
          className="hover:bg-gray-50 rounded-lg"
        />
      </div>
    </aside>
  );
};
