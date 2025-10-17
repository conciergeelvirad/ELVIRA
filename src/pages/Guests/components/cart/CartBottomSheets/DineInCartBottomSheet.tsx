/**
 * DineIn Cart Bottom Sheet
 *
 * Supports two order types: restaurant_booking and room_service
 * - Auto-detects service type from first item
 * - Shows warning for mixed service types
 * - Dynamic form fields based on service type
 *
 * REFACTORED: Now uses shared cart components + dedicated DineIn components
 */

import { useState, useMemo } from "react";
import { BottomSheet } from "../../common/BottomSheet";
import { useCart } from "../../../../../contexts/CartContext";
import { useGuestHotelId } from "../../../hooks";
import { getGuestSession } from "../../../../../services/guestAuth.service";
import { useCreateGuestDineInOrder } from "../../../../../hooks/queries/guests/dineIn/useGuestDineInOrderMutations";

// Import shared cart components
import {
  CartItemsList,
  CartSummary,
  EmptyCart,
  TextAreaField,
  CheckoutSuccessModal,
} from "../shared";

// Import DineIn-specific components
import {
  ServiceTypeBadge,
  MixedServiceWarning,
  RestaurantBookingForm,
  RoomServiceForm,
} from "./DineInCart";

// Import utilities and hooks
import { extractGuestEmail } from "../utils/emailHelpers";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { useEmailNotification } from "../hooks/useEmailNotification";
import { UtensilsCrossed } from "lucide-react";

interface DineInCartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess?: () => void;
}

