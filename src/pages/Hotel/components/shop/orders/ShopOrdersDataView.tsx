import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import { ShopOrder } from "../../../../../hooks/queries/hotel-management/shop-orders";
import { ShoppingBag, Calendar, DollarSign, User, Package } from "lucide-react";

interface ShopOrdersDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (order: ShopOrder) => void;
  tableColumns: Column<ShopOrder>[];
  gridColumns: GridColumn[];
  onView: (order: ShopOrder) => void;
  onEdit: (order: ShopOrder) => void;
  onDelete: (order: ShopOrder) => void;
}

/**
 * Shop Order Card Component for Grid View
 */
const ShopOrderCard: React.FC<{
  order: ShopOrder & {
    shop_order_items?: Array<{
      product?: { name: string; image_url?: string };
    }>;
    guests?: {
      room_number?: string;
      guest_personal_data?: { first_name: string; last_name: string };
    };
  };
  onClick: () => void;
  onEdit?: (order: ShopOrder) => void;
  onDelete?: (order: ShopOrder) => void;
}> = ({ order, onClick, onEdit, onDelete }) => {
  const statusLabels: Record<string, string> = {
    COMPLETED: "Completed",
    DELIVERED: "Delivered",
    PENDING: "Pending",
    PROCESSING: "Processing",
    CANCELLED: "Cancelled",
  };

  const status = statusLabels[order.status] || order.status;

  // Extract items data
  const items = (order.shop_order_items as any) || [];
  const firstItem = items[0];
  const productName = firstItem?.product?.name || "Order Items";
  const itemCount = items.length;

  // Extract guest data
  const guest = order.guests as any;
  const personalData = guest?.guest_personal_data;
  const guestName = personalData
    ? `${personalData.first_name} ${personalData.last_name}`
    : "Unknown Guest";
  const roomNumber = guest?.room_number || "N/A";

  // Format created date
  const createdDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
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
      icon: <Package className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Items:</span> {productName}
          {itemCount > 1 && (
            <span className="text-gray-500"> +{itemCount - 1} more</span>
          )}
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
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Total:</span>{" "}
          <span className="text-green-600 font-semibold">
            ${order.total_price.toFixed(2)}
          </span>
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

  if (order.delivery_date) {
    const deliveryDate = new Date(order.delivery_date).toLocaleDateString(
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
          <span className="font-medium">Delivery:</span> {deliveryDate}
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
      title={`Shop Order`}
      subtitle={`#${order.id.slice(0, 8)}`}
      badge={{
        label: status,
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

export const ShopOrdersDataView: React.FC<ShopOrdersDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
}) => {
  return (
    <GenericDataView<ShopOrder>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(order) => order.id}
      renderCard={(order, onClick) => (
        <ShopOrderCard
          order={order}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No shop orders found"
    />
  );
};
