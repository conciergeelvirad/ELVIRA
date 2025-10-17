/**
 * Restaurant Type Definitions
 *
 * TypeScript types for restaurant and dine-in order management.
 */

import type { Database } from "../../../../types/supabase";

// Base database types
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type RestaurantInsert =
  Database["public"]["Tables"]["restaurants"]["Insert"];
export type RestaurantUpdate =
  Database["public"]["Tables"]["restaurants"]["Update"];

export type DineInOrder = Database["public"]["Tables"]["dine_in_orders"]["Row"];
export type DineInOrderItem =
  Database["public"]["Tables"]["dine_in_order_items"]["Row"];
export type Guest = Database["public"]["Tables"]["guests"]["Row"];

// Menu item structure
export interface MenuItem {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  service_type: string[] | null;
  special_type: string[] | null;
  restaurant_ids: string[];
  is_active: boolean; // Changed from is_available to match database schema
  image_url: string | null;
  hotel_recommended: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}

// Order item with menu item details
export interface DineInOrderItemWithMenuItem extends DineInOrderItem {
  menu_item: MenuItem;
  quantity: number; // Explicitly define quantity from database
  price_at_order: number; // Explicitly define price from database
}

// Complete dine-in order with relationships
export interface DineInOrderWithDetails extends DineInOrder {
  items: DineInOrderItemWithMenuItem[];
  guest: Guest;
  restaurant: Restaurant;
}

// Operation payloads
export interface RestaurantCreateData {
  data: Omit<RestaurantInsert, "hotel_id">;
  hotelId: string;
}

export interface RestaurantUpdateData {
  id: string;
  data: RestaurantUpdate;
  hotelId: string;
}

export interface RestaurantDeletionData {
  id: string;
  hotelId: string;
}

// Menu Item operation payloads
export interface MenuItemInsert {
  hotel_id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  service_type?: string[] | null;
  special_type?: string[] | null;
  restaurant_ids: string[];
  is_active?: boolean;
  image_url?: string | null;
  hotel_recommended?: boolean | null;
}

export interface MenuItemUpdate {
  name?: string;
  description?: string | null;
  category?: string;
  price?: number;
  service_type?: string[] | null;
  special_type?: string[] | null;
  restaurant_ids?: string[];
  is_active?: boolean;
  image_url?: string | null;
  hotel_recommended?: boolean | null;
}

export interface MenuItemUpdateData {
  id: string;
  updates: MenuItemUpdate;
}

export interface MenuItemDeletionData {
  id: string;
}
