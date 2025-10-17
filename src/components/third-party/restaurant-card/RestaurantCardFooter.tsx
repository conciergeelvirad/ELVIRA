/**
 * Restaurant Card Footer Component
 *
 * Combines status badges and action buttons
 */

import React from "react";
import { RestaurantStatusBadges } from "./RestaurantStatusBadges";
import { RestaurantCardActions } from "./RestaurantCardActions";
import type { ApprovalStatus } from "../../../types/approved-third-party-places";
import type { Restaurant } from "../../../services/googlePlaces.service";

interface RestaurantCardFooterProps {
  restaurant: Restaurant;
  onView?: (restaurant: Restaurant) => void;
  onApprove?: (restaurant: Restaurant) => void;
  onReject?: (restaurant: Restaurant) => void;
  onToggleRecommended?: (restaurant: Restaurant) => void;
  currentStatus?: ApprovalStatus | null;
  isRecommended?: boolean;
  isLoading?: boolean;
}

export const RestaurantCardFooter: React.FC<RestaurantCardFooterProps> = ({
  restaurant,
  onView,
  onApprove,
  onReject,
  onToggleRecommended,
  currentStatus,
  isRecommended = false,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 p-3 border-t border-gray-100">
      {/* Status Badges */}
      <RestaurantStatusBadges
        currentStatus={currentStatus}
        isRecommended={isRecommended}
      />

      {/* Action Buttons */}
      <RestaurantCardActions
        restaurant={restaurant}
        onView={onView}
        onApprove={onApprove}
        onReject={onReject}
        onToggleRecommended={onToggleRecommended}
        currentStatus={currentStatus}
        isRecommended={isRecommended}
        isLoading={isLoading}
      />
    </div>
  );
};
