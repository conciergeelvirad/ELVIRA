/**
 * useEmailNotification Hook
 *
 * Handles email notifications for cart checkouts
 * Fails gracefully - email errors don't block order creation
 */

import { sendOrderNotificationEmail } from "../../../../../services/orderEmailNotification.service";
import type { OrderEmailData } from "../../../../../services/orderEmailNotification.service";

interface UseEmailNotificationReturn {
  sendEmail: (emailData: OrderEmailData) => Promise<void>;
  isSending: boolean;
  emailError: string | null;
}

export const useEmailNotification = (): UseEmailNotificationReturn => {
  const sendEmail = async (emailData: OrderEmailData): Promise<void> => {
    try {
      const result = await sendOrderNotificationEmail(emailData);

      if (!result.success) {
        console.error("⚠️ Email notification failed:", result.error);
      }
    } catch (error) {
      // Log error but don't throw - email failure shouldn't block order
      console.error("⚠️ Email notification failed:", error);
    }
  };

  return {
    sendEmail,
    isSending: false, // Could add loading state if needed
    emailError: null, // Could track email errors if needed
  };
};
