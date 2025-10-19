/**
 * Action Buttons for AmenityRequestsTable
 *
 * Renders action buttons based on request status:
 * - Pending: Approve & Reject buttons
 * - Approved: Mark Delivered button
 * - All statuses: Delete button
 */

import { Check, X, Trash2, Package } from "lucide-react";
import { Button } from "../../../../../../components/common/ui/Button";
import type { AmenityRequest } from "../../../../../../hooks/queries/hotel-management/amenity-requests/amenity-request.types";

interface ActionButtonsProps {
  request: AmenityRequest;
  onStatusUpdate: (
    request: AmenityRequest,
    newStatus: AmenityRequest["status"]
  ) => void;
  onDelete: (request: AmenityRequest) => void;
}

/**
 * Renders contextual action buttons based on request status
 *
 * @param request - The amenity request
 * @param onStatusUpdate - Callback for status change actions
 * @param onDelete - Callback for delete action
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  request,
  onStatusUpdate,
  onDelete,
}) => {
  return (
    <div className="flex gap-2">
      {request.status === "pending" && (
        <>
          <Button
            size="sm"
            variant="primary"
            leftIcon={Check}
            onClick={() => onStatusUpdate(request, "approved")}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={X}
            onClick={() => onStatusUpdate(request, "rejected")}
          >
            Reject
          </Button>
        </>
      )}
      {request.status === "approved" && (
        <Button
          size="sm"
          variant="primary"
          leftIcon={Package}
          onClick={() => onStatusUpdate(request, "delivered")}
        >
          Mark Delivered
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        leftIcon={Trash2}
        onClick={() => onDelete(request)}
      >
        Delete
      </Button>
    </div>
  );
};
