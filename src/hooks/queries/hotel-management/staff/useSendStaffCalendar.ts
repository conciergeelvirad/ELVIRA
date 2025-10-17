import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";

interface SendCalendarResponse {
  success: boolean;
  message: string;
  totalStaff: number;
  successfulEmails: number;
  failedEmails: number;
  emailResults: Array<{
    staffName: string;
    staffEmail: string;
    success: boolean;
    emailId?: string;
    error?: string;
  }>;
  recipient?: string;
}

interface SendCalendarParams {
  hotelId: string;
}

/**
 * Function to send staff calendar emails via edge function
 *
 * @param hotelId - ID of the hotel to send calendars for
 * @returns Promise with sending result
 */
export const sendStaffCalendar = async (
  hotelId: string
): Promise<SendCalendarResponse> => {
  try {
    console.log("====================================");
    console.log("📧 SEND STAFF CALENDAR - START");
    console.log("====================================");
    console.log("🏨 Hotel ID:", hotelId);
    console.log("🌐 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

    // Get the current session to pass the JWT
    console.log("🔐 Getting user session...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("📋 Session status:", session ? "Active" : "No session");
    if (session) {
      console.log("👤 User ID:", session.user?.id);
      console.log("📧 User email:", session.user?.email);
      console.log("🔑 Token length:", session.access_token?.length);
    }

    if (!session) {
      console.error("❌ No active session found");
      throw new Error("No active session. Please log in.");
    }

    // Prepare request
    const requestBody = { hotelId };
    const requestHeaders = {
      Authorization: `Bearer ${session.access_token}`,
    };

    console.log("📦 Request body:", JSON.stringify(requestBody, null, 2));
    console.log("📋 Request headers:", {
      Authorization: `Bearer ${session.access_token.substring(0, 20)}...`,
    });
    console.log("🚀 Calling edge function: send-staff-calendar-email");

    // Call the edge function
    const { data, error } = await supabase.functions.invoke(
      "send-staff-calendar-email",
      {
        body: requestBody,
        headers: requestHeaders,
      }
    );

    console.log("📥 Edge function response received");
    console.log("❓ Has error:", !!error);
    console.log("❓ Has data:", !!data);

    if (error) {
      console.error("❌ Edge function error details:");
      console.error("  - Message:", error.message);
      console.error("  - Context:", error.context);
      console.error("  - Full error:", JSON.stringify(error, null, 2));
      throw new Error(error.message || "Failed to send calendar emails");
    }

    if (!data) {
      console.error("❌ No response data from email service");
      throw new Error("No response from email service");
    }

    console.log("✅ SUCCESS! Calendar emails sent");
    console.log("📊 Results:", JSON.stringify(data, null, 2));
    console.log("  - Total staff:", data.totalStaff);
    console.log("  - Successful emails:", data.successfulEmails);
    console.log("  - Failed emails:", data.failedEmails);
    console.log("====================================");
    return data;
  } catch (error) {
    console.error("====================================");
    console.error("💥 CRITICAL ERROR in sendStaffCalendar");
    console.error("====================================");
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error("Full error object:", error);
    console.error("====================================");
    throw error;
  }
};

/**
 * React Query mutation hook to send staff calendar emails
 *
 * Handles sending calendar emails to all active staff members
 * with their upcoming schedules for the next 30 days.
 *
 * Permission required:
 * - profiles.role = 'hotel'
 * - hotel_staff.position = 'Hotel Admin'
 * - hotel_staff.department = 'Manager'
 * OR elvira_admin
 *
 * @example
 * ```tsx
 * const { mutate: sendCalendar, isPending } = useSendStaffCalendar();
 *
 * const handleSendCalendar = () => {
 *   sendCalendar({ hotelId: '123' }, {
 *     onSuccess: (data) => {
 *       console.log('Sent to', data.successfulEmails, 'staff members');
 *     }
 *   });
 * };
 * ```
 */
export const useSendStaffCalendar = () => {
  return useMutation({
    mutationFn: ({ hotelId }: SendCalendarParams) => sendStaffCalendar(hotelId),
    onError: (error: Error) => {
      console.error("❌ Error sending calendar emails:", error.message);
    },
  });
};
