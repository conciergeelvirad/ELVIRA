/**
 * Shop Order Query Hooks
 *
 * React Query hooks for shop order management.
 * Provides hooks for fetching, creating, updating, and deleting shop orders with items.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  ExtendedShopOrder,
  ShopOrder,
  ShopOrderCreationData,
  ShopOrderUpdateData,
  ShopOrderStatusUpdateData,
  ShopOrderDeletionData,
} from "./shop-order.types";
import { shopOrderKeys } from "./shop-order.constants";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all shop orders for a specific hotel with related data
 *
 * @param hotelId - ID of the hotel to fetch orders for
 * @returns Query result with extended shop orders array
 */
export const useShopOrders = (hotelId: string) => {
  return useQuery({
    queryKey: shopOrderKeys.list({ hotelId }),
    queryFn: async (): Promise<ExtendedShopOrder[]> => {
      const { data, error } = await supabase
        .from("shop_orders")
        .select(
          `
          *,
          shop_order_items(
            *,
            product:product_id(
              id,
              name,
              price,
              image_url
            )
          ),
          guests(
            id,
            room_number,
            guest_personal_data(
              first_name,
              last_name
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExtendedShopOrder[];
    },
  });
};

/**
 * Fetches a single shop order by ID with related data
 *
 * @param orderId - ID of the order to fetch
 * @returns Query result with single extended shop order
 */
export const useShopOrderById = (orderId: string | undefined) => {
  return useQuery({
    queryKey: shopOrderKeys.detail(orderId || ""),
    queryFn: async (): Promise<ExtendedShopOrder> => {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const { data, error } = await supabase
        .from("shop_orders")
        .select(
          `
          *,
          shop_order_items(
            *,
            product:product_id(
              id,
              name,
              price,
              image_url
            )
          ),
          guests(
            id,
            room_number,
            guest_personal_data(
              first_name,
              last_name
            )
          )
        `
        )
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data as ExtendedShopOrder;
    },
    enabled: !!orderId,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new shop order with order items
 * Uses transaction-style approach: create order, then items, rollback on error
 *
 * @returns Mutation result for creating shop order
 */
export const useCreateShopOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: ShopOrderCreationData): Promise<ShopOrder> => {
      // First, create the order
      const { data: orderData, error: orderError } = await supabase
        .from("shop_orders")
        .insert(order)
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, create the order items
      if (items.length > 0) {
        const orderItems = items.map((item) => ({
          ...item,
          order_id: orderData.id,
        }));

        const { error: itemsError } = await supabase
          .from("shop_order_items")
          .insert(orderItems)
          .select();

        if (itemsError) {
          // Rollback: delete the order we just created
          await supabase.from("shop_orders").delete().eq("id", orderData.id);
          throw itemsError;
        }
      }

      return orderData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: shopOrderKeys.list({ hotelId: data.hotel_id }),
      });
    },
  });
};

/**
 * Updates an existing shop order
 *
 * @returns Mutation result for updating shop order
 */
export const useUpdateShopOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
      hotelId,
    }: ShopOrderUpdateData): Promise<ShopOrder> => {
      const { data, error } = await supabase
        .from("shop_orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: shopOrderKeys.list({ hotelId: variables.hotelId }),
      });
      queryClient.invalidateQueries({
        queryKey: shopOrderKeys.detail(data.id),
      });
    },
  });
};

/**
 * Updates shop order status (convenience hook for status-only updates)
 *
 * @returns Mutation result for updating shop order status
 */
export const useUpdateShopOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      hotelId,
    }: ShopOrderStatusUpdateData): Promise<ShopOrder> => {
      const { data, error } = await supabase
        .from("shop_orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: shopOrderKeys.list({ hotelId }),
      });
      queryClient.invalidateQueries({
        queryKey: shopOrderKeys.detail(data.id),
      });
    },
  });
};

/**
 * Deletes a shop order (items are deleted automatically via CASCADE)
 *
 * @returns Mutation result for deleting shop order
 */
export const useDeleteShopOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      hotelId,
    }: ShopOrderDeletionData): Promise<string> => {
      const { error } = await supabase
        .from("shop_orders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: shopOrderKeys.list({ hotelId }),
      });
      queryClient.removeQueries({
        queryKey: shopOrderKeys.detail(deletedId),
      });
    },
  });
};
