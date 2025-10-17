/**
 * Menu Item Detail Component
 *
 * Displays detailed information about a menu item in a modal.
 * Uses ItemDetailView for consistent styling across all entity types.
 */

import React from "react";
import {
  ItemDetailView,
  ItemDetailField,
} from "../../../../../components/common/detail-view";
import type { MenuItem } from "../../../../../hooks/queries/hotel-management/restaurants";
import { menuItemDetailFields } from "./MenuItemColumns";

interface MenuItemDetailProps {
  menuItem: MenuItem;
}

export const MenuItemDetail: React.FC<MenuItemDetailProps> = ({ menuItem }) => {
  // Convert menuItemDetailFields to ItemDetailField format
  const fields: ItemDetailField[] = menuItemDetailFields.map((field) => {
    const value =
      typeof field.accessor === "function"
        ? field.accessor(menuItem)
        : menuItem[field.key as keyof MenuItem];

    return {
      label: field.label,
      value: value,
    };
  });

  return (
    <ItemDetailView
      imageUrl={menuItem.image_url}
      imageName={menuItem.name}
      fields={fields}
    />
  );
};
