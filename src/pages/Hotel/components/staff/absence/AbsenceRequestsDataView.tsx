/**
 * Absence Requests Data View Component
 *
 * Renders absence requests in table or grid view with pagination and action handlers.
 */

import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import type { AbsenceRequestWithStaff } from "../../../../../hooks/queries/hotel-management/absence-requests";
import { Calendar, User, FileText } from "lucide-react";

interface AbsenceRequestsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: unknown[];
  handleRowClick: (request: AbsenceRequestWithStaff) => void;
  onEdit?: (request: AbsenceRequestWithStaff) => void;
  onDelete?: (request: AbsenceRequestWithStaff) => void;
}

/**
 * Table columns for absence requests
 */
const absenceColumns: Column<AbsenceRequestWithStaff>[] = [
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (_, request) => {
      const color =
        request.status === "approved"
          ? "bg-green-100 text-green-800"
          : request.status === "rejected"
          ? "bg-red-100 text-red-800"
          : request.status === "cancelled"
          ? "bg-gray-100 text-gray-800"
          : "bg-yellow-100 text-yellow-800";

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      );
    },
  },
  {
    key: "requestType",
    header: "Type",
    accessor: (request) => {
      const typeMap = {
        vacation: "Vacation",
        sick: "Sick Leave",
        personal: "Personal",
        training: "Training",
        other: "Other",
      };
      return (
        typeMap[request.requestType as keyof typeof typeMap] ||
        request.requestType
      );
    },
  },
  {
    key: "staffName",
    header: "Staff Member",
    accessor: "staffName",
  },
  {
    key: "startDate",
    header: "Start Date",
    accessor: "startDate",
  },
  {
    key: "endDate",
    header: "End Date",
    accessor: "endDate",
  },
  {
    key: "notes",
    header: "Notes",
    accessor: (request) => request.notes || "-",
  },
];

/**
 * Grid columns for absence requests
 */
const absenceGridColumns: GridColumn[] = [
  { key: "staffName", label: "Staff Member" },
  { key: "requestType", label: "Type" },
  { key: "startDate", label: "Start Date" },
  { key: "status", label: "Status" },
];

/**
 * Absence Request Card Component for Grid View
 */
const AbsenceRequestCard: React.FC<{
  request: AbsenceRequestWithStaff;
  onClick: () => void;
  onEdit?: (request: AbsenceRequestWithStaff) => void;
  onDelete?: (request: AbsenceRequestWithStaff) => void;
}> = ({ request, onClick, onEdit, onDelete }) => {
  const typeMap = {
    vacation: "Vacation",
    sick: "Sick Leave",
    personal: "Personal",
    training: "Training",
    other: "Other",
  };

  const requestType =
    typeMap[request.requestType as keyof typeof typeMap] || request.requestType;
  const status =
    request.status.charAt(0).toUpperCase() + request.status.slice(1);

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <User className="w-4 h-4" />,
      content: request.staffName,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      content: `${request.startDate} - ${request.endDate}`,
    },
  ];

  if (request.notes) {
    sections.push({
      icon: <FileText className="w-4 h-4 mt-0.5" />,
      content: <span className="line-clamp-2">{request.notes}</span>,
      className: "items-start",
    });
  }

  return (
    <GenericCard
      icon={<Calendar className="w-5 h-5 text-orange-600" />}
      iconBgColor="bg-orange-100"
      title={requestType}
      badge={{
        label: status,
        variant: "soft",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(request) : undefined}
          onDelete={onDelete ? () => onDelete(request) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Absence requests data view with table and grid rendering
 */
export const AbsenceRequestsDataView: React.FC<
  AbsenceRequestsDataViewProps
> = ({ viewMode, filteredData, handleRowClick, onEdit, onDelete }) => {
  return (
    <GenericDataView<AbsenceRequestWithStaff>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={absenceColumns}
      gridColumns={absenceGridColumns}
      getItemId={(request) => request.id}
      renderCard={(request, onClick) => (
        <AbsenceRequestCard
          request={request}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No absence requests found"
    />
  );
};
