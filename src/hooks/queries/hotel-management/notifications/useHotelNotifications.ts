/**
 * Hotel Notifications Hook
 *
 * Provides real-time notification counts for new orders/requests across the hotel system.
 * Tracks pending items from:
 * - Shop orders (shop_orders)
 * - Dine-in orders (dine_in_orders)
 * - Amenity requests (amenity_requests)
 *
 * Includes real-time subscriptions for instant updates when new orders arrive.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

export interface HotelNotificationCounts {
  shopOrders: number;
  dineInOrders: number;
  amenityRequests: number;
  totalPending: number;
}

/**
 * Fetches notification counts for pending orders/requests
 *
 * @param hotelId - ID of the hotel to fetch counts for
 * @returns Query result with notification counts
 */
export const useHotelNotifications = (hotelId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["hotel-notifications", hotelId],
    queryFn: async (): Promise<HotelNotificationCounts> => {
      if (!hotelId) {
        return {
          shopOrders: 0,
          dineInOrders: 0,
          amenityRequests: 0,
          totalPending: 0,
        };
      }

      // Fetch pending shop orders count
      const { count: shopCount, error: shopError } = await supabase
        .from("shop_orders")
        .select("*", { count: "exact", head: true })
        .eq("hotel_id", hotelId)
        .eq("status", "pending");

      if (shopError) {
        console.error("Error fetching shop orders count:", shopError);
      }

      // Fetch pending dine-in orders count
      const { count: dineInCount, error: dineInError } = await supabase
        .from("dine_in_orders")
        .select("*", { count: "exact", head: true })
        .eq("hotel_id", hotelId)
        .eq("status", "pending");

      if (dineInError) {
        console.error("Error fetching dine-in orders count:", dineInError);
      }

      // Fetch pending amenity requests count
      const { count: amenityCount, error: amenityError } = await supabase
        .from("amenity_requests")
        .select("*", { count: "exact", head: true })
        .eq("hotel_id", hotelId)
        .eq("status", "pending");

      if (amenityError) {
        console.error("Error fetching amenity requests count:", amenityError);
      }

      const shopOrders = shopCount || 0;
      const dineInOrders = dineInCount || 0;
      const amenityRequests = amenityCount || 0;

      return {
        shopOrders,
        dineInOrders,
        amenityRequests,
        totalPending: shopOrders + dineInOrders + amenityRequests,
      };
    },
    enabled: !!hotelId,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Set up real-time subscriptions for instant updates
  useEffect(() => {
    if (!hotelId) return;

    // Subscribe to shop orders
    const shopSubscription = supabase
      .channel(`shop_orders:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shop_orders",
          filter: `hotel_id=eq.${hotelId}`,
        },
        () => {
          // Invalidate query to refetch counts
          queryClient.invalidateQueries({
            queryKey: ["hotel-notifications", hotelId],
          });
        }
      )
      .subscribe();

    // Subscribe to dine-in orders
    const dineInSubscription = supabase
      .channel(`dine_in_orders:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dine_in_orders",
          filter: `hotel_id=eq.${hotelId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["hotel-notifications", hotelId],
          });
        }
      )
      .subscribe();

    // Subscribe to amenity requests
    const amenitySubscription = supabase
      .channel(`amenity_requests:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "amenity_requests",
          filter: `hotel_id=eq.${hotelId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["hotel-notifications", hotelId],
          });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      shopSubscription.unsubscribe();
      dineInSubscription.unsubscribe();
      amenitySubscription.unsubscribe();
    };
  }, [hotelId, queryClient]);

  return query;
};
