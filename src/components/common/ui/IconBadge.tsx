/**
 * Icon Badge Component
 *
 * A circular or square container for icons with colored backgrounds.
 * Perfect for feature icons, status indicators, and decorative elements.
 *
 * @example Simple icon badge
 * <IconBadge icon={<MapPin className="w-4 h-4" />} />
 *
 * @example Custom colors
 * <IconBadge
 *   icon={<Star className="w-5 h-5" />}
 *   bgColor="bg-yellow-100"
 *   iconColor="text-yellow-600"
 *   size="lg"
 * />
 *
 * @example Square badge
 * <IconBadge icon={<Settings />} rounded={false} />
 */

import React from "react";
import { cn } from "../../../utils";

interface IconBadgeProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Background color (Tailwind class) */
  bgColor?: string;
  /** Icon color (Tailwind class) */
  iconColor?: string;
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Whether to use rounded corners */
  rounded?: boolean;
  /** Additional className */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
}

const sizeClasses = {
  xs: "p-1",
  sm: "p-1.5",
  md: "p-2",
  lg: "p-3",
  xl: "p-4",
};

/**
 * IconBadge - Decorative icon container with background
 */
export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  bgColor = "bg-gray-100",
  iconColor = "text-gray-600",
  size = "md",
  rounded = true,
  className,
  onClick,
}) => {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0",
        bgColor,
        iconColor,
        sizeClasses[size],
        rounded && "rounded-full",
        !rounded && "rounded-md",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
    >
      {icon}
    </Component>
  );
};
