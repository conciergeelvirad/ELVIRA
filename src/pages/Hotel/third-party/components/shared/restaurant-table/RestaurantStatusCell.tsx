/**
 * Restaurant Status Cell Component
 *
 * Displays business status and open/closed badges
 */

import React from "react";
import { StatusBadge, Badge } from "../../../../../../components/common";
import { Clock } from "lucide-react";

interface RestaurantStatusCellProps {
  businessStatus?: string;
  isOpen?: boolean;
}

export const RestaurantStatusCell: React.FC<RestaurantStatusCellProps> = ({
  businessStatus,
  isOpen,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {businessStatus && (
        <StatusBadge
          status={businessStatus === "OPERATIONAL" ? "active" : "inactive"}
          label={businessStatus}
          variant="soft"
          size="sm"
        />
      )}
      {isOpen !== undefined && (
        <Badge
          variant={isOpen ? "success" : "error"}
          icon={<Clock className="w-3 h-3" />}
          size="xs"
        >
          {isOpen ? "Open" : "Closed"}
        </Badge>
      )}
    </div>
  );
};
