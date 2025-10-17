/**
 * useConversationSetup Hook
 *
 * Handles conversation creation with staff assignment
 */

import { useCreateConversation } from "../../../../../hooks/queries/hotel-management/guest-conversations";
import { findAvailableStaff } from "../utils/staffAssignment";
import type { GuestConversation } from "../../../../../hooks/queries/hotel-management/guest-conversations/guestConversation.types";

interface UseConversationSetupProps {
  guestId: string;
  hotelId: string;
  onConversationCreated?: (conversationId: string) => void;
}

interface UseConversationSetupReturn {
  createConversationWithStaff: () => Promise<string | null>;
  isCreating: boolean;
}

export const useConversationSetup = ({
  guestId,
  hotelId,
  onConversationCreated,
}: UseConversationSetupProps): UseConversationSetupReturn => {
  const { mutate: createConversation, isPending: isCreating } =
    useCreateConversation();

  const createConversationWithStaff = async (): Promise<string | null> => {
    // Try to find available staff member (optional - for routing only)
    const assignedStaffId = await findAvailableStaff(hotelId);

    return new Promise((resolve, reject) => {
      createConversation(
        {
          guest_id: guestId,
          hotel_id: hotelId,
          assigned_staff_id: assignedStaffId || null, // Optional - only for routing
          status: "active",
          last_message_at: new Date().toISOString(),
        },
        {
          onSuccess: (newConversation: GuestConversation) => {
            onConversationCreated?.(newConversation.id);
            resolve(newConversation.id);
          },
          onError: (error: Error) => {
            console.error(
              "❌ [useConversationSetup] Failed to create conversation:",
              error
            );
            reject(error);
          },
        }
      );
    });
  };

  return {
    createConversationWithStaff,
    isCreating,
  };
};
