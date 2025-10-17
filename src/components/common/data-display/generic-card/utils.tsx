/**
 * Card Badge Utilities
 *
 * Utility functions for rendering badges in GenericCard components.
 */

import React from "react";
import { StatusBadge, StatusType } from "../StatusBadge";
import type { CardBadge } from "./types";

/**
 * Utility function to render a single badge
 */
export const renderBadge = (badgeConfig: CardBadge): React.ReactNode => {
  return (
    <StatusBadge
      status={
        badgeConfig.status || (badgeConfig.label.toLowerCase() as StatusType)
      }
      variant={badgeConfig.variant}
      label={badgeConfig.label}
      className={badgeConfig.className}
    />
  );
};
