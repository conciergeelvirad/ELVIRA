/**
 * StatusFilter Component
 *
 * A button group for filtering amenity requests by status.
 * Displays all available statuses (all, pending, approved, rejected, delivered)
 * with visual indication of the currently selected filter.
 */

import { Button } from "../../../../../../components/common/ui/Button";
import { STATUS_OPTIONS, type StatusFilter } from "./types";

interface StatusFilterProps {
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

/**
 * Renders a horizontal button group for status filtering
 *
 * @param selectedStatus - The currently selected status filter
 * @param onStatusChange - Callback when a status button is clicked
 */
export const StatusFilterButtons: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex gap-2">
      {STATUS_OPTIONS.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={selectedStatus === status ? "dark" : "ghost"}
          onClick={() => onStatusChange(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Button>
      ))}
    </div>
  );
};
