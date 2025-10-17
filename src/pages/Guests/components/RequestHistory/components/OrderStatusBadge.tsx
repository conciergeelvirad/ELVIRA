/**
 * Order Status Badge
 *
 * Visual indicator for order status with appropriate colors
 */

import type { OrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "confirmed":
        return {
          label: "Confirmed",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "in_progress":
        return {
          label: "In Progress",
          className: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
