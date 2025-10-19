/**
 * Menu Items Data View Component
 *
 * Displays restaurant menu items in table or grid view using GenericDataView.
 * Handles menu item listing, pagination, and CRUD operations.
 */

import React, { useMemo } from "react";
import { GenericDataView } from "../../../../../components/common/data-display";
import { MenuItemCard } from "../shared/MenuItemCard";
import type {
  MenuItem,
  Restaurant,
} from "../../../../../hooks/queries/hotel-management/restaurants";
import {
  getMenuItemTableColumns,
  menuItemGridColumns,
} from "./MenuItemColumns";

interface MenuItemsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  restaurants: Restaurant[];
  currency?: string;
  handleRecommendedToggle?: (
    id: string | number,
    newValue: boolean,
    fieldName?: "recommended" | "hotel_recommended"
  ) => Promise<void>;
}

export const MenuItemsDataView: React.FC<MenuItemsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  onEdit,
  onDelete,
  handleStatusToggle,
  restaurants,
  currency,
  handleRecommendedToggle,
}) => {
  const tableColumns = useMemo(
    () =>
      getMenuItemTableColumns({ handleStatusToggle, restaurants, currency }),
    [handleStatusToggle, restaurants, currency]
  );

  return (
    <GenericDataView<MenuItem>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={menuItemGridColumns}
      getItemId={(item) => item.id}
      renderCard={(item, onClick) => (
        <MenuItemCard
          menuItem={item}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onRecommendedToggle={handleRecommendedToggle}
          currency={currency}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No menu items found"
    />
  );
};
