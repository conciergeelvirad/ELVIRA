import { StatusBadge } from "../common/data-display/StatusBadge";
import { TableContainer, TableHeader, TableBody } from "../common/table";
import type { StatusType } from "../common/data-display/StatusBadge";
import type { Column, TableRow } from "../../types/table";
import { type DineInOrderWithDetails } from "../../hooks/queries/hotel-management/restaurants";

interface DineInOrdersTableProps {
  data: DineInOrderWithDetails[];
  isLoading: boolean;
}

const getOrderStatusType = (status: string): StatusType => {
  const statusMap: Record<string, StatusType> = {
    completed: "success",
    pending: "warning",
    cancelled: "error",
    processing: "info",
  };
  return statusMap[status.toLowerCase()] || "default";
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "id",
    header: "Order ID",
    render: (value: string) => (
      <span className="font-mono text-xs">{(value || "").substring(0, 8)}</span>
    ),
  },
  {
    key: "created_at",
    header: "Date",
    render: (value: string) =>
      value ? new Date(value).toLocaleDateString() : "-",
  },
  {
    key: "guest",
    header: "Guest",
    render: (_, item: Record<string, unknown>) => {
      const order = item as unknown as DineInOrderWithDetails;
      const guestName = order.guest?.guest_name || "-";
      const roomNumber = order.guest?.room_number || "-";
      return `${guestName} (Room ${roomNumber})`;
    },
  },
  {
    key: "order_type",
    header: "Type",
    render: (value: string) => (
      <StatusBadge
        status="info"
        size="sm"
        label={(value || "").replace("_", " ")}
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value: string) => {
      const statusType = getOrderStatusType(value || "");
      return (
        <StatusBadge
          status={statusType}
          size="sm"
          label={(value || "").replace("_", " ")}
        />
      );
    },
  },
  {
    key: "items",
    header: "Items",
    render: (_, item: Record<string, unknown>) => {
      const order = item as unknown as DineInOrderWithDetails;
      return order.items?.length || 0;
    },
  },
  {
    key: "total_price",
    header: "Total",
    render: (value: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value || 0),
  },
  {
    key: "reservation_date",
    header: "Reservation",
    render: (value: string, item: Record<string, unknown>) => {
      const order = item as unknown as DineInOrderWithDetails;
      if (!value) return "-";
      const formattedDate = new Date(value).toLocaleDateString();
      return `${formattedDate} ${order.reservation_time || ""}`.trim();
    },
  },
  {
    key: "special_instructions",
    header: "Notes",
    render: (value: string) => value || "-",
  },
];

export const DineInOrdersTable = ({
  data,
  isLoading,
}: DineInOrdersTableProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const tableData = data.map((order) => ({
    ...order,
    __type: "DineInOrder" as const,
  }));
  const rows: TableRow<Record<string, unknown>>[] = tableData.map((order) => ({
    id: order.id,
    data: order,
  }));

  return (
    <TableContainer>
      <TableHeader<Record<string, unknown>> columns={columns} />
      <TableBody<Record<string, unknown>> columns={columns} rows={rows} />
    </TableContainer>
  );
};
