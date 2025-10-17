/**
 * DetailBadge Component
 *
 * Reusable component for displaying badge-style fields in detail modals (status, priority, etc.)
 */

import React from "react";

export type BadgeColor =
  | "gray"
  | "green"
  | "blue"
  | "yellow"
  | "red"
  | "purple";

interface DetailBadgeProps {
  label: string;
  value: string;
  color?: BadgeColor;
  className?: string;
}

const badgeColors: Record<BadgeColor, string> = {
  gray: "bg-gray-100 text-gray-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  purple: "bg-purple-100 text-purple-800",
};

export const DetailBadge: React.FC<DetailBadgeProps> = ({
  label,
  value,
  color = "gray",
  className = "",
}) => {
  return (
    <div className={className}>
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </h3>
      <p className="text-sm">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeColors[color]}`}
        >
          {value}
        </span>
      </p>
    </div>
  );
};
