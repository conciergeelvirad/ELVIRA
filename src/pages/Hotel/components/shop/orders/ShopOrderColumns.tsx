import { Package } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import { StatusBadge, ItemWithImage } from "../../../../../components/common";
import {
  ShopOrder,
  ExtendedShopOrder,
} from "../../../../../hooks/queries/hotel-management/shop-orders";

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

export const getTableColumns = (
  onStatusClick?: (order: ExtendedShopOrder) => void
): Column<ExtendedShopOrder>[] => {
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
      key: "shop_order_items",
      header: "ITEMS",
      sortable: false,
      render: (_value, order) => {
        const items = order.shop_order_items || [];
        const firstItem = items[0];
        const product = firstItem?.product;
        const itemCount = items.length;

        return (
          <ItemWithImage
            imageUrl={product?.image_url || ""}
            title={product?.name || "Order Items"}
            description={itemCount > 1 ? `+${itemCount - 1} more items` : ""}
            fallbackIcon={<Package className="w-5 h-5" />}
          />
        );
      },
    },
    {
      key: "guests",
      header: "GUEST",
      sortable: true,
      render: (_value, order) => {
        const guest = order.guests as any;
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
      render: (_value, order) => {
        const guest = order.guests as any;
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
      render: (value, order) => (
        <StatusBadge
          status={mapOrderStatus(String(value))}
          label={String(value).toUpperCase()}
          variant="soft"
          onClick={onStatusClick ? () => onStatusClick(order) : undefined}
          clickable={!!onStatusClick}
        />
      ),
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
      label: "Order ID",
      accessor: "id",
      render: (value: string) => `#${value.slice(0, 8)}`,
    },
    {
      key: "items",
      label: "Items",
      accessor: "shop_order_items",
    },
    {
      key: "guest",
      label: "Guest",
      accessor: "guests",
    },
    {
      key: "room_number",
      label: "Room",
      accessor: "guests",
    },
    {
      key: "total_price",
      label: "Total",
      accessor: "total_price",
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
    {
      key: "created_at",
      label: "Created",
      accessor: "created_at",
    },
  ];
};

// Detail fields for the modal
export const getDetailFields = (order: ShopOrder) => [
  { label: "Order ID", value: `#${order.id.slice(0, 8)}` },
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
