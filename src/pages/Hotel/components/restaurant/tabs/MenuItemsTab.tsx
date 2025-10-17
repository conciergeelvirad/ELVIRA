/**
 * MenuItemsTab Component
 *
 * Simplified tab component for managing restaurant menu items
 */

import { Plus } from "lucide-react";
import {
  Button,
  SearchAndFilterBar,
  CRUDModalContainer,
} from "../../../../../components/common";
import { MenuItemsDataView, MENU_ITEM_FORM_FIELDS } from "../index";
import type { useMenuItemCRUD } from "../../../hooks/restaurant/useMenuItemCRUD";

interface MenuItemsTabProps {
  hotelId: string;
  menuItemCRUD: ReturnType<typeof useMenuItemCRUD>;
}

export const MenuItemsTab = ({ hotelId, menuItemCRUD }: MenuItemsTabProps) => {
  return (
    <>
      <SearchAndFilterBar
        searchQuery={menuItemCRUD.searchAndFilter.searchTerm}
        onSearchChange={menuItemCRUD.searchAndFilter.setSearchTerm}
        searchPlaceholder="Search menu items..."
        filterActive={Boolean(menuItemCRUD.searchAndFilter.filterValue)}
        onFilterToggle={() =>
          menuItemCRUD.searchAndFilter.setFilterValue(
            menuItemCRUD.searchAndFilter.filterValue ? "" : "active"
          )
        }
        viewMode={menuItemCRUD.searchAndFilter.mode}
        onViewModeChange={menuItemCRUD.searchAndFilter.setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={menuItemCRUD.modalActions.openCreateModal}
          >
            Add Menu Item
          </Button>
        }
      />
      <MenuItemsDataView
        viewMode={menuItemCRUD.searchAndFilter.mode}
        filteredData={menuItemCRUD.searchAndFilter.filteredData}
        handleRowClick={(item) => {
          const enhancedItem = { ...item, hotel_id: hotelId };
          menuItemCRUD.modalActions.openDetailModal(enhancedItem);
        }}
        onEdit={(item) => {
          const enhancedItem = { ...item, hotel_id: hotelId };
          menuItemCRUD.modalActions.openEditModal(enhancedItem);
        }}
        onDelete={(item) => {
          const enhancedItem = { ...item, hotel_id: hotelId };
          menuItemCRUD.modalActions.openDeleteModal(enhancedItem);
        }}
      />
      <CRUDModalContainer
        modalState={menuItemCRUD.modalState}
        modalActions={menuItemCRUD.modalActions}
        formState={menuItemCRUD.formState}
        formActions={menuItemCRUD.formActions}
        formFields={MENU_ITEM_FORM_FIELDS}
        onCreateSubmit={menuItemCRUD.handleCreateSubmit}
        onEditSubmit={menuItemCRUD.handleEditSubmit}
        onDeleteConfirm={menuItemCRUD.handleDeleteConfirm}
        entityName="Menu Item"
      />
    </>
  );
};
