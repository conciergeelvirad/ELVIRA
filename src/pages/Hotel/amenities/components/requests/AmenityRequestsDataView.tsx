import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import { AmenityRequest } from "../../../../../hooks/queries/hotel-management/amenity-requests";
import { Calendar, User, FileText, Clock } from "lucide-react";

interface AmenityRequestsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (request: AmenityRequest) => void;
  tableColumns: Column<AmenityRequest>[];
  onEdit?: (request: AmenityRequest) => void;
  onDelete?: (request: AmenityRequest) => void;
}

/**
 * Grid columns for amenity requests
 */
const requestGridColumns: GridColumn[] = [
  { key: "id", label: "Request ID" },
  { key: "amenity", label: "Amenity" },
  { key: "guest", label: "Guest" },
  { key: "room_number", label: "Room" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created" },
];

/**
 * Amenity Request Card Component for Grid View
 */
const AmenityRequestCard: React.FC<{
  request: AmenityRequest & {
    amenities?: { name: string; image_url?: string };
    guests?: {
      room_number?: string;
      guest_personal_data?: { first_name: string; last_name: string };
    };
  };
  onClick: () => void;
  onEdit?: (request: AmenityRequest) => void;
  onDelete?: (request: AmenityRequest) => void;
}> = ({ request, onClick, onEdit, onDelete }) => {
  const statusLabels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  const status = statusLabels[request.status] || request.status;

  // Extract amenity name
  const amenityName = (request.amenities as any)?.name || "Unknown Amenity";

  // Extract guest data
  const guest = request.guests as any;
  const personalData = guest?.guest_personal_data;
  const guestName = personalData
    ? `${personalData.first_name} ${personalData.last_name}`
    : "Unknown Guest";
  const roomNumber = guest?.room_number || "N/A";

  // Format created date
  const createdDate = request.created_at
    ? new Date(request.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <FileText className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Amenity:</span> {amenityName}
        </>
      ),
    },
    {
      icon: <User className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Guest:</span> {guestName}
        </>
      ),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Created:</span> {createdDate}
        </>
      ),
    },
  ];

  if (request.request_date) {
    const requestDate = new Date(request.request_date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
    sections.push({
      icon: <Calendar className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Request Date:</span> {requestDate}
        </>
      ),
    });
  }

  if (request.request_time) {
    sections.push({
      icon: <Clock className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Time:</span> {request.request_time}
        </>
      ),
    });
  }

  return (
    <GenericCard
      icon={
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-lg font-bold text-blue-600">{roomNumber}</span>
        </div>
      }
      iconBgColor="bg-blue-100"
      title={`Amenity Request`}
      subtitle={`ID: ${request.id.slice(0, 8)}`}
      badge={{
        label: status,
        variant: "soft",
      }}
      sections={sections}
      onClick={onClick}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(request) : undefined}
          onDelete={onDelete ? () => onDelete(request) : undefined}
        />
      }
    />
  );
};

export const AmenityRequestsDataView: React.FC<
  AmenityRequestsDataViewProps
> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  onEdit,
  onDelete,
}) => {
  return (
    <GenericDataView<AmenityRequest>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={requestGridColumns}
      getItemId={(request) => request.id}
      renderCard={(request, onClick) => (
        <AmenityRequestCard
          request={request}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No amenity requests found"
    />
  );
};
