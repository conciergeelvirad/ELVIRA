/**
 * Card Header Component
 *
 * Renders the header section of a GenericCard with:
 * - Icon (for non-image cards)
 * - Title and subtitle
 * - Price (for image cards)
 * - Badge (for non-image cards)
 */

import React from "react";
import type { CardBadge } from "./types";

export interface CardHeaderProps {
  /** Card title */
  title: React.ReactNode;
  /** Optional subtitle */
  subtitle?: React.ReactNode;
  /** Optional icon (for non-image cards) */
  icon?: React.ReactNode;
  /** Background color for icon container */
  iconBgColor?: string;
  /** Optional badge (for non-image cards) */
  badge?: CardBadge;
  /** Optional price (for image cards) */
  price?: {
    value: number;
    currency?: string;
    className?: string;
  };
  /** Whether the card has an image (affects layout) */
  hasImage: boolean;
  /** Render function for badge */
  onRenderBadge: (badge: CardBadge) => React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor = "bg-gray-100",
  badge,
  price,
  hasImage,
  onRenderBadge,
}) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Icon for non-image cards */}
        {!hasImage && icon && (
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}
          >
            {icon}
          </div>
        )}

        {/* Title and subtitle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Price display (for image cards) */}
      {hasImage && price && (
        <div
          className={`flex-shrink-0 ml-2 ${
            price.className || "text-xl font-bold text-green-600"
          }`}
        >
          {price.currency || "$"}
          {price.value.toFixed(2)}
        </div>
      )}

      {/* Badge for non-image cards (positioned in header) */}
      {!hasImage && badge && (
        <div className="flex-shrink-0 ml-2">{onRenderBadge(badge)}</div>
      )}
    </div>
  );
};
