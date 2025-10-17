/**
 * useCartCheckout Hook
 *
 * Encapsulates common checkout logic for all cart types
 * Handles loading state, error handling, and success confirmation
 */

import { useState } from "react";

interface UseCartCheckoutReturn {
  isSubmitting: boolean;
  showConfirmation: boolean;
  error: string | null;
  executeCheckout: (
    checkoutFn: () => Promise<void>,
    onSuccess?: () => void,
    onClose?: () => void
  ) => Promise<void>;
  resetCheckout: () => void;
}

export const useCartCheckout = (): UseCartCheckoutReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCheckout = async (
    checkoutFn: () => Promise<void>,
    onSuccess?: () => void,
    onClose?: () => void
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Execute the checkout function (create order/request)
      await checkoutFn();

      // Show success confirmation
      setShowConfirmation(true);

      // Call success callback
      onSuccess?.();

      // Close confirmation and modal after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        onClose?.();
      }, 2000);
    } catch (err) {
      // Handle errors
      const errorMessage =
        err instanceof Error ? err.message : "Checkout failed";
      setError(errorMessage);

      // Show error alert
      alert(
        `Order failed: ${errorMessage}\nPlease try again or contact reception.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCheckout = () => {
    setIsSubmitting(false);
    setShowConfirmation(false);
    setError(null);
  };

  return {
    isSubmitting,
    showConfirmation,
    error,
    executeCheckout,
    resetCheckout,
  };
};
