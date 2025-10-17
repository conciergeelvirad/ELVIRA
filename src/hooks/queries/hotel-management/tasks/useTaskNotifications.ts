/**
 * Task Notification Hook
 *
 * Sends email notifications to staff members when tasks are assigned
 */

import { supabase } from "../../../../lib/supabase";

export interface TaskNotificationResponse {
  success: boolean;
  staff: {
    staffName: string;
    staffEmail: string;
  };
  emailResult: unknown;
}

/**
 * Sends email notification for a newly created task
 *
 * @param taskId - ID of the task to send notification for
 * @returns Promise with notification result
 */
export const sendTaskNotification = async (
  taskId: string
): Promise<TaskNotificationResponse> => {
  try {
    // Get the current session to pass the JWT
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No active session");
    }

    // Call the edge function
    const { data, error } = await supabase.functions.invoke(
      "send-task-notifications-email",
      {
        body: { taskId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (error) {
      console.error("❌ Failed to send task notification:", error.message);
      throw error;
    }

    if (!data) {
      throw new Error("No response from email service");
    }

    console.log("✅ Task notification sent successfully");
    return data;
  } catch (error) {
    console.error("❌ Task notification error:", error);
    throw error;
  }
};
/**
 * Hook to send task notification (can be used independently)
 *
 * @returns Function to send notification for a task
 */
export const useSendTaskNotification = () => {
  return {
    sendNotification: sendTaskNotification,
  };
};
