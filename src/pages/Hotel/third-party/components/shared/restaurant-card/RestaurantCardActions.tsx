/**
 * Restaurant Card Actions Component
 *
 * Action buttons for view, approve, reject, and recommend
 */

import React from "react";
import { Star, Check, X, Eye } from "lucide-react";
import type { ApprovalStatus } from "../../../../../../types/approved-third-party-places";
import type { Restaurant } from "../../../../../../services/googlePlaces.service";

interface RestaurantCardActionsProps {
  restaurant: Restaurant;
  onView?: (restaurant: Restaurant) => void;
  onApprove?: (restaurant: Restaurant) => void;
  onReject?: (restaurant: Restaurant) => void;
  onToggleRecommended?: (restaurant: Restaurant) => void;
  currentStatus?: ApprovalStatus | null;
  isRecommended?: boolean;
  isLoading?: boolean;
}

export const RestaurantCardActions: React.FC<RestaurantCardActionsProps> = ({
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
    <div className="flex items-center gap-1 ml-auto">
      {/* View Button */}
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(restaurant);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* Toggle Recommended Button */}
      {onToggleRecommended && currentStatus === "approved" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleRecommended(restaurant);
          }}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
            isRecommended
              ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
              : "text-gray-600 hover:bg-amber-50"
          }`}
          title={
            isRecommended ? "Remove Recommendation" : "Mark as Recommended"
          }
          disabled={isLoading}
        >
          <Star
            className={`w-4 h-4 ${isRecommended ? "fill-amber-500" : ""}`}
          />
        </button>
      )}

      {/* Approve Button */}
      {onApprove && currentStatus !== "approved" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApprove(restaurant);
          }}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
          title="Approve"
          disabled={isLoading}
        >
          <Check className="w-4 h-4" />
        </button>
      )}

      {/* Reject Button */}
      {onReject && currentStatus !== "rejected" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReject(restaurant);
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Reject"
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
