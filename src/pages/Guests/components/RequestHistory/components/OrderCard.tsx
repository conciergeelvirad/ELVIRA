/**
 * Order Card Component
 *
 * Displays individual order with details (compact version)
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { UnifiedOrder } from "../types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderCardProps {
  order: UnifiedOrder;
  onCancel?: (orderId: string, orderType: string) => void;
}

export const OrderCard = ({ order, onCancel }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string | null) => {
    return timeString || "Not specified";
  };

  const getOrderTitle = () => {
    if (order.type === "shop") {
      return `Shop Order`;
    } else if (order.type === "dine_in") {
      if (order.order_type === "restaurant_booking") {
        return order.restaurant_name || "Restaurant Booking";
      }
      return "Room Service";
    } else {
      return order.amenity_name;
    }
  };

  const getOrderSubtitle = () => {
    if (order.type === "shop") {
      return `${order.items.length} item(s) • ${formatDate(
        order.delivery_date
      )}`;
    } else if (order.type === "dine_in") {
      const date =
        order.order_type === "restaurant_booking"
          ? order.reservation_date
          : order.delivery_date;
      return `${order.items.length} item(s)${
        date ? ` • ${formatDate(date)}` : ""
      }`;
    } else {
      return `${order.category} • ${formatDate(order.request_date)}`;
    }
  };

  const handleCancelClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onCancel || isCancelling) return;

    setIsCancelling(true);
    try {
      await onCancel(order.id, order.type);
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = order.status === "pending" && onCancel;

  const renderOrderDetails = () => {
    if (order.type === "shop") {
      return (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">
            <span className="font-medium">Delivery:</span>{" "}
            {formatDate(order.delivery_date)} at{" "}
            {formatTime(order.delivery_time)}
          </div>

          {/* Items List */}
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs text-gray-700"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-2 border-t flex justify-between text-sm font-semibold">
            <span>Total:</span>
            <span className="text-purple-600">
              ${order.total_price.toFixed(2)}
            </span>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-xs text-gray-600">
                {order.special_instructions}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (order.type === "dine_in") {
      return (
        <div className="space-y-2">
          {/* Booking/Delivery Info */}
          <div className="text-xs text-gray-600 space-y-0.5">
            {order.order_type === "restaurant_booking" ? (
              <>
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(order.reservation_date!)}
                </div>
                <div>
                  <span className="font-medium">Time:</span>{" "}
                  {formatTime(order.reservation_time!)}
                </div>
                <div>
                  <span className="font-medium">Guests:</span>{" "}
                  {order.number_of_guests}
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="font-medium">Delivery:</span>{" "}
                  {formatDate(order.delivery_date!)} at{" "}
                  {formatTime(order.delivery_time!)}
                </div>
              </>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs text-gray-700"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-2 border-t flex justify-between text-sm font-semibold">
            <span>Total:</span>
            <span className="text-purple-600">
              ${order.total_price.toFixed(2)}
            </span>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-xs text-gray-600">
                {order.special_instructions}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Amenity Request
    return (
      <div className="space-y-2">
        <div className="text-xs text-gray-600 space-y-0.5">
          <div>
            <span className="font-medium">Date:</span>{" "}
            {formatDate(order.request_date)}
          </div>
          <div>
            <span className="font-medium">Time:</span>{" "}
            {formatTime(order.request_time)}
          </div>
        </div>

        {order.special_instructions && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-gray-700 mb-1">Details:</p>
            <p className="text-xs text-gray-600">
              {order.special_instructions}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
      {/* Card Header - Compact */}
      <div className="w-full p-3 flex items-center justify-between gap-2">
        {/* Order Info - Clickable to expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-left min-w-0 hover:bg-gray-50 transition-colors rounded px-2 py-1 -mx-2 -my-1"
        >
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {getOrderTitle()}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{getOrderSubtitle()}</p>
        </button>

        {/* Status, Cancel, and Expand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <OrderStatusBadge status={order.status} />
          {canCancel && (
            <button
              onClick={handleCancelClick}
              disabled={isCancelling}
              className="p-1.5 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
              title="Cancel order"
              aria-label="Cancel order"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details - Compact */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="pt-3">{renderOrderDetails()}</div>
        </div>
      )}
    </div>
  );
};
