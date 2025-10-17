/**
 * Guest Shop Order Query Hooks
 *
 * Guest-facing hooks for creating and managing shop orders
 * Handles order creation with stock quantity updates
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import type { ShopOrderCreationData } from "../../hotel-management/shop-orders/shop-order.types";

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new shop order for a guest with automatic stock deduction
 *
 * Process:
 * 1. Creates order in shop_orders table
 * 2. Creates order items in shop_order_items table
 * 3. Decreases product stock quantities
 *
 * @returns Mutation hook for creating guest shop orders
 */
export const useCreateGuestShopOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShopOrderCreationData) => {
      console.log("🛒 [Guest Order] Creating shop order...", {
        itemCount: data.items.length,
        totalPrice: data.order.total_price,
      });

      // Step 1: Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("shop_orders")
        .insert(data.order)
        .select()
        .single();

      if (orderError) {
        console.error("❌ [Guest Order] Failed to create order:", orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      console.log("✅ [Guest Order] Order created:", orderData.id);

      // Step 2: Create order items with order_id
      const orderItemsWithOrderId = data.items.map(
        (item: {
          product_id: string;
          quantity: number;
          price_at_order: number;
        }) => ({
          ...item,
          order_id: orderData.id,
        })
      );

      const { error: itemsError } = await supabase
        .from("shop_order_items")
        .insert(orderItemsWithOrderId);

      if (itemsError) {
        console.error(
          "❌ [Guest Order] Failed to create order items:",
          itemsError
        );
        // Rollback: Delete the order if items creation fails
        await supabase.from("shop_orders").delete().eq("id", orderData.id);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      console.log("✅ [Guest Order] Order items created");

      // Step 3: Update product stock quantities
      for (const item of data.items) {
        // Get current product stock
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock_quantity, is_unlimited_stock")
          .eq("id", item.product_id)
          .single();

        if (productError) {
          console.error(
            "⚠️ [Guest Order] Failed to fetch product:",
            item.product_id
          );
          continue; // Continue with other products
        }

        // Skip if unlimited stock
        if (product.is_unlimited_stock) {
          console.log(
            "⏭️ [Guest Order] Product has unlimited stock, skipping:",
            item.product_id
          );
          continue;
        }

        // Calculate new stock quantity
        const currentStock = product.stock_quantity || 0;
        const newStock = Math.max(0, currentStock - item.quantity);

        // Update product stock
        const { error: updateError } = await supabase
          .from("products")
          .update({
            stock_quantity: newStock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.product_id);

        if (updateError) {
          console.error(
            "⚠️ [Guest Order] Failed to update stock for:",
            item.product_id,
            updateError
          );
          // Note: We don't rollback here as order is already created
          // Hotel staff can manually adjust stock if needed
        } else {
          console.log(
            `✅ [Guest Order] Stock updated for ${item.product_id}: ${currentStock} → ${newStock}`
          );
        }
      }

      console.log("🎉 [Guest Order] Order creation complete!");
      return orderData;
    },
    onSuccess: (data) => {
      console.log(
        "✅ [Guest Order] Mutation succeeded, invalidating queries..."
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["shop-orders", { hotelId: data.hotel_id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["products", { hotelId: data.hotel_id }],
      });
    },
    onError: (error) => {
      console.error("❌ [Guest Order] Mutation failed:", error);
    },
  });
};
