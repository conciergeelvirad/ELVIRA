/**
 * Restaurants Module
 *
 * Centralized exports for restaurant and dine-in order management functionality.
 */

// Type exports
export type {
  Restaurant,
  RestaurantInsert,
  RestaurantUpdate,
  DineInOrder,
  DineInOrderItem,
  Guest,
  MenuItem,
  DineInOrderItemWithMenuItem,
  DineInOrderWithDetails,
  RestaurantCreateData,
  RestaurantUpdateData,
  RestaurantDeletionData,
} from "./restaurant.types";

// Constants exports
export {
  restaurantKeys,
  DEFAULT_HOTEL_ID,
  DINE_IN_ORDER_SELECT_QUERY,
} from "./restaurant.constants";

// Transformer exports
export {
  // Restaurant filtering
  filterActiveRestaurants,
  searchRestaurants,
  filterRestaurantsByCuisine,

  // Restaurant sorting
  sortRestaurantsByName,
  sortRestaurantsByDate,

  // Restaurant data extraction
  getUniqueCuisineTypes,
  getRestaurantCounts,

  // Menu item filtering
  filterAvailableMenuItems,
  filterMenuItemsByCategory,
  searchMenuItems,
  filterMenuItemsByServiceType,
  filterMenuItemsBySpecialType,

  // Menu item sorting
  sortMenuItemsByName,
  sortMenuItemsByPrice,
  sortMenuItemsByCategory,

  // Menu item grouping
  groupMenuItemsByCategory,
  groupMenuItemsByAvailability,

  // Menu item data extraction
  getUniqueCategories,
  getAverageMenuPrice,
  getMenuPriceRange,

  // Dine-in order filtering
  filterOrdersByStatus,
  filterOrdersByRestaurant,
  filterOrdersByGuest,
  searchOrders,

  // Dine-in order sorting
  sortOrdersByDate,
  sortOrdersByStatus,

  // Dine-in order grouping
  groupOrdersByStatus,
  groupOrdersByRestaurant,

  // Dine-in order data extraction
  getOrderCountsByStatus,

  // Formatting
  formatPrice,
  formatRestaurantSummary,
  formatOrderSummary,
  getOrderStatusColor,
} from "./restaurant.transformers";

// Query hook exports
export {
  useRestaurants,
  useRestaurantById,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
  useRestaurantMenuItems,
  useRestaurantDineInOrders,
} from "./useRestaurantQueries";
