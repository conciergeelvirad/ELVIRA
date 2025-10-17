/**
 * Shop Orders Module
 *
 * Centralized exports for shop order management functionality.
 */

// Type exports
export type {
  ShopOrder,
  ShopOrderItem,
  ShopOrderInsert,
  ShopOrderItemInsert,
  ShopOrderUpdate,
  ExtendedShopOrder,
  ShopOrderCreationData,
  ShopOrderUpdateData,
  ShopOrderStatusUpdateData,
  ShopOrderDeletionData,
} from "./shop-order.types";

// Constants exports
export { shopOrderKeys, DEFAULT_HOTEL_ID } from "./shop-order.constants";

// Transformer exports
export {
  // Filtering
  filterOrdersByStatus,
  filterOrdersByGuest,
  filterOrdersByRoom,
  filterOrdersByDateRange,
  filterOrdersByMinAmount,
  filterPendingOrders,
  filterCompletedOrders,
  filterCancelledOrders,
  searchOrders,

  // Sorting
  sortOrdersByDateDesc,
  sortOrdersByDateAsc,
  sortOrdersByAmountDesc,
  sortOrdersByAmountAsc,
  sortOrdersByGuestName,
  sortOrdersByRoom,
  sortOrdersByStatus,

  // Grouping
  groupOrdersByStatus,
  groupOrdersByGuest,
  groupOrdersByDate,

  // Data extraction
  getTotalRevenue,
  getTotalItemCount,
  getOrderCountsByStatus,
  getAverageOrderValue,
  getRevenueByStatus,
  getMostOrderedProducts,
  getUniqueGuestIds,
  getOrderStatistics,

  // Formatting
  formatOrderAmount,
  formatOrderDate,
  formatOrderStatus,
  getOrderStatusColor,
  formatGuestName,
  formatOrderSummary,
  formatOrderItems,
} from "./shop-order.transformers";

// Query hook exports
export {
  useShopOrders,
  useShopOrderById,
  useCreateShopOrder,
  useUpdateShopOrder,
  useUpdateShopOrderStatus,
  useDeleteShopOrder,
} from "./useShopOrderQueries";
