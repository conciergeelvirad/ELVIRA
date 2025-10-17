import React from "react";
import type { TabConfig } from "../../../../components/common/layout";
import { ShoppingBag, Package } from "lucide-react";
import { ProductsTab, OrdersTab } from "../../components/shop";
import {
  getProductTableColumns,
  getProductGridColumns,
  getShopOrderTableColumns,
  getShopOrderGridColumns,
} from "../../components";
import type { useProductCRUD } from "./useProductCRUD";
import type { useShopOrderCRUD } from "./useShopOrderCRUD";

interface UseShopPageContentProps {
  productsLoading: boolean;
  ordersLoading: boolean;
  productCRUD: ReturnType<typeof useProductCRUD>;
  shopOrderCRUD: ReturnType<typeof useShopOrderCRUD>;
  safeHotelId: string;
}

/**
 * Custom hook for generating shop page tab content
 *
 * This hook encapsulates:
 * - Column configuration for products and orders
 * - Tab content generation with proper props
 * - Tab configuration array
 *
 * @param props - Loading states and CRUD handlers
 * @returns Array of tab configurations ready for TabPage component
 */
export const useShopPageContent = ({
  productsLoading,
  ordersLoading,
  productCRUD,
  shopOrderCRUD,
  safeHotelId,
}: UseShopPageContentProps): TabConfig[] => {
  // Extract CRUD actions for products
  const { handleStatusToggle: productStatusToggle } = productCRUD;

  // Get columns based on current state for products
  const productTableColumns = React.useMemo(
    () =>
      getProductTableColumns({
        handleStatusToggle: productStatusToggle,
      }),
    [productStatusToggle]
  );

  const productGridColumns = React.useMemo(
    () =>
      getProductGridColumns({
        handleStatusToggle: productStatusToggle,
      }),
    [productStatusToggle]
  );

  // Get columns based on current state for orders
  const orderTableColumns = React.useMemo(() => getShopOrderTableColumns(), []);

  const orderGridColumns = React.useMemo(() => getShopOrderGridColumns(), []);

  // Generate tab content with proper memoization
  const productListContent = React.useMemo(
    () => (
      <ProductsTab
        isLoading={productsLoading}
        crud={productCRUD}
        tableColumns={productTableColumns}
        gridColumns={productGridColumns}
      />
    ),
    [productsLoading, productCRUD, productTableColumns, productGridColumns]
  );

  const ordersContent = React.useMemo(
    () => (
      <OrdersTab
        isLoading={ordersLoading}
        crud={shopOrderCRUD}
        tableColumns={orderTableColumns}
        gridColumns={orderGridColumns}
        safeHotelId={safeHotelId}
      />
    ),
    [
      ordersLoading,
      shopOrderCRUD,
      orderTableColumns,
      orderGridColumns,
      safeHotelId,
    ]
  );

  // Return tab configuration array
  return React.useMemo(
    () => [
      {
        id: "products",
        label: "Products",
        icon: ShoppingBag,
        content: productListContent,
      },
      {
        id: "orders",
        label: "Orders",
        icon: Package,
        content: ordersContent,
      },
    ],
    [productListContent, ordersContent]
  );
};
