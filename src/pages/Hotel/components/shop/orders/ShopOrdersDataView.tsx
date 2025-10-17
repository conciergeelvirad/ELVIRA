import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import { ShopOrder } from "../../../../../hooks/queries/hotel-management/shop-orders";
import { ShoppingBag, Calendar, DollarSign } from "lucide-react";

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
  order: ShopOrder;
  onClick: () => void;
  onEdit?: (order: ShopOrder) => void;
  onDelete?: (order: ShopOrder) => void;
}> = ({ order, onClick, onEdit, onDelete }) => {
  const statusLabels: Record<string, string> = {
    COMPLETED: "Completed",
    PENDING: "Pending",
    CANCELLED: "Cancelled",
  };

  const status = statusLabels[order.status] || order.status;

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      content: (
        <div className="text-sm text-gray-600">
          Guest ID: {order.guest_id.slice(0, 8)}...
        </div>
      ),
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <span className="text-lg font-semibold text-green-600">
          ${order.total_price.toFixed(2)}
        </span>
      ),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      content: (
        <span className="text-sm text-gray-500">
          Delivery: {new Date(order.delivery_date).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <GenericCard
      icon={<ShoppingBag className="w-6 h-6 text-purple-600" />}
      iconBgColor="bg-purple-100"
      title={`Order #${order.id.slice(0, 8)}`}
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
