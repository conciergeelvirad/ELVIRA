/**
 * Dine-In Order Columns, Detail, DataView, and FormFields
 * All-in-one export file
 */

import { UtensilsCrossed, User, MapPin, Clock, DollarSign } from "lucide-react";
import React from "react";
import { FormFieldConfig } from "../../../../../hooks";
import { StatusBadge } from "../../../../../components/common";
import { Column } from "../../../../../types/table";
import type {
  DineInOrder,
  DineInOrderWithDetails,
} from "../../../../../hooks/queries/hotel-management/restaurants";

// Helper to map order status to StatusBadge status type
const mapOrderStatus = (
  status: string
): "completed" | "pending" | "cancelled" | "default" => {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
      return "completed";
    case "pending":
    case "preparing":
      return "pending";
    case "cancelled":
      return "cancelled";
    default:
      return "default";
  }
};

// COLUMNS
export const dineInOrderTableColumns: Column<DineInOrderWithDetails>[] = [
  {
    key: "id",
    header: "ORDER ID",
    sortable: true,
    accessor: (order: DineInOrderWithDetails) => {
      const orderId = (order as DineInOrder).id;
      return (
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">
            #{String(orderId).slice(0, 8)}
          </span>
        </div>
      );
    },
  },
  {
    key: "order_type",
    header: "TYPE",
    sortable: true,
    accessor: (order: DineInOrderWithDetails) => {
      const orderType = (order as any).order_type || "dine-in";
      const typeDisplay = orderType
        .replace(/_/g, "-") // Replace underscores with hyphens first
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return (
        <StatusBadge
          status="info"
          label={typeDisplay}
          variant="soft"
          size="sm"
        />
      );
    },
  },
  {
    key: "items",
    header: "ITEMS",
    sortable: false,
    accessor: (order: DineInOrderWithDetails) => {
      const items = order.items || [];
      const firstItem = items[0];
      const menuItem = firstItem?.menu_item;
      const itemCount = items.length;

      return (
        <div className="flex items-center gap-2">
          {menuItem?.image_url ? (
            <img
              src={menuItem.image_url}
              alt={menuItem.name}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <div className="font-medium text-sm">
              {menuItem?.name || "Order Items"}
            </div>
            {itemCount > 1 && (
              <div className="text-xs text-gray-500">
                +{itemCount - 1} more items
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "guest",
    header: "GUEST",
    sortable: true,
    accessor: (order: DineInOrderWithDetails) => {
      const guest = order.guest;
      const personalData = (
        guest as unknown as {
          guest_personal_data?: { first_name: string; last_name: string };
        }
      ).guest_personal_data;
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
    accessor: (order: DineInOrderWithDetails) => {
      const guest = order.guest;
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
    accessor: (order: DineInOrderWithDetails) => {
      const status = (order as DineInOrder).status;
      const label =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      return (
        <StatusBadge
          status={mapOrderStatus(status)}
          label={label}
          variant="soft"
        />
      );
    },
  },
  {
    key: "created_at",
    header: "CREATED",
    sortable: true,
    accessor: (order: DineInOrderWithDetails) => {
      const createdAt = (order as DineInOrder).created_at;
      return (
        <span className="text-sm text-gray-600">
          {createdAt
            ? new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      );
    },
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

// Detail fields for the modal - only showing relevant information
export const getDetailFields = (order: DineInOrder) => {
  console.log("🔍 [getDetailFields] Called with order:", order);

  // Determine order type (room_service vs restaurant/dine-in)
  const orderType = (order as any).order_type || "dine-in";
  const isRoomService =
    orderType === "room_service" || orderType === "room-service";

  console.log("🔍 [getDetailFields] Order type:", orderType);
  console.log("🔍 [getDetailFields] Is room service:", isRoomService);

  const fields = [
    {
      label: "Order ID",
      value: `#${order.id.slice(0, 8)}`,
    },
    {
      label: "Order Type",
      value: orderType
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    },
  ];

  console.log("🔍 [getDetailFields] Initial fields:", fields);

  // Add fields based on order type
  if (isRoomService) {
    // Room Service fields: delivery date/time combined
    const deliveryDate = (order as any).delivery_date
      ? new Date((order as any).delivery_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
    const deliveryTime = (order as any).delivery_time || "Not specified";

    fields.push({
      label: "Details",
      value: `${deliveryDate} at ${deliveryTime}`,
    });
  } else {
    // Restaurant/Dine-in fields: restaurant_name, reservation_date, reservation_time, number_of_guests, table_preferences
    // Add restaurant name if available
    const restaurantName =
      (order as any).restaurant?.name || (order as any).restaurant_name;
    if (restaurantName) {
      fields.push({
        label: "Restaurant",
        value: restaurantName,
      });
    }

    // Combine reservation date and time
    const reservationDate = (order as any).reservation_date
      ? new Date((order as any).reservation_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
    const reservationTime = (order as any).reservation_time || "Not specified";

    fields.push(
      {
        label: "Details",
        value: `${reservationDate} at ${reservationTime}`,
      },
      {
        label: "Number of Guests",
        value: (order as any).number_of_guests?.toString() || "Not specified",
      },
      {
        label: "Table Preferences",
        value: (order as any).table_preferences || "None",
      }
    );
  }

  // Special Instructions - shown for BOTH order types
  fields.push({
    label: "Special Instructions",
    value: (order as any).special_instructions || "None",
  });

  // Common fields shown for both types
  fields.push(
    {
      label: "Status",
      value: order.status.toUpperCase(),
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
    }
  );

  console.log("🔍 [getDetailFields] FINAL fields array:", fields);
  return fields;
};

// Detail View Component
export const DineInOrderDetail: React.FC<{
  item: DineInOrderWithDetails | null;
}> = ({ item }) => {
  console.log("🍽️ [DineInOrderDetail] Component rendered with item:", item);

  if (!item) {
    console.log("🍽️ [DineInOrderDetail] No item provided");
    return (
      <div className="p-8 text-center text-gray-400">
        Select an order to view details
      </div>
    );
  }

  const order = item as unknown as DineInOrder;
  console.log("🍽️ [DineInOrderDetail] Cast order:", order);

  // Extract order items
  const orderItems = item.items || [];
  console.log("🍽️ [DineInOrderDetail] Order items:", orderItems);

  // Calculate subtotal from items
  const subtotal = orderItems.reduce((sum, orderItem) => {
    const itemWithQuantity = orderItem as unknown as {
      quantity: number;
      menu_item: { price: number };
    };
    const quantity = itemWithQuantity.quantity || 0;
    const price = orderItem.menu_item.price;
    return sum + quantity * price;
  }, 0);

  console.log("🍽️ [DineInOrderDetail] Calculated subtotal:", subtotal);
  console.log(
    "🍽️ [DineInOrderDetail] Order total_price:",
    (order as any).total_price
  );
  console.log("🍽️ [DineInOrderDetail] Getting detail fields...");

  const detailFields = getDetailFields(order);
  console.log("🍽️ [DineInOrderDetail] Detail fields:", detailFields);

  console.log("🍽️ [DineInOrderDetail] RENDERING NEW LAYOUT");

  return (
    <div className="space-y-6">
      {/* Order Information */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Order Information
        </h3>
        {detailFields.map((field, index) => (
          <div
            key={index}
            className="py-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="grid grid-cols-2 items-center">
              <div>
                <span className="text-sm font-medium text-gray-500 uppercase">
                  {field.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {field.value?.toString() || "-"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Items List */}
      {orderItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Menu Items
          </h3>
          <div className="space-y-2">
            {orderItems.map((orderItem, index) => {
              const menuItem = orderItem.menu_item;
              const menuItemName = menuItem.name || "Unknown Item";
              const menuItemPrice = menuItem.price || 0;
              const quantity =
                (orderItem as unknown as { quantity: number }).quantity || 1;
              const itemTotal = menuItemPrice * quantity;
              const imageUrl = menuItem.image_url;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Menu Item Image */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={menuItemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UtensilsCrossed className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Menu Item Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {menuItemName}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${menuItemPrice.toFixed(2)} × {quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Total */}
          <div className="pt-3 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-700 uppercase">
                  Total
                </p>
                <p className="text-xs text-gray-500">
                  {orderItems.length} item{orderItems.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  $
                  {(order as any).total_price?.toFixed(2) ||
                    subtotal.toFixed(2)}
                </p>
                {(order as any).total_price &&
                  subtotal !== (order as any).total_price && (
                    <p className="text-xs text-gray-500">
                      Subtotal: ${subtotal.toFixed(2)}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// DATAVIEW
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";

/**
 * Dine-In Order Card Component for Grid View
 */
const DineInOrderCard: React.FC<{
  order: DineInOrder & {
    items?: Array<{
      menu_item: { name: string; image_url?: string; price: number };
      quantity?: number;
    }>;
    guest?: {
      room_number?: string;
      guest_name?: string;
      guest_personal_data?: { first_name: string; last_name: string };
    };
  };
  onClick: () => void;
  onEdit?: (order: DineInOrder) => void;
  onDelete?: (order: DineInOrder) => void;
}> = ({ order, onClick, onEdit, onDelete }) => {
  const statusConfig = {
    completed: { label: "Completed" },
    pending: { label: "Pending" },
    in_progress: { label: "In Progress" },
    cancelled: { label: "Cancelled" },
  };

  const statusLabel =
    statusConfig[order.status as keyof typeof statusConfig]?.label ||
    order.status;

  // Extract items data
  const items = order.items || [];
  const firstItem = items[0];
  const menuItemName = firstItem?.menu_item?.name || "Order Items";
  const itemCount = items.length;

  // Extract guest data
  const guest = order.guest;
  const personalData = guest?.guest_personal_data;
  const guestName = personalData
    ? `${personalData.first_name} ${personalData.last_name}`
    : guest?.guest_name || "Unknown Guest";
  const roomNumber = guest?.room_number || "N/A";

  // Calculate total from items
  const total = items.reduce((sum: number, item: any) => {
    const quantity = item.quantity || 1;
    const price = item.menu_item.price || 0;
    return sum + quantity * price;
  }, 0);

  // Format created date
  const createdDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Determine order type
  const isRoomService = order.service_type === "room_service";
  const orderTypeLabel = isRoomService ? "Room Service" : "Restaurant";

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <UtensilsCrossed className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Items:</span> {menuItemName}
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
      icon: <MapPin className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Type:</span> {orderTypeLabel}
        </>
      ),
    },
  ];

  // Add total price if available
  const orderTotal = (order as any).total_price || total;
  if (orderTotal > 0) {
    sections.push({
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Total:</span>{" "}
          <span className="text-green-600 font-semibold">
            ${orderTotal.toFixed(2)}
          </span>
        </>
      ),
    });
  }

  sections.push({
    icon: <Clock className="w-4 h-4" />,
    content: (
      <>
        <span className="font-medium">Created:</span> {createdDate}
      </>
    ),
  });

  return (
    <GenericCard
      icon={
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-lg font-bold text-green-600">{roomNumber}</span>
        </div>
      }
      iconBgColor="bg-green-100"
      title="Dine-In Order"
      subtitle={`#${order.id.slice(0, 8)}`}
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

// FORM FIELDS - Full form for creating orders
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
      { value: "confirmed", label: "Confirmed" },
      { value: "preparing", label: "Preparing" },
      { value: "ready", label: "Ready" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];

// Form fields for editing dine-in orders (only status can be updated)
export const DINE_IN_ORDER_EDIT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "preparing", label: "Preparing" },
      { value: "ready", label: "Ready" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];
