/**
 * Badge Helper Utilities
 *
 * Helper functions for working with badges and status indicators.
 * Provides consistent mapping from status/category strings to badge variants.
 */

import { StatusType } from "../../../components/common/data-display/StatusBadge";

/**
 * Badge variant types (for non-status badges)
 */
export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "primary";

/**
 * Map a status string to a StatusBadge type
 *
 * @example
 * getBadgeStatusType('approved') // returns 'success'
 * getBadgeStatusType('pending') // returns 'pending'
 * getBadgeStatusType('ACTIVE') // returns 'active'
 */
export const getBadgeStatusType = (status: string): StatusType => {
  const statusLower = status.toLowerCase().trim();

  // Map common status values to StatusType
  const statusMap: Record<string, StatusType> = {
    // Active/Inactive
    active: "active",
    inactive: "inactive",
    enabled: "active",
    disabled: "inactive",

    // Approval states
    approved: "success",
    rejected: "error",
    pending: "pending",
    review: "pending",
    in_review: "pending",

    // Completion states
    completed: "completed",
    done: "completed",
    finished: "completed",
    cancelled: "cancelled",
    canceled: "cancelled",
    failed: "error",

    // Priority levels
    high: "high",
    medium: "medium",
    low: "low",
    urgent: "high",
    critical: "high",

    // Generic states
    success: "success",
    warning: "warning",
    error: "error",
    info: "info",
  };

  return (statusMap[statusLower] as StatusType) || "default";
};

/**
 * Map a category or type string to a Badge variant
 *
 * @example
 * getBadgeVariant('success') // returns 'success'
 * getBadgeVariant('category') // returns 'neutral'
 */
export const getBadgeVariant = (value: string): BadgeVariant => {
  const valueLower = value.toLowerCase().trim();

  const variantMap: Record<string, BadgeVariant> = {
    // Success variants
    approved: "success",
    completed: "success",
    active: "success",
    success: "success",
    available: "success",

    // Warning variants
    pending: "warning",
    in_progress: "warning",
    warning: "warning",
    moderate: "warning",

    // Error variants
    rejected: "error",
    cancelled: "error",
    error: "error",
    failed: "error",
    unavailable: "error",

    // Info variants
    info: "info",
    draft: "info",
    new: "info",

    // Primary variants
    recommended: "primary",
    featured: "primary",
    priority: "primary",
  };

  return variantMap[valueLower] || "neutral";
};

/**
 * Get background and text color classes for a status
 * (for custom inline styling when StatusBadge can't be used)
 */
export const getStatusColorClasses = (
  status: string
): { bg: string; text: string } => {
  const statusType = getBadgeStatusType(status);

  const colorMap: Record<StatusType, { bg: string; text: string }> = {
    active: { bg: "bg-green-100", text: "text-green-800" },
    inactive: { bg: "bg-gray-100", text: "text-gray-800" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    completed: { bg: "bg-blue-100", text: "text-blue-800" },
    cancelled: { bg: "bg-red-100", text: "text-red-800" },
    high: { bg: "bg-red-100", text: "text-red-800" },
    medium: { bg: "bg-orange-100", text: "text-orange-800" },
    low: { bg: "bg-green-100", text: "text-green-800" },
    success: { bg: "bg-emerald-100", text: "text-emerald-800" },
    warning: { bg: "bg-amber-100", text: "text-amber-800" },
    error: { bg: "bg-red-100", text: "text-red-800" },
    info: { bg: "bg-blue-100", text: "text-blue-800" },
    default: { bg: "bg-gray-100", text: "text-gray-800" },
  };

  return colorMap[statusType] || colorMap.default;
};

/**
 * Format status text for display
 * Converts snake_case and UPPER_CASE to Title Case
 */
export const formatStatusText = (status: string): string => {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
