/**
 * Shop Order Transformer Functions
 *
 * Pure utility functions for transforming, filtering, sorting, and formatting shop order data.
 * All functions are immutable and return new data structures.
 */

import { ExtendedShopOrder, ShopOrder } from "./shop-order.types";

// ============================================================================
// Filtering Functions
// ============================================================================

/**
 * Filters orders by status
 */
export const filterOrdersByStatus = (
  orders: ExtendedShopOrder[],
  status: ShopOrder["status"]
): ExtendedShopOrder[] => {
  return orders.filter((order) => order.status === status);
};

/**
 * Filters orders by guest ID
 */
export const filterOrdersByGuest = (
  orders: ExtendedShopOrder[],
  guestId: string
): ExtendedShopOrder[] => {
  return orders.filter((order) => order.guest_id === guestId);
};

/**
 * Filters orders by room number
 */
export const filterOrdersByRoom = (
  orders: ExtendedShopOrder[],
  roomNumber: string
): ExtendedShopOrder[] => {
  return orders.filter((order) => order.guests?.room_number === roomNumber);
};

/**
 * Filters orders by date range
 */
export const filterOrdersByDateRange = (
  orders: ExtendedShopOrder[],
  startDate: Date,
  endDate: Date
): ExtendedShopOrder[] => {
  return orders.filter((order) => {
    if (!order.created_at) return false;
    const orderDate = new Date(order.created_at);
    return orderDate >= startDate && orderDate <= endDate;
  });
};

/**
 * Filters orders by minimum total price
 */
export const filterOrdersByMinAmount = (
  orders: ExtendedShopOrder[],
  minAmount: number
): ExtendedShopOrder[] => {
  return orders.filter((order) => order.total_price >= minAmount);
};

/**
 * Filters pending orders (status = 'pending')
 */
export const filterPendingOrders = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return filterOrdersByStatus(orders, "pending");
};

/**
 * Filters completed orders (status = 'completed')
 */
export const filterCompletedOrders = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return filterOrdersByStatus(orders, "completed");
};

/**
 * Filters cancelled orders (status = 'cancelled')
 */
export const filterCancelledOrders = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return filterOrdersByStatus(orders, "cancelled");
};

/**
 * Searches orders by guest name or room number
 */
export const searchOrders = (
  orders: ExtendedShopOrder[],
  query: string
): ExtendedShopOrder[] => {
  if (!query.trim()) return orders;

  const lowerQuery = query.toLowerCase();
  return orders.filter((order) => {
    const guestData = order.guests?.guest_personal_data;
    const fullName = guestData
      ? `${guestData.first_name} ${guestData.last_name}`.toLowerCase()
      : "";
    const roomNumber = order.guests?.room_number?.toLowerCase() || "";

    return fullName.includes(lowerQuery) || roomNumber.includes(lowerQuery);
  });
};

// ============================================================================
// Sorting Functions
// ============================================================================

/**
 * Sorts orders by creation date (newest first)
 */
export const sortOrdersByDateDesc = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return [...orders].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

/**
 * Sorts orders by creation date (oldest first)
 */
export const sortOrdersByDateAsc = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return [...orders].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
};

/**
 * Sorts orders by total price (highest first)
 */
export const sortOrdersByAmountDesc = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return [...orders].sort((a, b) => b.total_price - a.total_price);
};

/**
 * Sorts orders by total price (lowest first)
 */
export const sortOrdersByAmountAsc = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return [...orders].sort((a, b) => a.total_price - b.total_price);
};

/**
 * Sorts orders by guest name
 */
