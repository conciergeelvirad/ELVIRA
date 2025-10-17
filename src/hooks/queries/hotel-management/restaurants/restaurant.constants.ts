/**
 * Restaurant Constants
 *
 * Query keys and constants for restaurant management.
 */

// Default hotel ID
export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

// Query key factory for restaurants
export const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...restaurantKeys.lists(), { ...filters }] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  menuItems: () => [...restaurantKeys.all, "menu-items"] as const,
  menuItemsList: (restaurantId: string) =>
    [...restaurantKeys.menuItems(), restaurantId] as const,
  dineInOrders: () => [...restaurantKeys.all, "dine-in-orders"] as const,
  dineInOrdersList: (hotelId: string) =>
    [...restaurantKeys.dineInOrders(), hotelId] as const,
};

// Select query for dine-in orders with relationships
export const DINE_IN_ORDER_SELECT_QUERY = `
  *,
  items:dine_in_order_items(
    *,
    menu_item:menu_items(*)
  ),
  guest:guests(
    id,
    room_number,
    guest_personal_data(
      first_name,
      last_name
    )
  ),
  restaurant:restaurants(*)
`;
