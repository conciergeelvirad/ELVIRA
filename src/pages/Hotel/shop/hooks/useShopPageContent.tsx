import React from "react";
import type { TabConfig } from "../../../../components/common/layout";
import { ShoppingBag, Package } from "lucide-react";
import { ProductsTab, OrdersTab } from "../components";
import {
  getProductTableColumns,
  getProductGridColumns,
  getShopOrderTableColumns,
  getShopOrderGridColumns,
} from "../components";
import type { useProductCRUD } from "./useProductCRUD";
import type { useShopOrderCRUD } from "./useShopOrderCRUD";
import { useHotelStaff } from "../../../../components/common";

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
  // Get hotel currency from context
  const { currency } = useHotelStaff();

  // Extract CRUD actions for products
  const { handleStatusToggle: productStatusToggle } = productCRUD;

  // Get columns based on current state for products
  const productTableColumns = React.useMemo(
    () =>
      getProductTableColumns({
        handleStatusToggle: productStatusToggle,
        currency,
      }),
    [productStatusToggle, currency]
  );

  const productGridColumns = React.useMemo(
    () =>
      getProductGridColumns({
        handleStatusToggle: productStatusToggle,
        currency,
      }),
    [productStatusToggle, currency]
  );

  // Get columns based on current state for orders
  const orderTableColumns = React.useMemo(
    () =>
      getShopOrderTableColumns((order) => {
        // When status badge is clicked, open edit modal with only status editable
        const orderData = order;
        shopOrderCRUD.formActions.setFormData(orderData);
        shopOrderCRUD.modalActions.openEditModal(orderData);
      }),
    [shopOrderCRUD]
  );

  const orderGridColumns = React.useMemo(() => getShopOrderGridColumns(), []);

  // Generate tab content with proper memoization
  const productListContent = React.useMemo(
    () => (
      <ProductsTab
        isLoading={productsLoading}
        crud={productCRUD}
        tableColumns={productTableColumns}
        gridColumns={productGridColumns}
        currency={currency}
      />
    ),
    [
      productsLoading,
      productCRUD,
      productTableColumns,
      productGridColumns,
      currency,
    ]
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
