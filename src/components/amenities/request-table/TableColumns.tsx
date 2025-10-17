/**
 * Table Column Definitions for AmenityRequestsTable
 *
 * Defines all columns with their render functions for the amenity requests table.
 * Includes: Room, Guest, Amenity, Quantity, Notes, Status, Requested time, Actions
 */

import { formatDistanceToNow } from "date-fns";
import type { Column } from "../../../types/table";
import { StatusBadge } from "../../common/data-display/StatusBadge";
import type { AmenityRequest, ExtendedAmenityRequest } from "./types";
import { getStatusBadgeType } from "./utils";
import { ActionButtons } from "./ActionButtons";

interface CreateColumnsParams {
  onStatusUpdate: (
    request: AmenityRequest,
    newStatus: AmenityRequest["status"]
  ) => void;
  onDelete: (request: AmenityRequest) => void;
}

/**
 * Creates column definitions for the amenity requests table
 *
 * @param onStatusUpdate - Callback for status change actions
 * @param onDelete - Callback for delete action
 * @returns Array of column definitions for TableView component
 */
export const createTableColumns = ({
  onStatusUpdate,
  onDelete,
}: CreateColumnsParams): Column<ExtendedAmenityRequest>[] => [
  {
    key: "room",
    header: "Room",
    render: (_, row) => row.guests?.room_number || "-",
  },
  {
    key: "guest",
    header: "Guest",
    render: (_, row) => {
      const guest = row.guests;
      if (!guest) return "Unknown";

      // Get name from guest_personal_data
      if (guest.guest_personal_data) {
        const { first_name, last_name } = guest.guest_personal_data;
        return `${first_name} ${last_name}`;
      }

      return "Unknown";
    },
  },
  {
    key: "amenity",
    header: "Amenity",
    render: (_, row) => row.amenities?.name || "Unknown",
  },
  {
    key: "special_instructions",
    header: "Special Instructions",
    render: (_, row) => row.special_instructions || "-",
  },
  {
    key: "status",
    header: "Status",
    render: (_, row) => (
      <StatusBadge
        status={getStatusBadgeType(row.status)}
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      />
    ),
  },
  {
    key: "requested",
    header: "Requested",
    render: (_, row) =>
      row.created_at
        ? formatDistanceToNow(new Date(row.created_at), {
            addSuffix: true,
          })
        : "-",
  },
  {
    key: "actions",
    header: "Actions",
    render: (_, row) => (
      <ActionButtons
        request={row}
        onStatusUpdate={onStatusUpdate}
        onDelete={onDelete}
      />
    ),
  },
];
