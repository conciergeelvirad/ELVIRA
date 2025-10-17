/**
 * Approval Status Filter Component
 *
 * Allows filtering by approval status (pending, approved, rejected)
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";
import { APPROVAL_STATUSES } from "./filterConstants";
import type { ApprovalStatus } from "../../../types/approved-third-party-places";

interface ApprovalStatusFilterProps {
  selectedStatuses: ApprovalStatus[];
  onStatusToggle: (status: ApprovalStatus, checked: boolean) => void;
}

export const ApprovalStatusFilter: React.FC<ApprovalStatusFilterProps> = ({
  selectedStatuses,
  onStatusToggle,
}) => {
  return (
    <FilterPanel.Section title="Status">
      {APPROVAL_STATUSES.map((status) => (
        <FilterPanel.Checkbox
          key={status.value}
          label={status.label}
          checked={selectedStatuses.includes(status.value)}
          onChange={(checked) => onStatusToggle(status.value, checked)}
        />
      ))}
    </FilterPanel.Section>
  );
};
