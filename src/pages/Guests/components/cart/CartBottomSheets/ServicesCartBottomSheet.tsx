/**
 * Services Cart Bottom Sheet
 *
 * For requesting hotel amenities (spa, gym, pool, etc.)
 * - No quantity controls (one-time requests)
 * - Request date & time picker
 * - Special instructions
 *
 * REFACTORED: Now uses shared cart components
 */

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { BottomSheet } from "../../common/BottomSheet";
import { useCart } from "../../../../../contexts/CartContext";
import { useGuestHotelId } from "../../../hooks";
import { getGuestSession } from "../../../../../services/guestAuth.service";
import { useCreateGuestAmenityRequest } from "../../../../../hooks/queries/guests/amenities/useGuestAmenityRequestMutations";

// Import shared cart components
import {
  CartItemsList,
  EmptyCart,
  DatePickerField,
  TimePickerField,
  TextAreaField,
  CheckoutSuccessModal,
} from "../shared";

// Import utilities and hooks
import { extractGuestEmail } from "../utils/emailHelpers";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { useEmailNotification } from "../hooks/useEmailNotification";

interface ServicesCartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess?: () => void;
}

export const ServicesCartBottomSheet = ({
  isOpen,
  onClose,
  onCheckoutSuccess,
}: ServicesCartBottomSheetProps) => {
  const { items, removeItem, clearCartByType } = useCart();
  const hotelId = useGuestHotelId();
  const session = getGuestSession();

  // Mutation hook
  const createRequestMutation = useCreateGuestAmenityRequest();

  // Use custom hooks
  const { executeCheckout, isSubmitting, showConfirmation } = useCartCheckout();
  const { sendEmail } = useEmailNotification();

  // Filter only service items
  const serviceItems = items.filter((item) => item.type === "service");
  const isEmpty = serviceItems.length === 0;

  // Form state
  const [requestDate, setRequestDate] = useState("");
  const [requestTime, setRequestTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Get today's date as minimum date
  const today = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const guestId = session?.guestData?.id;
    if (!guestId) {
      alert("Guest session not found");
      return false;
    }

    if (!requestDate) {
      alert("Please select a request date");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !session) return;

    const guestId = session.guestData?.id;
    if (!guestId) return;

    const checkoutFn = async () => {
      // Prepare request data
      const requestData = {
        guestId,
        hotelId,
        items: serviceItems,
        requestDate,
        requestTime: requestTime || undefined,
        specialInstructions: specialInstructions || undefined,
      };

      // Create requests
      await createRequestMutation.mutateAsync(requestData);

      // Send email notifications for each amenity
      const guestEmail = extractGuestEmail(
        session.guestData?.guest_personal_data
      );
      if (guestEmail && session.guestData && session.hotelData) {
        // Send email for each amenity request
        const emailPromises = serviceItems.map((item) => {
          return sendEmail({
            orderType: "amenity" as const,
            guestName: session.guestData!.guest_name || "Guest",
            guestEmail,
            roomNumber: session.guestData!.room_number || "",
            hotelName: session.hotelData!.name || "Hotel",
            orderId: "N/A",
            orderStatus: "pending",
            orderDetails: {
              amenityName: item.name,
              amenityCategory: "Service",
              amenityPrice: `$${item.price.toFixed(2)}`,
              requestDate,
              requestTime: requestTime || undefined,
              specialInstructions: specialInstructions || undefined,
            },
          });
        });

        await Promise.all(emailPromises);
      }
    };

    const onSuccess = () => {
      // Clear cart and reset form
      clearCartByType("service");
      setSpecialInstructions("");
      setRequestDate("");
      setRequestTime("");
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
        title="Services Cart"
        fullHeight={false}
      >
        {isEmpty ? (
          <EmptyCart
            icon={Sparkles}
            title="Your cart is empty"
            message="Add some services to get started"
          />
        ) : (
          <div className="flex flex-col h-[80vh]">
            {/* Cart Items - Scrollable */}
            <CartItemsList
              items={serviceItems}
              showQuantityControls={false}
              onRemove={removeItem}
              maxHeight="45vh"
            />

            {/* Request Details Form */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 space-y-2.5 bg-gray-50 max-h-[45vh] overflow-y-auto">
              <DatePickerField
                label="Request Date"
                value={requestDate}
                onChange={setRequestDate}
                required={true}
                minDate={today}
              />

              <TimePickerField
                label="Preferred Time (Optional)"
                value={requestTime}
                onChange={setRequestTime}
              />

              <TextAreaField
                label="Special Instructions (Optional)"
                value={specialInstructions}
                onChange={setSpecialInstructions}
                placeholder="Any special requests or preferences..."
                rows={2}
              />
            </div>

            {/* Footer - Submit Button */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 bg-white shadow-lg">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isEmpty}
                className="w-full py-3 bg-[#8B5CF6] text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Submit Requests ({serviceItems.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Success Modal */}
      <CheckoutSuccessModal isOpen={showConfirmation} orderType="amenity" />
    </>
  );
};
