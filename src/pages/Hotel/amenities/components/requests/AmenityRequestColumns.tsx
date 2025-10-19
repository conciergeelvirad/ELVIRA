import { Package } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import {
  AmenityRequest,
  ExtendedAmenityRequest,
} from "../../../../../hooks/queries/hotel-management/amenity-requests";
import { ItemWithImage, StatusBadge } from "../../../../../components/common";

type EnhancedAmenityRequest = AmenityRequest & Record<string, unknown>;

// Helper function to convert AmenityRequest to EnhancedAmenityRequest
export const enhanceAmenityRequest = (
  request: AmenityRequest
): EnhancedAmenityRequest => {
  return request as unknown as EnhancedAmenityRequest;
};

// Helper to map request status to StatusBadge status type
const mapRequestStatus = (
  status: string
): "completed" | "pending" | "cancelled" | "default" => {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return "completed";
    case "pending":
      return "pending";
    case "rejected":
    case "cancelled":
      return "cancelled";
    default:
      return "default";
  }
};

export const getTableColumns = (
  onStatusClick?: (request: ExtendedAmenityRequest) => void
): Column<ExtendedAmenityRequest>[] => {
  return [
    {
      key: "id",
      header: "REQUEST ID",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">
            #{String(value).slice(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: "amenities",
      header: "AMENITY",
      sortable: true,
      render: (_value, request) => {
        const amenity = request.amenities as any;
        return (
          <ItemWithImage
            imageUrl={amenity?.image_url || ""}
            title={amenity?.name || "Unknown Amenity"}
            description=""
            fallbackIcon={<Package className="w-5 h-5" />}
          />
        );
      },
    },
    {
      key: "guests",
      header: "GUEST",
      sortable: true,
      render: (_value, request) => {
        const guest = request.guests as any;
        const personalData = guest?.guest_personal_data;
        const fullName = personalData
          ? `${personalData.first_name} ${personalData.last_name}`
          : "Unknown Guest";
        return <span className="text-sm text-gray-900">{fullName}</span>;
      },
    },
    {
      key: "room_number",
      header: "ROOM",
      sortable: true,
      render: (_value, request) => {
        const guest = request.guests as any;
        return (
          <span className="text-sm text-gray-600">
            {guest?.room_number || "N/A"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      render: (value, request) => {
        const statusValue = String(value);
        const label =
          statusValue.charAt(0).toUpperCase() +
          statusValue.slice(1).toLowerCase();
        return (
          <StatusBadge
            status={mapRequestStatus(statusValue)}
            label={label}
            variant="soft"
            onClick={onStatusClick ? () => onStatusClick(request) : undefined}
            clickable={!!onStatusClick}
          />
        );
      },
    },
    {
      key: "created_at",
      header: "CREATED",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value
            ? new Date(value as string).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
  ];
};

export const getGridColumns = (): GridColumn[] => {
  return [
    {
      key: "id",
      label: "Request ID",
      accessor: "id",
      render: (value: string) => `#${value.slice(0, 8)}`,
    },
    {
      key: "amenities",
      label: "Amenity",
      accessor: "amenities",
      render: (value: any) => value?.name || "Unknown",
    },
    {
      key: "guests",
      label: "Guest",
      accessor: "guests",
      render: (value: any) => {
        const personalData = value?.guest_personal_data;
        return personalData
          ? `${personalData.first_name} ${personalData.last_name}`
          : "Unknown";
      },
    },
    {
      key: "status",
      label: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge
          status={mapRequestStatus(value)}
          label={value.toUpperCase()}
          variant="soft"
        />
      ),
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