export const DineInCartBottomSheet = ({
  isOpen,
  onClose,
  onCheckoutSuccess,
}: DineInCartBottomSheetProps) => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPriceByType,
    clearCartByType,
    getFoodServiceType,
  } = useCart();
  const hotelId = useGuestHotelId();
  const session = getGuestSession();

  // Mutation hook
  const createOrderMutation = useCreateGuestDineInOrder();

  // Use custom hooks
  const { executeCheckout, isSubmitting, showConfirmation } = useCartCheckout();
  const { sendEmail } = useEmailNotification();

  // Filter only food items
  const foodItems = items.filter((item) => item.type === "food");
  const totalPrice = getTotalPriceByType("food");
  const isEmpty = foodItems.length === 0;

  // Detect service type from cart items
  const detectedServiceType = getFoodServiceType();

  // Check for mixed service types
  const hasMixedServiceTypes = useMemo(() => {
    const serviceTypes = new Set(
      foodItems
        .filter((item) => item.serviceType)
        .map((item) => item.serviceType)
    );
    return serviceTypes.size > 1;
  }, [foodItems]);

  // Form state
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Restaurant booking fields
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [tablePreferences, setTablePreferences] = useState("");

  // Room service fields
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // Get today's date as minimum date
  const today = new Date().toISOString().split("T")[0];

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const validateForm = () => {
    const guestId = session?.guestData?.id;
    if (!guestId) {
      alert("Guest session not found");
      return false;
    }

    if (hasMixedServiceTypes) {
      alert(
        "Cart contains mixed service types. Please remove items to have only Restaurant or Room Service items."
      );
      return false;
    }

    if (!detectedServiceType) {
      alert("Cannot determine order type. Please add items with service type.");
      return false;
    }

    if (detectedServiceType === "restaurant_booking") {
      if (!reservationDate || !reservationTime) {
        alert("Please select reservation date and time");
        return false;
      }
      if (numberOfGuests < 1) {
        alert("Number of guests must be at least 1");
        return false;
      }
    } else {
      if (!deliveryDate || !deliveryTime) {
        alert("Please select delivery date and time");
        return false;
      }
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm() || !session) return;

    const guestId = session.guestData?.id;
    if (!guestId) return;

    const checkoutFn = async () => {
      // Extract restaurant ID from first cart item
      const restaurantId = foodItems.find(
        (item) => item.restaurantId
      )?.restaurantId;

      // Prepare order data
      const orderData = {
        guestId,
        hotelId,
        orderType: detectedServiceType!,
        items: foodItems,
        totalPrice,
        specialInstructions: specialInstructions || undefined,

        // Restaurant booking fields
        ...(detectedServiceType === "restaurant_booking" && {
          restaurantId,
          reservationDate,
          reservationTime,
          numberOfGuests,
          tablePreferences: tablePreferences || undefined,
        }),

        // Room service fields
        ...(detectedServiceType === "room_service" && {
          deliveryDate,
          deliveryTime,
        }),
      };

      // Create order
      const result = await createOrderMutation.mutateAsync(orderData);

      // Send email notification
      const guestEmail = extractGuestEmail(
        session.guestData?.guest_personal_data
      );
      if (guestEmail && session.guestData && session.hotelData) {
        const restaurantName = foodItems[0]?.name?.includes("Restaurant")
          ? "Restaurant"
          : "Hotel Restaurant";

        await sendEmail({
          orderType: "dine_in" as const,
          guestName: session.guestData.guest_name || "Guest",
          guestEmail,
          roomNumber: session.guestData.room_number || "",
          hotelName: session.hotelData.name || "Hotel",
          orderId: result?.id || "N/A",
          orderStatus: "pending",
          orderDetails: {
            restaurantName,
            orderItems: foodItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            totalPrice,
            specialInstructions: specialInstructions || undefined,

            ...(detectedServiceType === "restaurant_booking" && {
              reservationDate,
              reservationTime,
              numberOfGuests,
              tablePreferences: tablePreferences || undefined,
            }),

            ...(detectedServiceType === "room_service" && {
              deliveryDate,
              deliveryTime,
            }),
          },
        });
      }

      return result;
    };

    const onSuccess = () => {
      // Clear cart and reset form
      clearCartByType("food");
      setSpecialInstructions("");
      setReservationDate("");
      setReservationTime("");
      setNumberOfGuests(2);
      setTablePreferences("");
      setDeliveryDate("");
      setDeliveryTime("");
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
        title="Dine-In Cart"
        fullHeight={false}
      >
        {isEmpty ? (
          <EmptyCart
            icon={UtensilsCrossed}
            title="Your cart is empty"
            message="Add some food items to get started"
          />
        ) : (
          <div className="flex flex-col h-[80vh]">
            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {/* Service Type Info Badge */}
              {detectedServiceType && (
                <ServiceTypeBadge serviceType={detectedServiceType} />
              )}

              {/* Mixed Service Types Warning */}
              {hasMixedServiceTypes && <MixedServiceWarning />}

              {/* Food Items List */}
              <CartItemsList
                items={foodItems}
                showQuantityControls={true}
                onQuantityChange={handleQuantityChange}
                onRemove={removeItem}
                maxHeight="35vh"
              />
            </div>

            {/* Order Details Form */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 space-y-2.5 bg-gray-50 max-h-[45vh] overflow-y-auto">
              {detectedServiceType === "restaurant_booking" ? (
                <RestaurantBookingForm
                  reservationDate={reservationDate}
                  setReservationDate={setReservationDate}
                  reservationTime={reservationTime}
                  setReservationTime={setReservationTime}
                  numberOfGuests={numberOfGuests}
                  setNumberOfGuests={setNumberOfGuests}
                  tablePreferences={tablePreferences}
                  setTablePreferences={setTablePreferences}
                  minDate={today}
                />
              ) : (
                <RoomServiceForm
                  deliveryDate={deliveryDate}
                  setDeliveryDate={setDeliveryDate}
                  deliveryTime={deliveryTime}
                  setDeliveryTime={setDeliveryTime}
                  minDate={today}
                />
              )}

              <TextAreaField
                label="Special Instructions (Optional)"
                value={specialInstructions}
                onChange={setSpecialInstructions}
                placeholder="Dietary restrictions, allergies, special requests..."
                rows={2}
              />
            </div>

            {/* Footer - Total & Checkout */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 bg-white shadow-lg space-y-2.5">
              <CartSummary
                itemCount={foodItems.length}
                totalPrice={totalPrice}
              />

              <button
                onClick={handleCheckout}
                disabled={
                  isSubmitting || hasMixedServiceTypes || !detectedServiceType
                }
                className="
                  w-full py-3 px-4
                  bg-[#8B5CF6] text-white font-semibold rounded-lg
                  hover:bg-purple-700 active:bg-purple-800
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {isSubmitting
                  ? "Placing Order..."
                  : detectedServiceType === "restaurant_booking"
                  ? "Place Reservation"
                  : "Place Room Service Order"}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Success Modal */}
      <CheckoutSuccessModal
        isOpen={showConfirmation}
        orderType="dine_in"
        reservationDate={reservationDate}
        reservationTime={reservationTime}
        roomServiceDate={deliveryDate}
        roomServiceTime={deliveryTime}
      />
    </>
  );
};
