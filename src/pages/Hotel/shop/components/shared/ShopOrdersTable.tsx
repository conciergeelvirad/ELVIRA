import { useState } from "react";
import { Check, X, Trash2, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TableView } from "../../../../../components/common/data-display/TableView";
import { StatusBadge } from "../../../../../components/common/data-display/StatusBadge";
import { Button } from "../../../../../components/common/ui/Button";
import { useConfirmDialog } from "../../../../../hooks/ui/useConfirmDialog";
import { useToast } from "../../../../../hooks/ui/useToast";
import {
  type ExtendedShopOrder,
  useShopOrders,
  useUpdateShopOrderStatus,
  useDeleteShopOrder,
} from "../../../../../hooks/queries/hotel-management/shop-orders";

const HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

export const ShopOrdersTable = () => {
  const [selectedStatus, setSelectedStatus] = useState<
    ExtendedShopOrder["status"] | "all"
  >("all");
  const { data: orders = [], isLoading } = useShopOrders(HOTEL_ID);
  const { mutate: updateStatus } = useUpdateShopOrderStatus();
  const { mutate: deleteOrder } = useDeleteShopOrder();
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();

  const handleStatusUpdate = async (
    order: ExtendedShopOrder,
    newStatus: ExtendedShopOrder["status"]
  ) => {
    const actionMap = {
      approved: "approve",
      rejected: "reject",
      delivered: "mark as delivered",
    } as const;

    const confirmed = await confirm({
      title: `Confirm Status Update`,
      message:
        newStatus === "pending"
          ? "Are you sure you want to reset this order to pending?"
          : `Are you sure you want to ${
              actionMap[newStatus as keyof typeof actionMap]
            } this order?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      updateStatus(
        { id: order.id, status: newStatus, hotelId: HOTEL_ID },
        {
          onSuccess: () => {
            toast({
              message: "Order status updated successfully",
              type: "success",
            });
          },
        }
      );
    }
  };

  const handleDelete = async (order: ExtendedShopOrder) => {
    const confirmed = await confirm({
      title: "Delete Order",
      message: "Are you sure you want to delete this order?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      deleteOrder(
        { id: order.id, hotelId: HOTEL_ID },
        {
          onSuccess: () => {
            toast({
              message: "Order deleted successfully",
              type: "success",
            });
          },
        }
      );
    }
  };

  const getOrderItems = (order: ExtendedShopOrder) => {
    return (
      order.shop_order_items
        ?.map((item) => `${item.product?.name} (x${item.quantity})`)
        .join(", ") || "-"
    );
  };

  const getTotalAmount = (order: ExtendedShopOrder) => {
    const total =
      order.shop_order_items?.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      ) || 0;
    return `$${total.toFixed(2)}`;
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected", "delivered"] as const).map(
          (status) => (
            <Button
              key={status}
              size="sm"
              variant={selectedStatus === status ? "dark" : "ghost"}
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          )
        )}
      </div>

      <TableView<ExtendedShopOrder>
        columns={[
          {
            key: "room",
            header: "Room",
            render: (_, row) => row.guests?.room_number || "-",
          },
          {
            key: "guest",
            header: "Guest",
            render: (_, row) => {
              const guest = row.guests?.guest_personal_data;
              if (!guest) return "Unknown";
              return `${guest.first_name} ${guest.last_name}`;
            },
          },
          {
            key: "items",
            header: "Items",
            render: (_, row) => getOrderItems(row),
          },
          {
            key: "total",
            header: "Total",
            render: (_, row) => getTotalAmount(row),
          },
          {
            key: "notes",
            header: "Notes",
            render: (_, row) => row.notes || "-",
          },
          {
            key: "status",
            header: "Status",
            render: (_, row) => (
              <StatusBadge
                status={row.status}
                label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              />
            ),
          },
          {
            key: "requested",
            header: "Requested",
            render: (_, row) =>
              row.created_at
                ? formatDistanceToNow(new Date(row.created_at), {
                    addSuffix: true,
                  })
                : "-",
          },
          {
            key: "actions",
            header: "Actions",
            render: (_, row) => (
              <div className="flex gap-2">
                {row.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={Check}
                      onClick={() => handleStatusUpdate(row, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={X}
                      onClick={() => handleStatusUpdate(row, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {row.status === "approved" && (
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={Package}
                    onClick={() => handleStatusUpdate(row, "delivered")}
                  >
                    Mark Delivered
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={Trash2}
                  onClick={() => handleDelete(row)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        rows={filteredOrders.map((order) => ({
          id: order.id,
          data: order,
        }))}
        loading={isLoading}
        emptyMessage="No shop orders found"
      />
    </div>
  );
};
