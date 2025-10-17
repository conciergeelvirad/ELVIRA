import React from "react";
import { useTableSubscription } from "../../../../hooks/useTableSubscription";
import {
  useProducts,
  productKeys,
} from "../../../../hooks/queries/hotel-management/products";
import {
  useShopOrders,
  shopOrderKeys,
} from "../../../../hooks/queries/hotel-management/shop-orders";
import { useHotelStaff } from "../../../../hooks/hotel/useHotelStaff";

/**
 * Custom hook for managing hotel shop page data fetching and real-time subscriptions
 *
 * This hook encapsulates:
 * - Hotel staff context
 * - Products and shop orders data fetching
 * - Real-time subscription setup
 * - Loading and error states
 *
 * @returns Data, loading states, and staff context needed for the shop page
 */
export const useShopPageData = () => {
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
  const { data: products = [], isLoading: productsLoading } =
    useProducts(safeHotelId);
  const { data: shopOrders = [], isLoading: ordersLoading } =
    useShopOrders(safeHotelId);

  // 3. Subscription config memoization to prevent re-renders
  const productsSubscriptionConfig = React.useMemo(
    () => ({
      table: "products" as const,
      filter: `hotel_id=eq.${safeHotelId}`,
      queryKey: productKeys.list({ hotelId: safeHotelId }),
      enabled: Boolean(safeHotelId) && !staffLoading,
    }),
    [safeHotelId, staffLoading]
  );

  const ordersSubscriptionConfig = React.useMemo(
    () => ({
      table: "shop_orders" as const,
      filter: `hotel_id=eq.${safeHotelId}`,
      queryKey: shopOrderKeys.list({ hotelId: safeHotelId }),
      enabled: Boolean(safeHotelId) && !staffLoading,
    }),
    [safeHotelId, staffLoading]
  );

  // Subscription hooks with memoized configs
  useTableSubscription(productsSubscriptionConfig);
  useTableSubscription(ordersSubscriptionConfig);

  // Log the complete staff context when data changes
  React.useEffect(() => {
    if (hotelId && hotelStaff) {
      console.log("HotelShopPage - Staff Context:", {
        hotelId,
        staffId: hotelStaff.id,
        position: hotelStaff.position,
        department: hotelStaff.department,
        productsCount: products.length,
        ordersCount: shopOrders.length,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hotelId, hotelStaff, products.length, shopOrders.length]);

  return {
    // Staff context
    hotelId,
    hotelStaff,
    staffLoading,
    staffError,
    safeHotelId,

    // Data
    products,
    shopOrders,

    // Loading states
    productsLoading,
    ordersLoading,

    // Combined loading state
    isLoading: staffLoading || productsLoading || ordersLoading,
  };
};
