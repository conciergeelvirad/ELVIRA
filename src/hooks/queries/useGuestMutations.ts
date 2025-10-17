/**
 * Guest Mutation Hooks
 *
 * React Query mutations for guest-related operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

/**
 * Updates a guest's Do Not Disturb status
 *
 * @returns Mutation result for updating DND status
 */
export const useUpdateGuestDND = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      dndStatus,
    }: {
      guestId: string;
      dndStatus: boolean;
    }) => {
      console.log(
        `🔔 [useUpdateGuestDND] Updating DND status for guest ${guestId} to:`,
        dndStatus
      );

      const { data, error } = await supabase
        .from("guests")
        .update({ dnd_status: dndStatus })
        .eq("id", guestId)
        .select()
        .single();

      if (error) {
        console.error("🔔 [useUpdateGuestDND] Error updating DND:", error);
        throw error;
      }

      console.log(
        "🔔 [useUpdateGuestDND] DND status updated successfully:",
        data
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate guest queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["guest", data.id] });
      console.log("🔔 [useUpdateGuestDND] Query cache invalidated");
    },
    onError: (error) => {
      console.error("🔔 [useUpdateGuestDND] Mutation failed:", error);
    },
  });
};
