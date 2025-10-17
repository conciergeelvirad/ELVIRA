/**
 * MenuItemsTab Component
 *
 * Manages restaurant menu items with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (create, edit, delete, view)
 * - Recommended toggle functionality
 *
 * @refactored Uses shared EntityTab component with menu-item-specific configuration
 */

import React, { useMemo } from "react";
import { useHotelStaff } from "../../../../../components/common";
import { EntityTab } from "../../shared";
import { MenuItemCard } from "../../../../../components/restaurant";
import { MenuItemDetail, MENU_ITEM_FORM_FIELDS } from "../index";
import type { MenuItem } from "../../../../../hooks/queries/hotel-management/restaurants";
import type { useMenuItemCRUD } from "../../../hooks/restaurant/useMenuItemCRUD";
import { useRestaurants } from "../../../../../hooks/queries/hotel-management/restaurants/useRestaurantQueries";
import {
  getMenuItemTableColumns,
  menuItemGridColumns,
} from "../menu-items/MenuItemColumns";

interface MenuItemsTabProps {
  hotelId: string;
  menuItemCRUD: ReturnType<typeof useMenuItemCRUD>;
}

/**
 * Menu Items Tab - Simplified using shared EntityTab
 */
export const MenuItemsTab: React.FC<MenuItemsTabProps> = ({
  hotelId,
  menuItemCRUD,
}) => {
  // Get hotel currency from context
  const { currency } = useHotelStaff();

  // Fetch restaurants for displaying restaurant names in the menu items table
  const { data: restaurants = [] } = useRestaurants(hotelId);

  // Generate table columns with dependencies
  const menuItemTableColumns = useMemo(
    () =>
      getMenuItemTableColumns({
        handleStatusToggle: menuItemCRUD.handleStatusToggle,
        restaurants,
        currency,
      }),
    [menuItemCRUD.handleStatusToggle, restaurants, currency]
  );

  return (
    <EntityTab<MenuItem>
      isLoading={false}
      crud={menuItemCRUD}
      tableColumns={menuItemTableColumns}
      gridColumns={menuItemGridColumns}
      entityName="Menu Item"
      searchPlaceholder="Search menu items..."
      addButtonLabel="Add Menu Item"
      emptyMessage="No menu items found"
      renderCard={(menuItem, onClick) => (
        <MenuItemCard
          menuItem={menuItem}
          onClick={onClick}
          onEdit={() => {
            const enhanced = { ...menuItem, hotel_id: hotelId };
            menuItemCRUD.modalActions.openEditModal(enhanced);
          }}
          onDelete={() => {
            const enhanced = { ...menuItem, hotel_id: hotelId };
            menuItemCRUD.modalActions.openDeleteModal(enhanced);
          }}
          onRecommendedToggle={(id, newValue) =>
            menuItemCRUD.handleRecommendedToggle(
              id,
              newValue,
              "hotel_recommended"
            )
          }
          currency={currency}
        />
      )}
      renderDetailContent={(item) => <MenuItemDetail menuItem={item} />}
      formFields={MENU_ITEM_FORM_FIELDS}
      currency={currency}
    />
  );
};
