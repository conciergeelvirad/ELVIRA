/**
 * Restaurant Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting restaurant and order data.
 */

import type {
  Restaurant,
  DineInOrderWithDetails,
  MenuItem,
  DineInOrder,
} from "./restaurant.types";

// ============================================================================
// Restaurant Filtering Utilities
// ============================================================================

/**
 * Filters active restaurants
 */
export const filterActiveRestaurants = (
  restaurants: Restaurant[]
): Restaurant[] => {
  return restaurants.filter((restaurant) => restaurant.is_active);
};

/**
 * Searches restaurants by name or description
 */
export const searchRestaurants = (
  restaurants: Restaurant[],
  searchTerm: string
): Restaurant[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return restaurants;

  return restaurants.filter((restaurant) => {
    const name = restaurant.name?.toLowerCase() || "";
    const description = restaurant.description?.toLowerCase() || "";
    const cuisine = restaurant.cuisine?.toLowerCase() || "";

    return (
      name.includes(term) ||
      description.includes(term) ||
      cuisine.includes(term)
    );
  });
};

/**
 * Filters restaurants by cuisine type
 */
export const filterRestaurantsByCuisine = (
  restaurants: Restaurant[],
  cuisineType: string
): Restaurant[] => {
  return restaurants.filter((restaurant) => restaurant.cuisine === cuisineType);
};

// ============================================================================
// Restaurant Sorting Utilities
// ============================================================================

/**
 * Sorts restaurants by name (alphabetically)
 */
export const sortRestaurantsByName = (
  restaurants: Restaurant[]
): Restaurant[] => {
  return [...restaurants].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

/**
 * Sorts restaurants by creation date (newest first)
 */
export const sortRestaurantsByDate = (
  restaurants: Restaurant[]
): Restaurant[] => {
  return [...restaurants].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

// ============================================================================
// Restaurant Data Extraction Utilities
// ============================================================================

/**
 * Gets unique cuisine types
 */
export const getUniqueCuisineTypes = (restaurants: Restaurant[]): string[] => {
  const types = new Set(
    restaurants.map((r) => r.cuisine).filter((type): type is string => !!type)
  );
  return Array.from(types).sort();
};

/**
 * Gets restaurant count by active status
 */
export const getRestaurantCounts = (
  restaurants: Restaurant[]
): { active: number; inactive: number; total: number } => {
  const active = restaurants.filter((r) => r.is_active).length;
  const inactive = restaurants.filter((r) => !r.is_active).length;
  return { active, inactive, total: restaurants.length };
};

// ============================================================================
// Menu Item Filtering Utilities
// ============================================================================

/**
 * Filters available menu items
 */
export const filterAvailableMenuItems = (items: MenuItem[]): MenuItem[] => {
  return items.filter((item) => item.is_available);
};

/**
 * Filters menu items by category
 */
export const filterMenuItemsByCategory = (
  items: MenuItem[],
  category: string
): MenuItem[] => {
  return items.filter((item) => item.category === category);
};

/**
 * Searches menu items by name or description
 */
export const searchMenuItems = (
  items: MenuItem[],
  searchTerm: string
): MenuItem[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return items;

  return items.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";
    return name.includes(term) || description.includes(term);
  });
};

/**
 * Filters menu items by service type
 */
export const filterMenuItemsByServiceType = (
  items: MenuItem[],
  serviceType: string
): MenuItem[] => {
  return items.filter(
    (item) => item.service_type && item.service_type.includes(serviceType)
  );
};

/**
 * Filters menu items by special type
 */
export const filterMenuItemsBySpecialType = (
  items: MenuItem[],
  specialType: string
): MenuItem[] => {
  return items.filter(
    (item) => item.special_type && item.special_type.includes(specialType)
  );
};

// ============================================================================
// Menu Item Sorting Utilities
// ============================================================================

/**
 * Sorts menu items by name (alphabetically)
 */
export const sortMenuItemsByName = (items: MenuItem[]): MenuItem[] => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Sorts menu items by price (lowest first)
 */
export const sortMenuItemsByPrice = (items: MenuItem[]): MenuItem[] => {
  return [...items].sort((a, b) => a.price - b.price);
};

/**
 * Sorts menu items by category
 */
export const sortMenuItemsByCategory = (items: MenuItem[]): MenuItem[] => {
  return [...items].sort((a, b) => a.category.localeCompare(b.category));
};

// ============================================================================
// Menu Item Grouping Utilities
// ============================================================================

/**
 * Groups menu items by category
 */
export const groupMenuItemsByCategory = (
  items: MenuItem[]
): Record<string, MenuItem[]> => {
  return items.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
};

/**
 * Groups menu items by availability
 */
export const groupMenuItemsByAvailability = (
  items: MenuItem[]
): { available: MenuItem[]; unavailable: MenuItem[] } => {
  return items.reduce(
    (acc, item) => {
      if (item.is_available) {
        acc.available.push(item);
      } else {
        acc.unavailable.push(item);
      }
      return acc;
    },
    { available: [], unavailable: [] } as {
      available: MenuItem[];
      unavailable: MenuItem[];
    }
  );
};

