/**
 * Table Subscription Hook
 *
 * Simple real-time subscription hook for Supabase tables.
 * Automatically invalidates React Query cache when data changes.
 */

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export interface UseTableSubscriptionOptions {
  /** Table name to subscribe to */
  table: string;
  /** Filter condition (e.g., "hotel_id=eq.123") */
  filter?: string;
  /** Query key to invalidate on changes */
  queryKey: readonly unknown[];
  /** Enable/disable subscription */
  enabled?: boolean;
}

/**
 * Subscribe to real-time changes from a Supabase table
 *
 * @example
 * ```tsx
 * useTableSubscription({
 *   table: "absence_requests",
 *   filter: `hotel_id=eq.${hotelId}`,
 *   queryKey: absenceRequestKeys.list({ hotelId }),
 * });
 * ```
 */
export const useTableSubscription = ({
  table,
  filter,
  queryKey,
  enabled = true,
}: UseTableSubscriptionOptions) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const channelName = `realtime:${table}${filter ? `:${filter}` : ""}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table,
          filter,
        },
        () => {
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, filter, enabled, queryClient, queryKey]);
};
