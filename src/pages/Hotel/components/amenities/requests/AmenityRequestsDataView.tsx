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
  { key: "guest_id", label: "Guest" },
  { key: "amenity_id", label: "Amenity" },
  { key: "request_date", label: "Date" },
  { key: "status", label: "Status" },
];

/**
 * Amenity Request Card Component for Grid View
 */
const AmenityRequestCard: React.FC<{
  request: AmenityRequest;
  onClick: () => void;
  onEdit?: (request: AmenityRequest) => void;
  onDelete?: (request: AmenityRequest) => void;
}> = ({ request, onClick, onEdit, onDelete }) => {
  const statusLabels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    completed: "Completed",
    rejected: "Rejected",
  };

  const status = statusLabels[request.status] || request.status;
  const requestDate = new Date(request.request_date).toLocaleDateString();

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <User className="w-4 h-4" />,
      content: (
        <span className="text-sm">
          Guest ID: {request.guest_id.slice(0, 8)}...
        </span>
      ),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      content: <span className="text-sm">Date: {requestDate}</span>,
    },
  ];

  if (request.request_time) {
    sections.push({
      icon: <Clock className="w-4 h-4" />,
      content: <span className="text-sm">Time: {request.request_time}</span>,
    });
  }

  if (request.special_instructions) {
    sections.push({
      icon: <FileText className="w-4 h-4 mt-0.5" />,
      content: (
        <p className="text-sm line-clamp-2">{request.special_instructions}</p>
      ),
      className: "items-start",
    });
  }

  return (
    <GenericCard
      icon={<Calendar className="w-6 h-6 text-orange-600" />}
      iconBgColor="bg-orange-100"
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