// ============================================================================
// Menu Item Data Extraction Utilities
// ============================================================================

/**
 * Gets unique categories from menu items
 */
export const getUniqueCategories = (items: MenuItem[]): string[] => {
  const categories = new Set(items.map((item) => item.category));
  return Array.from(categories).sort();
};

/**
 * Calculates average price of menu items
 */
export const getAverageMenuPrice = (items: MenuItem[]): number => {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return Math.round((total / items.length) * 100) / 100;
};

/**
 * Gets price range of menu items
 */
export const getMenuPriceRange = (
  items: MenuItem[]
): { min: number; max: number } => {
  if (items.length === 0) return { min: 0, max: 0 };
  const prices = items.map((item) => item.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

// ============================================================================
// Dine-In Order Filtering Utilities
// ============================================================================

/**
 * Filters orders by status
 */
export const filterOrdersByStatus = (
  orders: DineInOrderWithDetails[],
  status: DineInOrder["status"]
): DineInOrderWithDetails[] => {
  return orders.filter((order) => order.status === status);
};

/**
 * Filters orders by restaurant
 */
export const filterOrdersByRestaurant = (
  orders: DineInOrderWithDetails[],
  restaurantId: string
): DineInOrderWithDetails[] => {
  return orders.filter((order) => order.restaurant_id === restaurantId);
};

/**
 * Filters orders by guest
 */
export const filterOrdersByGuest = (
  orders: DineInOrderWithDetails[],
  guestId: string
): DineInOrderWithDetails[] => {
  return orders.filter((order) => order.guest_id === guestId);
};

/**
 * Searches orders by guest name or restaurant name
 */
export const searchOrders = (
  orders: DineInOrderWithDetails[],
  searchTerm: string
): DineInOrderWithDetails[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return orders;

  return orders.filter((order) => {
    const guestName = order.guest?.guest_name?.toLowerCase() || "";
    const restaurantName = order.restaurant?.name?.toLowerCase() || "";
    return guestName.includes(term) || restaurantName.includes(term);
  });
};

// ============================================================================
// Dine-In Order Sorting Utilities
// ============================================================================

/**
 * Sorts orders by date (newest first)
 */
export const sortOrdersByDate = (
  orders: DineInOrderWithDetails[]
): DineInOrderWithDetails[] => {
  return [...orders].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sorts orders by status
 */
export const sortOrdersByStatus = (
  orders: DineInOrderWithDetails[]
): DineInOrderWithDetails[] => {
  const statusOrder: Record<string, number> = {
    pending: 1,
    confirmed: 2,
    preparing: 3,
    ready: 4,
    served: 5,
    completed: 6,
    cancelled: 7,
  };
  return [...orders].sort((a, b) => {
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });
};

// ============================================================================
// Dine-In Order Grouping Utilities
// ============================================================================

/**
 * Groups orders by status
 */
export const groupOrdersByStatus = (
  orders: DineInOrderWithDetails[]
): Record<string, DineInOrderWithDetails[]> => {
  return orders.reduce((acc, order) => {
    const status = order.status || "unknown";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {} as Record<string, DineInOrderWithDetails[]>);
};

/**
 * Groups orders by restaurant
 */
export const groupOrdersByRestaurant = (
  orders: DineInOrderWithDetails[]
): Record<string, DineInOrderWithDetails[]> => {
  return orders.reduce((acc, order) => {
    const restaurantName = order.restaurant?.name || "Unknown";
    if (!acc[restaurantName]) {
      acc[restaurantName] = [];
    }
    acc[restaurantName].push(order);
    return acc;
  }, {} as Record<string, DineInOrderWithDetails[]>);
};

// ============================================================================
// Dine-In Order Data Extraction Utilities
// ============================================================================

/**
 * Gets order counts by status
 */
export const getOrderCountsByStatus = (
  orders: DineInOrderWithDetails[]
): Record<string, number> => {
  return orders.reduce((acc, order) => {
    const status = order.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats price for display
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Formats restaurant summary
 */
export const formatRestaurantSummary = (restaurant: Restaurant): string => {
  const status = restaurant.is_active ? "Active" : "Inactive";
  const cuisine = restaurant.cuisine || "N/A";
  return `${restaurant.name} - ${cuisine} (${status})`;
};

/**
 * Formats order summary
 */
export const formatOrderSummary = (order: DineInOrderWithDetails): string => {
  const guestName = order.guest?.guest_name || "Unknown Guest";
  const restaurantName = order.restaurant?.name || "Unknown";
  return `${guestName} - ${restaurantName} (${order.status})`;
};

/**
 * Gets status badge color for orders
 */
export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: "yellow",
    confirmed: "blue",
    preparing: "orange",
    ready: "purple",
    served: "cyan",
    completed: "green",
    cancelled: "red",
  };
  return colors[status] || "gray";
};