export const sortOrdersByGuestName = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return [...orders].sort((a, b) => {
    const nameA = a.guests?.guest_personal_data
      ? `${a.guests.guest_personal_data.first_name} ${a.guests.guest_personal_data.last_name}`
      : "";
    const nameB = b.guests?.guest_personal_data
      ? `${b.guests.guest_personal_data.first_name} ${b.guests.guest_personal_data.last_name}`
      : "";
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts orders by room number
 */
export const sortOrdersByRoom = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  return [...orders].sort((a, b) => {
    const roomA = a.guests?.room_number || "";
    const roomB = b.guests?.room_number || "";
    return roomA.localeCompare(roomB);
  });
};

/**
 * Sorts orders by status (pending → completed → cancelled)
 */
export const sortOrdersByStatus = (
  orders: ExtendedShopOrder[]
): ExtendedShopOrder[] => {
  const statusOrder: Record<string, number> = {
    pending: 1,
    completed: 2,
    cancelled: 3,
  };

  return [...orders].sort((a, b) => {
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });
};

// ============================================================================
// Grouping Functions
// ============================================================================

/**
 * Groups orders by status
 */
export const groupOrdersByStatus = (
  orders: ExtendedShopOrder[]
): Record<string, ExtendedShopOrder[]> => {
  return orders.reduce((acc, order) => {
    const status = order.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {} as Record<string, ExtendedShopOrder[]>);
};

/**
 * Groups orders by guest ID
 */
export const groupOrdersByGuest = (
  orders: ExtendedShopOrder[]
): Record<string, ExtendedShopOrder[]> => {
  return orders.reduce((acc, order) => {
    const guestId = order.guest_id;
    if (!acc[guestId]) acc[guestId] = [];
    acc[guestId].push(order);
    return acc;
  }, {} as Record<string, ExtendedShopOrder[]>);
};

/**
 * Groups orders by date (YYYY-MM-DD)
 */
export const groupOrdersByDate = (
  orders: ExtendedShopOrder[]
): Record<string, ExtendedShopOrder[]> => {
  return orders.reduce((acc, order) => {
    if (!order.created_at) return acc;
    const date = new Date(order.created_at).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {} as Record<string, ExtendedShopOrder[]>);
};

// ============================================================================
// Data Extraction Functions
// ============================================================================

/**
 * Calculates total revenue from orders
 */
export const getTotalRevenue = (orders: ExtendedShopOrder[]): number => {
  return orders.reduce((sum, order) => sum + order.total_price, 0);
};

/**
 * Gets total count of items across all orders
 */
export const getTotalItemCount = (orders: ExtendedShopOrder[]): number => {
  return orders.reduce((sum, order) => {
    return (
      sum +
      (order.shop_order_items?.reduce(
        (itemSum, item) => itemSum + item.quantity,
        0
      ) || 0)
    );
  }, 0);
};

/**
 * Gets order counts by status
 */
export const getOrderCountsByStatus = (
  orders: ExtendedShopOrder[]
): Record<string, number> => {
  return orders.reduce((acc, order) => {
    const status = order.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets average order value
 */
export const getAverageOrderValue = (orders: ExtendedShopOrder[]): number => {
  if (orders.length === 0) return 0;
  return getTotalRevenue(orders) / orders.length;
};

/**
 * Gets revenue by status
 */
export const getRevenueByStatus = (
  orders: ExtendedShopOrder[]
): Record<string, number> => {
  return orders.reduce((acc, order) => {
    const status = order.status;
    acc[status] = (acc[status] || 0) + order.total_price;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets most ordered products
 */
export const getMostOrderedProducts = (
  orders: ExtendedShopOrder[],
  limit: number = 10
): Array<{ productId: string; productName: string; quantity: number }> => {
  const productCounts: Record<string, { name: string; quantity: number }> = {};

  orders.forEach((order) => {
    order.shop_order_items?.forEach((item) => {
      const productId = item.product_id;
      const productName = item.product?.name || "Unknown";

      if (!productCounts[productId]) {
        productCounts[productId] = { name: productName, quantity: 0 };
      }
      productCounts[productId].quantity += item.quantity;
    });
  });

  return Object.entries(productCounts)
    .map(([productId, { name, quantity }]) => ({
      productId,
      productName: name,
      quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};

/**
 * Gets unique guest IDs from orders
 */
export const getUniqueGuestIds = (orders: ExtendedShopOrder[]): string[] => {
  return [...new Set(orders.map((order) => order.guest_id))];
};

/**
 * Gets order statistics for a specific period
 */
export const getOrderStatistics = (orders: ExtendedShopOrder[]) => {
  const counts = getOrderCountsByStatus(orders);
  const revenue = getRevenueByStatus(orders);

  return {
    totalOrders: orders.length,
    totalRevenue: getTotalRevenue(orders),
    averageOrderValue: getAverageOrderValue(orders),
    totalItems: getTotalItemCount(orders),
    pendingOrders: counts.pending || 0,
    completedOrders: counts.completed || 0,
    cancelledOrders: counts.cancelled || 0,
    pendingRevenue: revenue.pending || 0,
    completedRevenue: revenue.completed || 0,
    uniqueGuests: getUniqueGuestIds(orders).length,
  };
};

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Formats order total amount with currency
 */
export const formatOrderAmount = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Formats order date
 */
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formats order status for display
 */
export const formatOrderStatus = (status: ShopOrder["status"]): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Gets order status color for UI
 */
export const getOrderStatusColor = (status: ShopOrder["status"]): string => {
  const colors: Record<string, string> = {
    pending: "yellow",
    completed: "green",
    cancelled: "red",
  };
  return colors[status] || "gray";
};

/**
 * Formats guest name from order
 */
export const formatGuestName = (order: ExtendedShopOrder): string => {
  const guestData = order.guests?.guest_personal_data;
  if (!guestData) return "Unknown Guest";
  return `${guestData.first_name} ${guestData.last_name}`;
};

/**
 * Creates a summary string for an order
 */
export const formatOrderSummary = (order: ExtendedShopOrder): string => {
  const itemCount =
    order.shop_order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return `${itemCount} item${itemCount !== 1 ? "s" : ""} - ${formatOrderAmount(
    order.total_price
  )}`;
};

/**
 * Formats order items list
 */
export const formatOrderItems = (order: ExtendedShopOrder): string => {
  if (!order.shop_order_items || order.shop_order_items.length === 0) {
    return "No items";
  }

  return order.shop_order_items
    .map((item) => `${item.product?.name || "Unknown"} (${item.quantity})`)
    .join(", ");
};
