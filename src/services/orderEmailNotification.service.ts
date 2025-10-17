/**
 * Order Email Notification Service
 *
 * Sends email notifications for orders using the edge function
 */

import { supabase } from "../lib/supabase";

export interface OrderEmailData {
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  hotelName: string;
  orderType: "shop" | "dine_in" | "amenity";
  orderId: string;
  orderStatus: string;
  orderDetails: {
    // Amenity fields
    amenityName?: string;
    amenityCategory?: string;
    amenityPrice?: string;
    requestDate?: string;
    requestTime?: string;
    specialInstructions?: string;

    // DineIn fields
    restaurantName?: string;
    orderItems?: Array<{ name: string; quantity: number; price: number }>;
    totalPrice?: number;
    deliveryDate?: string;
    deliveryTime?: string;
    reservationDate?: string;
    reservationTime?: string;
    numberOfGuests?: number;
    tablePreferences?: string;

    // Shop fields
    shopItems?: Array<{ name: string; quantity: number; price: number }>;
    shopTotalPrice?: number;
    shopDeliveryDate?: string;
    shopDeliveryTime?: string;
  };
}

export const sendOrderNotificationEmail = async (
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: result, error } = await supabase.functions.invoke(
      "send-order-notification-email",
      {
        body: data,
      }
    );

    if (error) {
      console.error("Error invoking email function:", error);
      return { success: false, error: error.message };
    }

    if (!result?.success) {
      console.error("Email function returned error:", result?.error);
      return { success: false, error: result?.error || "Unknown error" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
