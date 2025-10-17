import { Calendar, Clock } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import { ActionButtonGroup } from "../../../../../components/common";
import { AmenityRequest } from "../../../../../hooks/queries/hotel-management/amenity-requests";
import { CRUDModalActions, CRUDFormActions } from "../../../../../hooks";

type EnhancedAmenityRequest = AmenityRequest & Record<string, unknown>;

// Helper function to convert AmenityRequest to EnhancedAmenityRequest
export const enhanceAmenityRequest = (
  request: AmenityRequest
): EnhancedAmenityRequest => {
  return request as unknown as EnhancedAmenityRequest;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  modalActions: CRUDModalActions<EnhancedAmenityRequest>;
  formActions: CRUDFormActions;
}

// Helper to get status badge color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "approved":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getTableColumns = ({
  modalActions,
  formActions,
}: GetColumnsOptions): Column<AmenityRequest>[] => {
  return [
    {
      key: "request_date",
      header: "DATE",
      sortable: true,
      render: (value) => {
        const date = value ? new Date(value as string) : null;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900">
              {date
                ? date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      key: "request_time",
      header: "TIME",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-gray-600">{value || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      render: (value) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(
            value as string
          )}`}
        >
          {(value as string).toUpperCase()}
        </span>
      ),
    },
    {
      key: "special_instructions",
      header: "INSTRUCTIONS",
      sortable: false,
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (_, request) => (
        <ActionButtonGroup
          actions={[
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                formActions.setFormData({
                  amenity_id: request.amenity_id,
                  guest_id: request.guest_id,
                  request_date: request.request_date,
                  request_time: request.request_time,
                  status: request.status,
                  special_instructions: request.special_instructions,
                });
                modalActions.openEditModal(enhanceAmenityRequest(request));
              },
            },
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                modalActions.openDeleteModal(enhanceAmenityRequest(request));
              },
              variant: "danger",
            },
          ]}
          size="sm"
          compact
        />
      ),
    },
  ];
};

export const getGridColumns = (): GridColumn[] => {
  return [
    {
      key: "request_date",
      label: "Date",
      accessor: "request_date",
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      key: "request_time",
      label: "Time",
      accessor: "request_time",
    },
    {
      key: "status",
      label: "Status",
      accessor: "status",
      render: (value: string) => value.toUpperCase(),
    },
  ];
};

// Detail fields for the modal
export const getDetailFields = (request: AmenityRequest) => [
  {
    label: "Request Date",
    value: request.request_date
      ? new Date(request.request_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  },
  { label: "Request Time", value: request.request_time || "N/A" },
  { label: "Status", value: request.status.toUpperCase() },
  {
    label: "Special Instructions",
    value: request.special_instructions || "None",
  },
  { label: "Amenity ID", value: request.amenity_id },
  { label: "Guest ID", value: request.guest_id },
  {
    label: "Created",
    value: request.created_at
      ? new Date(request.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  },
];

// Export functions with common naming pattern
export const getAmenityRequestTableColumns = getTableColumns;
export const getAmenityRequestGridColumns = getGridColumns;
export const getAmenityRequestDetailFields = getDetailFields;
