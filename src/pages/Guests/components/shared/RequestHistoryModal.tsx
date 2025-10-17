/**
 * Request History Modal Component
 *
 * Displays guest's request history including:
 * - Shop orders
 * - Dine-in orders (restaurant bookings & room service)
 * - Amenity requests
 *
 * Features:
 * - Full-screen mobile-optimized modal
 * - Grouped by date
 * - Expandable order details
 * - Status badges and type icons
 * - Loading and empty states
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { ConfirmationModal } from "../../../../components/common/ui";
import { useRequestHistory } from "../RequestHistory/hooks";
import {
  OrderCard,
  LoadingHistory,
  EmptyHistory,
} from "../RequestHistory/components";
import { useGuestHotelId } from "../../hooks";

interface RequestHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
}

export const RequestHistoryModal = ({
  isOpen,
  onClose,
  guestId,
}: RequestHistoryModalProps) => {
  const hotelId = useGuestHotelId();
  const queryClient = useQueryClient();

  // State for confirmation modal
  const [cancelConfirmation, setCancelConfirmation] = useState<{
    orderId: string;
    orderType: string;
  } | null>(null);

  // Fetch request history
  const {
    data: groupedOrders,
    isLoading,
    error,
  } = useRequestHistory({
    guestId,
    hotelId: hotelId || "",
  });

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: async ({
      orderId,
      orderType,
    }: {
      orderId: string;
      orderType: string;
    }) => {
      const tableName =
        orderType === "shop"
          ? "shop_orders"
          : orderType === "dine_in"
          ? "dine_in_orders"
          : "amenity_requests";

      const { error } = await supabase
        .from(tableName)
        .update({ status: "cancelled" })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh the request history
      queryClient.invalidateQueries({
        queryKey: ["request-history", guestId, hotelId],
      });
      // Close confirmation modal
      setCancelConfirmation(null);
    },
  });

  const handleCancelOrder = (orderId: string, orderType: string) => {
    // Open confirmation modal
    setCancelConfirmation({ orderId, orderType });
  };

  const handleConfirmCancel = async () => {
    if (cancelConfirmation) {
      await cancelMutation.mutateAsync(cancelConfirmation);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate total number of orders
  const totalOrders =
    groupedOrders?.reduce((sum, group) => sum + group.orders.length, 0) || 0;

  // Calculate total dollar amount
  const totalAmount =
    groupedOrders?.reduce((sum, group) => {
      return (
        sum +
        group.orders.reduce((orderSum, order) => {
          // Only count orders with total_price (shop and dine-in orders, not amenities)
          if (order.type === "shop" || order.type === "dine_in") {
            return orderSum + (order.total_price || 0);
          }
          return orderSum;
        }, 0)
      );
    }, 0) || 0;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request History</h2>
            {!isLoading && totalOrders > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">
                {totalOrders} {totalOrders === 1 ? "order" : "orders"} • $
                {totalAmount.toFixed(2)} total
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <LoadingHistory />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">
                Failed to load request history
              </p>
              <p className="text-sm text-gray-500">Please try again later</p>
            </div>
          ) : !groupedOrders || groupedOrders.length === 0 ? (
            <EmptyHistory />
          ) : (
            <div className="space-y-6">
              {groupedOrders.map((group) => (
                <div key={group.date}>
                  {/* Date Header */}
                  <div className="sticky top-0 bg-white py-2 mb-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {group.date}
                    </h3>
                  </div>

                  {/* Orders for this date */}
                  <div className="space-y-3">
                    {group.orders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onCancel={handleCancelOrder}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}

      {/* Confirmation Modal for Cancellation - Higher z-index to appear above */}
      {cancelConfirmation &&
        createPortal(
          <div className="fixed inset-0 z-[60]">
            <ConfirmationModal
              isOpen={true}
              onClose={() => setCancelConfirmation(null)}
              onConfirm={handleConfirmCancel}
              title="Cancel Order"
              message="Are you sure you want to cancel this order? This action cannot be undone."
              confirmText="Yes, Cancel Order"
              cancelText="No, Keep Order"
              variant="warning"
              isLoading={cancelMutation.isPending}
            />
          </div>,
          document.body
        )}
    </>
  );
};
