import React from "react";
import { TabPage } from "../../components/common";
import { LoadingState, EmptyState } from "../../components/common";
import { PRODUCT_FORM_FIELDS, SHOP_ORDER_FORM_FIELDS } from "./components/shop";
import {
  useProductCRUD,
  useShopOrderCRUD,
  useShopPageData,
  useShopPageContent,
} from "./hooks/shop";

/**
 * Hotel Shop Management Page
 *
 * Main page component for managing hotel shop products and orders.
 * Uses custom hooks for data fetching, CRUD operations, and UI generation.
 *
 * Architecture:
 * - useShopPageData: Handles data fetching and real-time subscriptions
 * - useProductCRUD/useShopOrderCRUD: Handle CRUD operations
 * - useShopPageContent: Generates tab content with proper memoization
 */
export const HotelShopPage = () => {
  // 1. Fetch all data and setup subscriptions
  const {
    hotelId,
    hotelStaff,
    staffError,
    safeHotelId,
    products,
    shopOrders,
    productsLoading,
    ordersLoading,
    isLoading,
  } = useShopPageData();

  // 2. Setup CRUD hooks with memoized configs
  const productCrudConfig = React.useMemo(
    () => ({
      initialProducts: products,
      formFields: PRODUCT_FORM_FIELDS,
    }),
    [products]
  );

  const orderCrudConfig = React.useMemo(
    () => ({
      initialOrders: shopOrders,
      formFields: SHOP_ORDER_FORM_FIELDS,
    }),
    [shopOrders]
  );

  const productCRUD = useProductCRUD(productCrudConfig);
  const shopOrderCRUD = useShopOrderCRUD(orderCrudConfig);

  // 3. Generate tab content
  const tabs = useShopPageContent({
    productsLoading,
    ordersLoading,
    productCRUD,
    shopOrderCRUD,
    safeHotelId,
  });

  // Early return for loading state
  if (isLoading) {
    return <LoadingState message="Loading shop data..." className="h-full" />;
  }

  // Early return for error state
  if (staffError || !hotelId || !hotelStaff) {
    return (
      <EmptyState
        message="Unable to load staff data. Please try again."
        className="h-full"
      />
    );
  }

  return <TabPage title="Hotel Shop" tabs={tabs} defaultTab="products" />;
};
