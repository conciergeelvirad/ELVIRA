/**
 * DineInOrdersTab Component (Refactored)
 *
 * Manages dine-in orders with:
 * - Search and filter functionality
 * - List view mode
 * - CRUD operations (edit, delete, view)
 *
 * @refactored Uses OrdersTabTemplate for consistent orders management
 */

import React from "react";
import { OrdersTabTemplate } from "../../shared/orders/OrdersTabTemplate";
import {
  DineInOrdersDataView,
  DINE_IN_ORDER_FORM_FIELDS,
  DINE_IN_ORDER_EDIT_FORM_FIELDS,
  DineInOrderDetail,
} from "../index";
import type { useDineInOrderCRUD } from "../../../hooks/restaurant/useDineInOrderCRUD";
import type {
  Restaurant,
  DineInOrderWithDetails,
} from "../../../../../hooks/queries/hotel-management/restaurants";

interface DineInOrdersTabProps {
  hotelId: string;
  restaurants: Restaurant[];
  dineInOrderCRUD: ReturnType<typeof useDineInOrderCRUD>;
}

/**
 * Dine-In Orders Tab - Simplified using OrdersTabTemplate
 */
export const DineInOrdersTab: React.FC<DineInOrdersTabProps> = ({
  hotelId,
  restaurants,
  dineInOrderCRUD,
}) => {
  // Helper to enhance order with required fields for modals
  const enhanceOrder = (
    order: DineInOrderWithDetails
  ): DineInOrderWithDetails => ({
    ...order,
    hotel_id: hotelId,
    items: order.items || [],
    guest: order.guest || {
      id: order.guest_id as string,
      hotel_id: hotelId,
      guest_name: "Guest",
      room_number: "",
      access_code_expires_at: new Date().toISOString(),
      hashed_verification_code: "",
      dnd_status: false,
      is_active: true,
      created_at: null,
      updated_at: null,
      created_by: null,
    },
    restaurant:
      order.restaurant ||
      restaurants.find((r) => r.id === order.restaurant?.id) ||
      null,
  });

  return (
    <OrdersTabTemplate<DineInOrderWithDetails>
      isLoading={false}
      crud={dineInOrderCRUD}
      entityName="Dine-In Order"
      searchPlaceholder="Search orders..."
      defaultFilterValue="pending"
      emptyMessage="No dine-in orders found"
      formFields={DINE_IN_ORDER_FORM_FIELDS}
      editFormFields={DINE_IN_ORDER_EDIT_FORM_FIELDS}
      renderDataView={(viewMode, filteredData, handlers) => (
        <DineInOrdersDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(order: DineInOrderWithDetails) => {
            handlers.onView(enhanceOrder(order));
          }}
          onEdit={(order: DineInOrderWithDetails) => {
            handlers.onEdit(enhanceOrder(order));
          }}
          onDelete={(order: DineInOrderWithDetails) => {
            handlers.onDelete(enhanceOrder(order));
          }}
        />
      )}
      renderDetailContent={(item) => <DineInOrderDetail item={item} />}
      loadingMessage="Loading dine-in orders..."
    />
  );
};
