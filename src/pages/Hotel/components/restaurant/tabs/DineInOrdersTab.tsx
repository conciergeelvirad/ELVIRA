/**
 * DineInOrdersTab Component
 *
 * Simplified tab component for managing dine-in orders
 */

import {
  SearchAndFilterBar,
  CRUDModalContainer,
} from "../../../../../components/common";
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

export const DineInOrdersTab = ({
  hotelId,
  restaurants,
  dineInOrderCRUD,
}: DineInOrdersTabProps) => {
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
      restaurants.find((r) => r.id === order.restaurant_id) ||
      null,
  });

  return (
    <>
      <SearchAndFilterBar
        searchQuery={dineInOrderCRUD.searchAndFilter.searchTerm}
        onSearchChange={dineInOrderCRUD.searchAndFilter.setSearchTerm}
        searchPlaceholder="Search orders..."
        filterActive={Boolean(dineInOrderCRUD.searchAndFilter.filterValue)}
        onFilterToggle={() =>
          dineInOrderCRUD.searchAndFilter.setFilterValue(
            dineInOrderCRUD.searchAndFilter.filterValue ? "" : "pending"
          )
        }
        viewMode={dineInOrderCRUD.searchAndFilter.mode}
        onViewModeChange={dineInOrderCRUD.searchAndFilter.setViewMode}
      />
      <DineInOrdersDataView
        viewMode={dineInOrderCRUD.searchAndFilter.mode}
        filteredData={dineInOrderCRUD.searchAndFilter.filteredData}
        handleRowClick={(order) => {
          dineInOrderCRUD.modalActions.openDetailModal(
            enhanceOrder(order) as any
          );
        }}
        onEdit={(order) => {
          dineInOrderCRUD.modalActions.openEditModal(
            enhanceOrder(order) as any
          );
        }}
        onDelete={(order) =>
          dineInOrderCRUD.modalActions.openDeleteModal(
            enhanceOrder(order) as any
          )
        }
      />
      <CRUDModalContainer
        modalState={dineInOrderCRUD.modalState}
        modalActions={dineInOrderCRUD.modalActions}
        formState={dineInOrderCRUD.formState}
        formActions={dineInOrderCRUD.formActions}
        formFields={DINE_IN_ORDER_FORM_FIELDS}
        editFormFields={DINE_IN_ORDER_EDIT_FORM_FIELDS}
        onCreateSubmit={dineInOrderCRUD.handleCreateSubmit}
        onEditSubmit={dineInOrderCRUD.handleEditSubmit}
        onDeleteConfirm={dineInOrderCRUD.handleDeleteConfirm}
        entityName="Dine-In Order"
        renderDetailContent={(item) => {
          console.log(
            "📋 [DineInOrdersTab] renderDetailContent called with item:",
            item
          );
          return <DineInOrderDetail item={item as any} />;
        }}
      />
    </>
  );
};
