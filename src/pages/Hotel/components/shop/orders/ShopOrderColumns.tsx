import { Package } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import { StatusBadge } from "../../../../../components/common";
import { ShopOrder } from "../../../../../hooks/queries/hotel-management/shop-orders";

type EnhancedShopOrder = ShopOrder & Record<string, unknown>;

// Helper function to convert ShopOrder to EnhancedShopOrder
export const enhanceShopOrder = (order: ShopOrder): EnhancedShopOrder => {
  return order as unknown as EnhancedShopOrder;
};

// Helper to map order status to StatusBadge status type
const mapOrderStatus = (
  status: string
): "completed" | "pending" | "cancelled" | "default" => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "DELIVERED":
      return "completed";
    case "PENDING":
    case "PROCESSING":
      return "pending";
    case "CANCELLED":
      return "cancelled";
    default:
      return "default";
  }
};

export const getTableColumns = (): Column<ShopOrder>[] => {
  return [
    {
      key: "id",
      header: "ORDER ID",
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
      key: "guest_id",
      header: "GUEST",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {String(value).slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "total_price",
      header: "TOTAL",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${typeof value === "number" ? value.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "delivery_date",
      header: "DELIVERY DATE",
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
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      render: (value) => (
        <StatusBadge
          status={mapOrderStatus(String(value))}
          label={String(value).toUpperCase()}
          variant="soft"
        />
      ),
    },
  ];
};

export const getGridColumns = (): GridColumn[] => {
  return [
    {
      key: "id",
      label: "Order ID",
      accessor: "id",
      render: (value: string) => `#${value.slice(0, 8)}`,
    },
    {
      key: "guest_id",
      label: "Guest",
      accessor: "guest_id",
    },
    {
      key: "total_price",
      label: "Total",
      accessor: "total_price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "delivery_date",
      label: "Delivery Date",
      accessor: "delivery_date",
      render: (value: string) =>
        new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "status",
      label: "Status",
      accessor: "status",
      render: (value: string) => (
        <StatusBadge
          status={mapOrderStatus(value)}
          label={value.toUpperCase()}
          variant="soft"
        />
      ),
    },
  ];
};

// Detail fields for the modal
export const getDetailFields = (order: ShopOrder) => [
  { label: "Order ID", value: `#${order.id.slice(0, 8)}` },
  { label: "Guest ID", value: order.guest_id },
  { label: "Total Price", value: `$${order.total_price.toFixed(2)}` },
  {
    label: "Delivery Date",
    value: new Date(order.delivery_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  },
  {
    label: "Delivery Time",
    value: order.delivery_time || "Not specified",
  },
  { label: "Status", value: order.status.toUpperCase() },
  {
    label: "Special Instructions",
    value: order.special_instructions || "None",
  },
  {
    label: "Created",
    value: order.created_at
      ? new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A",
  },
];
