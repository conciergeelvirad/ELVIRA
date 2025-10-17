import React from "react";
import {
  SearchAndFilterBar,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import {
  ShopOrdersDataView,
  ShopOrderDetail,
  enhanceShopOrder,
  SHOP_ORDER_FORM_FIELDS,
  SHOP_ORDER_EDIT_FORM_FIELDS,
} from "../index";
import type { useShopOrderCRUD } from "../../../hooks/shop/useShopOrderCRUD";

interface OrdersTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useShopOrderCRUD>;
  tableColumns: any[];
  gridColumns: any[];
  safeHotelId: string;
}

/**
 * Orders Tab Component
 *
 * Displays and manages hotel shop orders with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (create, edit, delete, view)
 * - Real-time updates
 */
export const OrdersTab: React.FC<OrdersTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  safeHotelId,
}) => {
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = crud;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  if (isLoading) {
    return <LoadingState message="Loading orders..." />;
  }

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search shop orders..."
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "active")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ShopOrdersDataView
        viewMode={viewMode}
        filteredData={filteredData}
        handleRowClick={(order) =>
          modalActions.openDetailModal(
            enhanceShopOrder({ ...order, hotel_id: safeHotelId })
          )
        }
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        onView={(order) =>
          modalActions.openDetailModal(
            enhanceShopOrder({ ...order, hotel_id: safeHotelId })
          )
        }
        onEdit={(order) => {
          const formData = {
            guest_id: order.guest_id,
            delivery_date: order.delivery_date,
            delivery_time: order.delivery_time,
            total_price: order.total_price,
            status: order.status,
            special_instructions: order.special_instructions,
            hotel_id: safeHotelId,
          };
          formActions.setFormData(formData);
          modalActions.openEditModal(
            enhanceShopOrder({ ...order, hotel_id: safeHotelId })
          );
        }}
        onDelete={(order) =>
          modalActions.openDeleteModal(
            enhanceShopOrder({ ...order, hotel_id: safeHotelId })
          )
        }
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={SHOP_ORDER_FORM_FIELDS}
        editFormFields={SHOP_ORDER_EDIT_FORM_FIELDS}
        entityName="Shop Order"
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        renderDetailContent={(item) => <ShopOrderDetail item={item} />}
      />
    </div>
  );
};
