/**
 * Guest DineIn Order Mutations
 *
 * Handles creation of dine-in orders for guests
 * Supports two order types:
 * - restaurant_booking: Reservations at hotel restaurants
 * - room_service: Food delivery to guest rooms
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { CartItem } from "../../../../contexts/CartContext";

interface DineInOrderData {
  guestId: string;
  hotelId: string;
  orderType: "restaurant_booking" | "room_service";
  items: CartItem[];
  totalPrice: number;
  specialInstructions?: string;

  // Restaurant booking fields
  restaurantId?: string;
  reservationDate?: string;
  reservationTime?: string;
  numberOfGuests?: number;
  tablePreferences?: string;

  // Room service fields
  deliveryDate?: string;
  deliveryTime?: string;
}

export const useCreateGuestDineInOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: DineInOrderData) => {
      // Step 1: Create the order
      const { data: order, error: orderError } = await supabase
        .from("dine_in_orders")
        .insert({
          guest_id: orderData.guestId,
          hotel_id: orderData.hotelId,
          order_type: orderData.orderType,
          total_price: orderData.totalPrice,
          status: "pending",
          special_instructions: orderData.specialInstructions,

          // Restaurant booking fields
          restaurant_id: orderData.restaurantId,
          reservation_date: orderData.reservationDate,
          reservation_time: orderData.reservationTime,
          number_of_guests: orderData.numberOfGuests,
          table_preferences: orderData.tablePreferences,

          // Room service fields
          delivery_date: orderData.deliveryDate,
          delivery_time: orderData.deliveryTime,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating dine-in order:", orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!order) {
        throw new Error("Order was not created");
      }

      // Step 2: Create order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("dine_in_order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);

        // Rollback: Delete the order if items couldn't be created
        await supabase.from("dine_in_orders").delete().eq("id", order.id);

        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      return order;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["guest-dine-in-orders"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};
