/**
 * Generic Card Footer Component
 *
 * Combines status badges and action buttons (works for any third-party type)
 */

import { StatusBadges } from "./StatusBadges";
import { CardActions } from "./CardActions";
import type { ApprovalStatus } from "../../../../types/approved-third-party-places";

interface CardFooterProps<T = unknown> {
  item: T;
  onView?: (item: T) => void;
  onApprove?: (item: T) => void;
  onReject?: (item: T) => void;
  onToggleRecommended?: (item: T) => void;
  currentStatus?: ApprovalStatus | null;
  isRecommended?: boolean;
  isLoading?: boolean;
}

export const CardFooter = <T,>({
  item,
  onView,
  onApprove,
  onReject,
  onToggleRecommended,
  currentStatus,
  isRecommended = false,
  isLoading = false,
}: CardFooterProps<T>) => {
  return (
    <div className="flex items-center justify-between gap-2 p-3 border-t border-gray-100">
      {/* Status Badges */}
      <StatusBadges
        currentStatus={currentStatus}
        isRecommended={isRecommended}
      />

      {/* Action Buttons */}
      <CardActions
        item={item}
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
