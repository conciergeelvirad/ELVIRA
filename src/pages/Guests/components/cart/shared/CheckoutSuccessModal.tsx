/**
 * Checkout Success Modal
 *
 * Reusable success modal for cart checkout confirmations
 * Displays order-specific success messages
 */

import { SuccessModal } from "../../common/SuccessModal";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  orderType: "shop" | "dine_in" | "amenity";

  // Shop order details
  deliveryDate?: string;
  deliveryTime?: string;

  // Restaurant booking details
  reservationDate?: string;
  reservationTime?: string;

  // Room service details
  roomServiceDate?: string;
  roomServiceTime?: string;

  // Generic message (for amenities or custom cases)
  customMessage?: string;
}

export const CheckoutSuccessModal = ({
  isOpen,
  orderType,
  deliveryDate,
  deliveryTime,
  reservationDate,
  reservationTime,
  roomServiceDate,
  roomServiceTime,
  customMessage,
}: CheckoutSuccessModalProps) => {
  const getTitle = () => {
    switch (orderType) {
      case "shop":
        return "Order Placed!";
      case "dine_in":
        return "Order Placed!";
      case "amenity":
        return "Requests Submitted!";
      default:
        return "Success!";
    }
  };

  const getMessage = () => {
    if (customMessage) return customMessage;

    switch (orderType) {
      case "shop":
        if (deliveryDate) {
          return `Your order has been submitted successfully. We'll deliver it on ${deliveryDate}${
            deliveryTime ? ` at ${deliveryTime}` : ""
          }.`;
        }
        return "Your order has been submitted successfully.";

      case "dine_in":
        if (reservationDate && reservationTime) {
          return `Your table is reserved for ${reservationDate} at ${reservationTime}.`;
        }
        if (roomServiceDate && roomServiceTime) {
          return `Your food will be delivered on ${roomServiceDate} at ${roomServiceTime}.`;
        }
        return "Your order has been placed successfully.";

      case "amenity":
        return "Your service requests have been submitted successfully. The hotel staff will process them shortly.";

      default:
        return "Your request has been processed successfully.";
    }
  };

  return (
    <SuccessModal isOpen={isOpen} title={getTitle()} message={getMessage()} />
  );
};
