/**
 * Request History Hook
 *
 * Fetches and combines all guest orders (shop, dine-in, amenity)
 * Transforms them into a unified format and groups by date
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../../lib/supabase";
import {
  UnifiedOrder,
  ShopOrder,
  DineInOrder,
  AmenityRequest,
  GroupedOrders,
  OrderStatus,
} from "../types";

interface UseRequestHistoryProps {
  guestId: string;
  hotelId: string;
}

export const useRequestHistory = ({
  guestId,
  hotelId,
}: UseRequestHistoryProps) => {
  return useQuery({
    queryKey: ["request-history", guestId, hotelId],
    queryFn: async (): Promise<GroupedOrders[]> => {
      // Fetch all orders in parallel
      const [shopOrdersResult, dineInOrdersResult, amenityRequestsResult] =
        await Promise.all([
          // Fetch shop orders
          supabase
            .from("shop_orders")
            .select(
              `
              id,
              created_at,
              status,
              total_price,
              delivery_date,
              delivery_time,
              special_instructions,
              shop_order_items(
                quantity,
                price_at_order,
                product:product_id(
                  name,
                  image_url
                )
              )
            `
            )
            .eq("guest_id", guestId)
            .eq("hotel_id", hotelId)
            .order("created_at", { ascending: false }),

          // Fetch dine-in orders
          supabase
            .from("dine_in_orders")
            .select(
              `
              id,
              created_at,
              status,
              order_type,
              total_price,
              special_instructions,
              reservation_date,
              reservation_time,
              number_of_guests,
              delivery_date,
              delivery_time,
              restaurant:restaurant_id(
                name
              ),
              dine_in_order_items(
                quantity,
                price_at_order,
                menu_item:menu_item_id(
                  name
                )
              )
            `
            )
            .eq("guest_id", guestId)
            .eq("hotel_id", hotelId)
            .order("created_at", { ascending: false }),

          // Fetch amenity requests
          supabase
            .from("amenity_requests")
            .select(
              `
              id,
              created_at,
              status,
              request_date,
              request_time,
              special_instructions,
              amenities!inner(
                name,
                category
              )
            `
            )
            .eq("guest_id", guestId)
            .eq("hotel_id", hotelId)
            .order("created_at", { ascending: false }),
        ]);

      // Check for errors
      if (shopOrdersResult.error) {
        console.error("Error fetching shop orders:", shopOrdersResult.error);
        throw shopOrdersResult.error;
      }
      if (dineInOrdersResult.error) {
        console.error(
          "Error fetching dine-in orders:",
          dineInOrdersResult.error
        );
        throw dineInOrdersResult.error;
      }
      if (amenityRequestsResult.error) {
        console.error(
          "Error fetching amenity requests:",
          amenityRequestsResult.error
        );
        throw amenityRequestsResult.error;
      }

      // Transform shop orders
      const shopOrders: ShopOrder[] = (shopOrdersResult.data || []).map(
        (order: unknown) => {
          const o = order as Record<string, unknown>;
          return {
            type: "shop" as const,
            id: o.id as string,
            created_at: o.created_at as string,
            status: o.status as OrderStatus,
            total_price: o.total_price as number,
            delivery_date: o.delivery_date as string,
            delivery_time: o.delivery_time as string | null,
            special_instructions: o.special_instructions as string | null,
            items: ((o.shop_order_items as Array<unknown>) || []).map(
              (item: unknown) => {
                const i = item as Record<string, unknown>;
                const product = i.product as Record<string, unknown> | null;
                return {
                  name: (product?.name as string) || "Unknown Product",
                  quantity: i.quantity as number,
                  price: i.price_at_order as number,
                  image_url: product?.image_url as string | null,
                };
              }
            ),
          };
        }
      );

      // Transform dine-in orders
      const dineInOrders: DineInOrder[] = (dineInOrdersResult.data || []).map(
        (order: unknown) => {
          const o = order as Record<string, unknown>;
          const restaurant = o.restaurant as Record<string, unknown> | null;
          return {
            type: "dine_in" as const,
            id: o.id as string,
            created_at: o.created_at as string,
            status: o.status as OrderStatus,
            order_type: o.order_type as "restaurant_booking" | "room_service",
            total_price: o.total_price as number,
            special_instructions: o.special_instructions as string | null,
            reservation_date: o.reservation_date as string | null,
            reservation_time: o.reservation_time as string | null,
            number_of_guests: o.number_of_guests as number | null,
            delivery_date: o.delivery_date as string | null,
            delivery_time: o.delivery_time as string | null,
            restaurant_name: (restaurant?.name as string) || null,
            items: ((o.dine_in_order_items as Array<unknown>) || []).map(
              (item: unknown) => {
                const i = item as Record<string, unknown>;
                const menuItem = i.menu_item as Record<string, unknown> | null;
                return {
                  name: (menuItem?.name as string) || "Unknown Item",
                  quantity: i.quantity as number,
                  price: i.price_at_order as number,
                };
              }
            ),
          };
        }
      );

      // Transform amenity requests
      const amenityRequests: AmenityRequest[] = (
        amenityRequestsResult.data || []
      ).map((request: unknown) => {
        const r = request as Record<string, unknown>;
        const amenities = r.amenities as Record<string, unknown> | null;
        return {
          type: "amenity" as const,
          id: r.id as string,
          created_at: r.created_at as string,
          status: r.status as OrderStatus,
          amenity_name: (amenities?.name as string) || "Unknown Amenity",
          category: (amenities?.category as string) || "Other",
          request_date: r.request_date as string,
          request_time: r.request_time as string | null,
          special_instructions: r.special_instructions as string | null,
        };
      });

      // Combine all orders
      const allOrders: UnifiedOrder[] = [
        ...shopOrders,
        ...dineInOrders,
        ...amenityRequests,
      ];

      // Sort by created_at (newest first)
      allOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Group by date
      const grouped = allOrders.reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const existingGroup = acc.find((g) => g.date === date);
        if (existingGroup) {
          existingGroup.orders.push(order);
        } else {
          acc.push({ date, orders: [order] });
        }
        return acc;
      }, [] as GroupedOrders[]);

      return grouped;
    },
    enabled: !!guestId && !!hotelId,
  });
};
