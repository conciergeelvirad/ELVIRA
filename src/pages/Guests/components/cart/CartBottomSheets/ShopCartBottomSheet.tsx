/**
 * Shop Cart Bottom Sheet
 *
 * Bottom sheet component for displaying and managing shop cart
 * Allows guests to review items, adjust quantities, and checkout
 *
 * REFACTORED: Now uses shared cart components for cleaner code
 */

import { useState } from "react";
import { BottomSheet } from "../../common/BottomSheet";
import { useCart } from "../../../../../contexts/CartContext";
import { useGuestHotelId } from "../../../hooks";
import { getGuestSession } from "../../../../../services/guestAuth.service";
import { useCreateGuestShopOrder } from "../../../../../hooks/queries/guests";
import type { ShopOrderCreationData } from "../../../../../hooks/queries/hotel-management/shop-orders/shop-order.types";

// Import shared cart components
import {
  CartItemsList,
  CartSummary,
  EmptyCart,
  DatePickerField,
  TimePickerField,
  TextAreaField,
  CheckoutSuccessModal,
} from "../shared";

// Import utilities and hooks
import { extractGuestEmail } from "../utils/emailHelpers";
import { getTomorrowDate } from "../utils/cartValidation";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { useEmailNotification } from "../hooks/useEmailNotification";

interface ShopCartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess?: () => void;
}

export const ShopCartBottomSheet = ({
  isOpen,
  onClose,
  onCheckoutSuccess,
}: ShopCartBottomSheetProps) => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPriceByType,
    clearCartByType,
  } = useCart();
  const hotelId = useGuestHotelId();
  const session = getGuestSession();

  // Mutation hook for creating orders
  const createOrderMutation = useCreateGuestShopOrder();

  // Form state
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Use custom hooks
  const { executeCheckout, isSubmitting, showConfirmation } = useCartCheckout();
  const { sendEmail } = useEmailNotification();

  // Filter only product items
  const productItems = items.filter((item) => item.type === "product");
  const totalPrice = getTotalPriceByType("product");
  const isEmpty = productItems.length === 0;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    const guestId = session?.guestData?.id;
    if (!guestId || !deliveryDate || !session) return;

    const checkoutFn = async () => {
      // Prepare order data
      const orderData: ShopOrderCreationData = {
        order: {
          hotel_id: hotelId,
          guest_id: guestId,
          total_price: totalPrice,
          delivery_date: deliveryDate,
          delivery_time: deliveryTime || null,
          special_instructions: specialInstructions || null,
          status: "pending",
        },
        items: productItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_order: item.price,
        })),
      };

      // Create order with stock deduction
      const result = await createOrderMutation.mutateAsync(orderData);

      // Send email notification using helper
      const guestEmail = extractGuestEmail(
        session.guestData?.guest_personal_data
      );
      if (guestEmail && session.guestData && session.hotelData) {
        await sendEmail({
          orderType: "shop" as const,
          guestName: session.guestData.guest_name || "Guest",
          guestEmail,
          roomNumber: session.guestData.room_number || "",
          hotelName: session.hotelData.name || "Hotel",
          orderId: result?.id || "N/A",
          orderStatus: "pending",
          orderDetails: {
            shopItems: productItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            shopTotalPrice: totalPrice,
            shopDeliveryDate: deliveryDate,
            shopDeliveryTime: deliveryTime || undefined,
            specialInstructions: specialInstructions || undefined,
          },
        });
      }

      return result;
    };

    const onSuccess = () => {
      // Clear cart and reset form
      clearCartByType("product");
      setDeliveryDate("");
      setDeliveryTime("");
      setSpecialInstructions("");
      onCheckoutSuccess?.();
    };

    await executeCheckout(checkoutFn, onSuccess, onClose);
  };

  return (
    <>
      {/* Main Cart Bottom Sheet */}
      <BottomSheet
        isOpen={isOpen && !showConfirmation}
        onClose={onClose}
        title="Shopping Cart"
        fullHeight={false}
      >
        {isEmpty ? (
          <EmptyCart
            title="Your cart is empty"
            message="Add some products to get started"
          />
        ) : (
          <div className="flex flex-col max-h-[75vh]">
            {/* Cart Items - Scrollable */}
            <CartItemsList
              items={productItems}
              showQuantityControls={true}
              onQuantityChange={handleQuantityChange}
              onRemove={removeItem}
              maxHeight="40vh"
            />

            {/* Delivery Details Form */}
            <div className="border-t border-gray-200 px-4 py-4 space-y-3 bg-gray-50">
              <DatePickerField
                label="Delivery Date"
                value={deliveryDate}
                onChange={setDeliveryDate}
                required={true}
                minDate={getTomorrowDate()}
              />

              <TimePickerField
                label="Delivery Time (Optional)"
                value={deliveryTime}
                onChange={setDeliveryTime}
              />

              <TextAreaField
                label="Special Instructions (Optional)"
                value={specialInstructions}
                onChange={setSpecialInstructions}
                placeholder="Any special requests or delivery notes..."
                rows={2}
              />
            </div>

            {/* Footer - Total & Checkout */}
            <div className="sticky bottom-0 border-t border-gray-200 px-4 py-4 bg-white shadow-lg space-y-3">
              <CartSummary
                itemCount={productItems.length}
                totalPrice={totalPrice}
              />

              <button
                onClick={handleCheckout}
                disabled={isSubmitting || !deliveryDate}
                className="
                  w-full py-3 px-4
                  bg-[#8B5CF6] text-white font-semibold rounded-lg
                  hover:bg-purple-700 active:bg-purple-800
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Success Modal */}
      <CheckoutSuccessModal
        isOpen={showConfirmation}
        orderType="shop"
        deliveryDate={deliveryDate}
        deliveryTime={deliveryTime}
      />
    </>
  );
};
