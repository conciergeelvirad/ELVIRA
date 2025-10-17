/**
 * Shop Order Type Definitions
 *
 * TypeScript types for shop orders and order items functionality.
 * Handles guest product orders with line items and status tracking.
 */

import { Tables, Insert, Update } from "../../queryUtils";

// ============================================================================
// Database Table Types
// ============================================================================

export type ShopOrder = Tables<"shop_orders">;
export type ShopOrderItem = Tables<"shop_order_items">;
export type ShopOrderInsert = Insert<"shop_orders">;
export type ShopOrderItemInsert = Insert<"shop_order_items">;
export type ShopOrderUpdate = Update<"shop_orders">;

// ============================================================================
// Extended Types with Relations
// ============================================================================

/**
 * Extended shop order with related items, products, and guest info
 */
export type ExtendedShopOrder = ShopOrder & {
  shop_order_items?: (ShopOrderItem & {
    product?: {
      id: string;
      name: string;
      price: number;
      image_url: string | null;
    };
  })[];
  guests?: {
    id: string;
    room_number: string;
    guest_personal_data?: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
};

// ============================================================================
// Operation Types
// ============================================================================

/**
 * Data for creating a new shop order with items
 */
export type ShopOrderCreationData = {
  order: ShopOrderInsert;
  items: Omit<ShopOrderItemInsert, "order_id">[];
};

/**
 * Data for updating an existing shop order
 */
export type ShopOrderUpdateData = {
  id: string;
  updates: ShopOrderUpdate;
  hotelId: string;
};

/**
 * Data for updating shop order status
 */
export type ShopOrderStatusUpdateData = {
  id: string;
  status: ShopOrder["status"];
  hotelId: string;
};

/**
 * Data for deleting a shop order
 */
export type ShopOrderDeletionData = {
  id: string;
  hotelId: string;
};
