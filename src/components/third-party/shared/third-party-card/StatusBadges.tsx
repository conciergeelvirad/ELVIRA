/**
 * Generic Status Badges Component
 *
 * Displays approval status and recommended badges for any third-party type
 */

import React from "react";
import { StatusBadge, Badge } from "../../../common";
import { Star } from "lucide-react";
import type { ApprovalStatus } from "../../../../types/approved-third-party-places";
import { getBadgeStatusType, formatStatusText } from "../../../../utils";

interface StatusBadgesProps {
  currentStatus?: ApprovalStatus | null;
  isRecommended?: boolean;
}

export const StatusBadges: React.FC<StatusBadgesProps> = ({
  currentStatus,
  isRecommended = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {currentStatus && (
        <StatusBadge
          status={getBadgeStatusType(currentStatus)}
          label={formatStatusText(currentStatus)}
          variant="soft"
          size="sm"
        />
      )}
      {isRecommended && (
        <Badge
          variant="primary"
          size="xs"
          rounded="full"
          icon={<Star className="w-3 h-3 fill-current" />}
          className="bg-amber-100 text-amber-700 border-amber-300"
        >
          Recommended
        </Badge>
      )}
    </div>
  );
};
