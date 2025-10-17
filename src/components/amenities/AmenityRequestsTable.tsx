/**
 * AmenityRequestsTable Component
 *
 * Main table component for managing amenity requests.
 * Now uses focused sub-components from the request-table folder.
 */

import { useState } from "react";
import {
  useAmenityRequests,
  useUpdateAmenityRequestStatus,
  useDeleteAmenityRequest,
} from "../../hooks/queries/hotel-management/amenity-requests";
import { useToast } from "../../hooks/ui/useToast";
import { useConfirmDialog } from "../../hooks/ui/useConfirmDialog";
import { TableView } from "../../components/common/data-display/TableView";
import {
  StatusFilterButtons,
  createTableColumns,
  type AmenityRequest,
  type ExtendedAmenityRequest,
  type StatusFilter,
} from "./request-table";

const HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

export const AmenityRequestsTable = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const { data: amenityRequests = [], isLoading } =
    useAmenityRequests(HOTEL_ID);
  const { mutate: updateStatus } = useUpdateAmenityRequestStatus();
  const { mutate: deleteRequest } = useDeleteAmenityRequest();
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();

  const handleStatusUpdate = async (
    request: AmenityRequest,
    newStatus: AmenityRequest["status"]
  ) => {
    const actionMap = {
      approved: "approve",
      rejected: "reject",
      delivered: "mark as delivered",
    } as const;

    const confirmed = await confirm({
      title: `Confirm Status Update`,
      message:
        newStatus === "pending"
          ? "Are you sure you want to reset this request to pending?"
          : `Are you sure you want to ${
              actionMap[newStatus as keyof typeof actionMap]
            } this request?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      updateStatus(
        { id: request.id, status: newStatus, hotelId: HOTEL_ID },
        {
          onSuccess: () => {
            toast({
              message: "Request status updated successfully",
              type: "success",
            });
          },
        }
      );
    }
  };

  const handleDelete = async (request: AmenityRequest) => {
    const confirmed = await confirm({
      title: "Delete Request",
      message: "Are you sure you want to delete this request?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      deleteRequest(
        { id: request.id, hotelId: HOTEL_ID },
        {
          onSuccess: () => {
            toast({
              message: "Request deleted successfully",
              type: "success",
            });
          },
        }
      );
    }
  };

  // Filter requests based on selected status
  const filteredRequests =
    selectedStatus === "all"
      ? amenityRequests
      : amenityRequests.filter(
          (request: ExtendedAmenityRequest) => request.status === selectedStatus
        );

  // Create table columns with callbacks
  const columns = createTableColumns({
    onStatusUpdate: handleStatusUpdate,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-4">
      <StatusFilterButtons
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <TableView<ExtendedAmenityRequest>
        columns={columns}
        rows={filteredRequests.map((request) => ({
          id: request.id,
          data: request,
        }))}
        loading={isLoading}
        emptyMessage="No amenity requests found"
      />
    </div>
  );
};
