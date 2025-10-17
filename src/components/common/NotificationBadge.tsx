/**
 * NotificationBadge Component
 *
 * Displays a notification badge with a count number.
 * Used for showing pending items, unread messages, etc.
 */

import { cn } from "../../utils";

interface NotificationBadgeProps {
  count: number;
  variant?: "primary" | "danger" | "success";
  size?: "sm" | "md";
  className?: string;
}

export const NotificationBadge = ({
  count,
  variant = "primary",
  size = "md",
  className,
}: NotificationBadgeProps) => {
  // Don't render if count is 0
  if (count <= 0) return null;

  const displayCount = count > 99 ? "99+" : count.toString();

  const variantStyles = {
    primary: "bg-blue-500 text-white",
    danger: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
  };

  const sizeStyles = {
    sm: "min-w-[18px] h-[18px] text-[10px] px-1",
    md: "min-w-[20px] h-[20px] text-[11px] px-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        "animate-in fade-in duration-200",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {displayCount}
    </span>
  );
};
