/**
 * Status Filter Component
 *
 * Filter for active/inactive status
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;
}

const statuses = ["active", "inactive"];

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatuses,
  onStatusToggle,
}) => {
  return (
    <FilterPanel.Section title="Status">
      {statuses.map((status) => (
        <FilterPanel.Checkbox
          key={status}
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          checked={selectedStatuses.includes(status)}
          onChange={() => onStatusToggle(status)}
        />
      ))}
    </FilterPanel.Section>
  );
};
