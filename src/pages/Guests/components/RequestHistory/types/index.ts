/**
 * Request History Types
 *
 * Unified types for all order/request types across the system
 */

export type OrderType = "shop" | "dine_in" | "amenity";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

// Base order interface
export interface BaseOrder {
  id: string;
  created_at: string;
  status: OrderStatus;
  special_instructions?: string | null;
}

// Shop Order
export interface ShopOrder extends BaseOrder {
  type: "shop";
  total_price: number;
  delivery_date: string;
  delivery_time?: string | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image_url?: string | null;
  }>;
}

// Dine-In Order
export interface DineInOrder extends BaseOrder {
  type: "dine_in";
  order_type: "restaurant_booking" | "room_service";
  total_price: number;

  // Restaurant booking fields
  reservation_date?: string | null;
  reservation_time?: string | null;
  number_of_guests?: number | null;
  restaurant_name?: string | null;

  // Room service fields
  delivery_date?: string | null;
  delivery_time?: string | null;

  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Amenity Request
export interface AmenityRequest extends BaseOrder {
  type: "amenity";
  amenity_name: string;
  category: string;
  request_date: string;
  request_time?: string | null;
}

// Union type for all orders
export type UnifiedOrder = ShopOrder | DineInOrder | AmenityRequest;

// Grouped orders by date
export interface GroupedOrders {
  date: string;
  orders: UnifiedOrder[];
}
