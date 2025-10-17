/**
 * Badge Component
 *
 * A versatile badge component for tags, labels, prices, and categories.
 * Use for non-status indicators (for status, use StatusBadge component).
 *
 * @example Simple badge
 * <Badge>New</Badge>
 *
 * @example Price badge
 * <Badge variant="success">€€€</Badge>
 *
 * @example Category tag
 * <Badge variant="info" rounded="full">Italian</Badge>
 */

import React from "react";
import { cn } from "../../../utils";

interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: "success" | "warning" | "error" | "info" | "neutral" | "primary";
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg";
  /** Border radius */
  rounded?: "sm" | "md" | "lg" | "full";
  /** Additional className */
  className?: string;
  /** Optional icon */
  icon?: React.ReactNode;
}

const variantClasses = {
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  error: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
  primary: "bg-blue-600 text-white border-blue-700",
};

const sizeClasses = {
  xs: "text-xs px-1.5 py-0.5",
  sm: "text-sm px-2 py-1",
  md: "text-base px-3 py-1.5",
  lg: "text-lg px-4 py-2",
};

const roundedClasses = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

/**
 * Badge - Versatile label and tag component
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "sm",
  rounded = "md",
  className,
  icon,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium border",
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
