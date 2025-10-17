/**
 * Dine-In Order Columns, Detail, DataView, and FormFields
 * All-in-one export file
 */

import { User, MapPin, Clock } from "lucide-react";
import React from "react";
import { FormFieldConfig } from "../../../../../hooks";
import { StatusBadge } from "../../../../../components/common";
import { Column } from "../../../../../types/table";
import type { DineInOrder } from "../../../../../hooks/queries/hotel-management/restaurants";

// COLUMNS
export const dineInOrderTableColumns: Column<DineInOrder>[] = [
  {
    key: "guest_name",
    header: "Guest",
    accessor: (order: any) => {
      // The guest object has guest_name field, not name
      return order.guest?.guest_name || order.guest_name || "-";
    },
  },
  {
    key: "room_number",
    header: "Room",
    accessor: (order: any) =>
      order.guest?.room_number || order.room_number || "-",
  },
  {
    key: "table_number",
    header: "Table",
    accessor: (order: any) => order.table_number || "-",
  },
  {
    key: "status",
    header: "Status",
    accessor: (order) => (
      <StatusBadge
        status={
          order.status === "completed"
            ? "active"
            : order.status === "pending"
            ? "warning"
            : "inactive"
        }
        label={order.status}
      />
    ),
  },
];

export const dineInOrderGridColumns = [
  { key: "guest_name", label: "Guest" },
  { key: "room_number", label: "Room" },
  { key: "status", label: "Status" },
];

export const dineInOrderDetailFields = [
  {
    key: "guest_name",
    label: "Guest Name",
    icon: User,
    accessor: (order: any) =>
      order.guest?.guest_name || order.guest_name || "N/A",
  },
  {
    key: "room_number",
    label: "Room",
    icon: MapPin,
    accessor: (order: any) =>
      order.guest?.room_number || order.room_number || "N/A",
  },
  {
    key: "table_number",
    label: "Table",
    accessor: (order: any) => order.table_number || "N/A",
  },
  {
    key: "created_at",
    label: "Ordered",
    icon: Clock,
    accessor: (order: DineInOrder) =>
      order.created_at ? new Date(order.created_at).toLocaleString() : "N/A",
  },
  {
    key: "status",
    label: "Status",
    accessor: (order: DineInOrder) => (
      <StatusBadge
        status={
          order.status === "completed"
            ? "active"
            : order.status === "pending"
            ? "warning"
            : "inactive"
        }
        label={order.status}
      />
    ),
  },
];

// DETAIL
export const DineInOrderDetail = ({ order }: { order: DineInOrder }) => (
  <div className="grid grid-cols-1 gap-4">
    {dineInOrderDetailFields.map((field) => {
      const Icon = field.icon;
      const value =
        typeof field.accessor === "function"
          ? field.accessor(order)
          : order[field.key as keyof DineInOrder];
      return (
        <div key={field.key} className="flex items-start space-x-3">
          {Icon && (
            <div className="mt-1">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500">{field.label}</p>
            <p className="mt-1 text-sm text-gray-900 break-words">
              {String(value)}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

// DATAVIEW
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { UtensilsCrossed } from "lucide-react";

/**
 * Dine-In Order Card Component for Grid View
 */
const DineInOrderCard: React.FC<{
  order: DineInOrder;
  onClick: () => void;
  onEdit?: (order: DineInOrder) => void;
  onDelete?: (order: DineInOrder) => void;
}> = ({ order, onClick, onEdit, onDelete }) => {
  const orderAny = order as Record<string, unknown>;
  const guestAny = orderAny.guest as Record<string, unknown> | undefined;

  const guestName =
    (guestAny?.guest_name as string) ||
    (orderAny.guest_name as string) ||
    "N/A";
  const roomNumber =
    (guestAny?.room_number as string) ||
    (orderAny.room_number as string) ||
    "N/A";
  const tableNumber = orderAny.table_number as string | undefined;

  const statusConfig = {
    completed: { label: "Completed" },
    pending: { label: "Pending" },
    in_progress: { label: "In Progress" },
    cancelled: { label: "Cancelled" },
  };

  const statusLabel =
    statusConfig[order.status as keyof typeof statusConfig]?.label ||
    order.status;

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [];

  if (tableNumber) {
    sections.push({
      icon: <MapPin className="w-4 h-4" />,
      content: `Table ${tableNumber}`,
    });
  }

  sections.push({
    icon: <Clock className="w-4 h-4" />,
    content: order.created_at
      ? new Date(order.created_at).toLocaleString()
      : "N/A",
  });

  return (
    <GenericCard
      icon={<UtensilsCrossed className="w-6 h-6 text-green-600" />}
      iconBgColor="bg-green-100"
      title={guestName}
      subtitle={`Room ${roomNumber}`}
      badge={{
        label: statusLabel,
        variant: "soft",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(order) : undefined}
          onDelete={onDelete ? () => onDelete(order) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

export const DineInOrdersDataView: React.FC<{
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (order: DineInOrder) => void;
  onEdit: (order: DineInOrder) => void;
  onDelete: (order: DineInOrder) => void;
}> = ({ viewMode, filteredData, handleRowClick, onEdit, onDelete }) => {
  return (
    <GenericDataView<DineInOrder>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={dineInOrderTableColumns}
      gridColumns={dineInOrderGridColumns}
      getItemId={(order) => order.id}
      renderCard={(order, onClick) => (
        <DineInOrderCard
          order={order}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No dine-in orders found"
    />
  );
};

// FORM FIELDS
export const DINE_IN_ORDER_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "guest_name",
    label: "Guest Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter guest name",
  },
  {
    key: "room_number",
    label: "Room Number",
    type: "text" as const,
    required: true,
    placeholder: "Enter room number",
  },
  {
    key: "table_number",
    label: "Table Number",
    type: "text" as const,
    required: false,
    placeholder: "Enter table number",
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];
