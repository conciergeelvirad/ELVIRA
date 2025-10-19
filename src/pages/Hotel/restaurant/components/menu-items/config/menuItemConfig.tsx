/**
 * Menu Item Entity Configuration
 *
 * Configuration object for menu item entity management using shared components
 */

import { MENU_ITEM_FORM_FIELDS } from "../MenuItemFormFields";
import { MenuItemDetail } from "../MenuItemDetail";
import type { MenuItem } from "../../../../../../hooks/queries/hotel-management/restaurants";
import { MenuItemCard } from "../../shared/MenuItemCard";

/**
 * Menu Item Entity Configuration
 */
export const menuItemEntityConfig = {
  // Entity metadata
  entityName: "Menu Item",
  searchPlaceholder: "Search menu items...",
  addButtonLabel: "Add Menu Item",
  emptyMessage: "No menu items found",

  // Form fields
  formFields: MENU_ITEM_FORM_FIELDS,

  // Detail rendering - uses ItemDetailView pattern
  renderDetail: (item: MenuItem) => <MenuItemDetail menuItem={item} />,

  // Card rendering function for grid view
  renderCard: (
    menuItem: MenuItem,
    onClick: () => void,
    handlers: {
      onEdit: () => void;
      onDelete: () => void;
      onRecommendedToggle?: (
        id: string | number,
        newValue: boolean,
        fieldName?: "recommended" | "hotel_recommended"
      ) => Promise<void>;
      currency?: string;
    }
  ) => (
    <MenuItemCard
      menuItem={menuItem}
      onClick={onClick}
      onEdit={handlers.onEdit}
      onDelete={handlers.onDelete}
      onRecommendedToggle={handlers.onRecommendedToggle}
      currency={handlers.currency}
    />
  ),

  // Item enhancement function (adds hotel_id)
  enhanceItem: (item: MenuItem, hotelId: string) => ({
    ...item,
    hotel_id: hotelId,
  }),
};
