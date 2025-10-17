import React from "react";
import {
  useRestaurants,
  useRestaurantMenuItems,
  useRestaurantDineInOrders,
} from "../../../../hooks/queries/hotel-management/restaurants";
import { useHotelStaff } from "../../../../hooks/hotel/useHotelStaff";

/**
 * Custom hook for managing restaurant page data fetching
 *
 * This hook encapsulates:
 * - Hotel staff context
 * - Restaurants, menu items, and dine-in orders data fetching
 * - Loading and error states
 * - Default restaurant selection
 *
 * @returns Data, loading states, and staff context needed for the restaurant page
 */
export const useRestaurantPageData = () => {
  // 1. Staff Context Hook - Primary context that others depend on
  const {
    hotelId,
    hotelStaff,
    isLoading: staffLoading,
    error: staffError,
  } = useHotelStaff();

  // Memoize the hotel ID to prevent unnecessary re-renders
  const safeHotelId = React.useMemo(() => hotelId || "", [hotelId]);

  // 2. Data Fetching Hooks
  const { data: restaurants = [], isLoading: restaurantsLoading } =
    useRestaurants(safeHotelId);

  // Get default restaurant ID from first restaurant
  const defaultRestaurantId = React.useMemo(
    () => restaurants[0]?.id,
    [restaurants]
  );

  const { data: menuItems = [], isLoading: menuItemsLoading } =
    useRestaurantMenuItems(safeHotelId, defaultRestaurantId);

  const { data: dineInOrders = [], isLoading: ordersLoading } =
    useRestaurantDineInOrders(safeHotelId);

  // Log the complete staff context when data changes
  React.useEffect(() => {
    if (hotelId && hotelStaff) {
      console.log("HotelRestaurantPage - Staff Context:", {
        hotelId,
        staffId: hotelStaff.id,
        position: hotelStaff.position,
        department: hotelStaff.department,
        restaurantsCount: restaurants.length,
        menuItemsCount: menuItems.length,
        ordersCount: dineInOrders.length,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    hotelId,
    hotelStaff,
    restaurants.length,
    menuItems.length,
    dineInOrders.length,
  ]);

  return {
    // Staff context
    hotelId,
    hotelStaff,
    staffLoading,
    staffError,
    safeHotelId,

    // Data
    restaurants,
    menuItems,
    dineInOrders,
    defaultRestaurantId,

    // Loading states
    restaurantsLoading,
    menuItemsLoading,
    ordersLoading,

    // Combined loading state
    isLoading:
      staffLoading || restaurantsLoading || menuItemsLoading || ordersLoading,
  };
};
