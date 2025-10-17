/**
 * Card Badges Component
 *
 * Renders multiple badges for additional status indicators.
 */

import React from "react";
import type { CardBadge } from "./types";

export interface CardBadgesProps {
  /** Array of badges to display */
  badges: CardBadge[];
  /** Render function for individual badge */
  onRenderBadge: (badge: CardBadge) => React.ReactNode;
}

/**
 * Component to render multiple additional badges
 */
export const CardBadges: React.FC<CardBadgesProps> = ({
  badges,
  onRenderBadge,
}) => {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map((badge, index) => (
        <div key={index}>{onRenderBadge(badge)}</div>
      ))}
    </div>
  );
};
