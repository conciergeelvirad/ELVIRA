/**
 * Orders Tab Component (Refactored)
 *
 * Displays and manages hotel shop orders with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (edit, delete, view)
 * - Real-time updates
 *
 * @refactored Uses OrdersTabTemplate for consistent orders management
 */

import React from "react";
import { OrdersTabTemplate } from "../../shared/orders/OrdersTabTemplate";
import {
  ShopOrdersDataView,
  ShopOrderDetail,
  enhanceShopOrder,
  SHOP_ORDER_FORM_FIELDS,
  SHOP_ORDER_EDIT_FORM_FIELDS,
} from "../index";
import type { useShopOrderCRUD } from "../../../hooks/shop/useShopOrderCRUD";
import type { ShopOrder } from "../../../../../hooks/queries/hotel-management/shop-orders";

interface OrdersTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useShopOrderCRUD>;
  tableColumns: any[];
  gridColumns: any[];
  safeHotelId: string;
}

/**
 * Shop Orders Tab - Simplified using OrdersTabTemplate
 */
export const OrdersTab: React.FC<OrdersTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  safeHotelId,
}) => {
  return (
    <OrdersTabTemplate<ShopOrder>
      isLoading={isLoading}
      crud={crud}
      entityName="Shop Order"
      searchPlaceholder="Search shop orders..."
      defaultFilterValue="active"
      emptyMessage="No shop orders found"
      formFields={SHOP_ORDER_FORM_FIELDS}
      editFormFields={SHOP_ORDER_EDIT_FORM_FIELDS}
      renderDataView={(viewMode, filteredData, handlers) => (
        <ShopOrdersDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(order: ShopOrder) => {
            const enhanced = enhanceShopOrder({
              ...order,
              hotel_id: safeHotelId,
            });
            handlers.onView(enhanced);
          }}
          tableColumns={tableColumns}
          gridColumns={gridColumns}
          onView={(order: ShopOrder) => {
            const enhanced = enhanceShopOrder({
              ...order,
              hotel_id: safeHotelId,
            });
            handlers.onView(enhanced);
          }}
          onEdit={(order: ShopOrder) => {
            const formData = {
              guest_id: order.guest_id,
              delivery_date: order.delivery_date,
              delivery_time: order.delivery_time,
              total_price: order.total_price,
              status: order.status,
              special_instructions: order.special_instructions,
              hotel_id: safeHotelId,
            };
            crud.formActions.setFormData(formData);
            const enhanced = enhanceShopOrder({
              ...order,
              hotel_id: safeHotelId,
            });
            handlers.onEdit(enhanced);
          }}
          onDelete={(order: ShopOrder) => {
            const enhanced = enhanceShopOrder({
              ...order,
              hotel_id: safeHotelId,
            });
            handlers.onDelete(enhanced);
          }}
        />
      )}
      renderDetailContent={(item) => <ShopOrderDetail item={item} />}
      loadingMessage="Loading shop orders..."
    />
  );
};
