import { LucideIcon } from "lucide-react";
import { cn } from "../../../utils";
import { NotificationBadge } from "../NotificationBadge";

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  isHovered?: boolean;
  isCollapsed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  title?: string;
  className?: string;
  badgeCount?: number; // Notification badge count
}

export const SidebarButton = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  isHovered = false,
  isCollapsed = false,
  onMouseEnter,
  onMouseLeave,
  title,
  className,
  badgeCount,
}: SidebarButtonProps) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "w-full flex items-center gap-3 py-2.5 text-left text-sm transition-colors relative",
        isCollapsed ? "px-0 justify-center" : "px-4",
        isActive ? "text-gray-900 font-medium" : "text-gray-600",
        isHovered && !isActive ? "bg-gray-50" : "",
        className
      )}
      title={title}
    >
      <Icon size={18} className="flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="text-xs uppercase tracking-wide whitespace-nowrap flex-1">
            {label}
          </span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <NotificationBadge count={badgeCount} variant="danger" size="sm" />
          )}
        </>
      )}
      {isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
        <div className="absolute -top-1 -right-1">
          <NotificationBadge count={badgeCount} variant="danger" size="sm" />
        </div>
      )}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-900" />
      )}
    </button>
  );
};
