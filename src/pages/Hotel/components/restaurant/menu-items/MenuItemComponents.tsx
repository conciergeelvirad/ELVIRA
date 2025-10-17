/**
 * Menu Item Columns, Detail, DataView, and FormFields
 * All-in-one export file
 */

import { Menu, Tag, DollarSign } from "lucide-react";
import React from "react";
import { FormFieldConfig } from "../../../../../hooks";
import { StatusBadge } from "../../../../../components/common";
import {
  ItemDetailView,
  ItemDetailField,
} from "../../../../../components/common/detail-view";
import { Column } from "../../../../../types/table";
import type { MenuItem } from "../../../../../hooks/queries/hotel-management/restaurants";

// COLUMNS
export const menuItemTableColumns: Column<MenuItem>[] = [
  { key: "name", header: "Item Name", accessor: "name" },
  { key: "category", header: "Category", accessor: "category" },
  {
    key: "price",
    header: "Price",
    accessor: (item) => `$${item.price.toFixed(2)}`,
  },
  {
    key: "is_available",
    header: "Status",
    accessor: (item) => (
      <StatusBadge
        status={item.is_available ? "active" : "inactive"}
        label={item.is_available ? "Available" : "Unavailable"}
      />
    ),
  },
];

export const menuItemGridColumns = [
  { key: "name", label: "Item" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
];

export const menuItemDetailFields = [
  {
    key: "name",
    label: "Item Name",
    icon: Menu,
    accessor: (item: MenuItem) => item.name,
  },
  {
    key: "category",
    label: "Category",
    icon: Tag,
    accessor: (item: MenuItem) => item.category,
  },
  {
    key: "price",
    label: "Price",
    icon: DollarSign,
    accessor: (item: MenuItem) => `$${item.price.toFixed(2)}`,
  },
  {
    key: "description",
    label: "Description",
    accessor: (item: MenuItem) => item.description || "N/A",
  },
  {
    key: "is_available",
    label: "Available",
    accessor: (item: MenuItem) => (
      <StatusBadge
        status={item.is_available ? "active" : "inactive"}
        label={item.is_available ? "Yes" : "No"}
      />
    ),
  },
];

// DETAIL
export const MenuItemDetail = ({ menuItem }: { menuItem: MenuItem }) => {
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

// DATAVIEW
import { GenericDataView } from "../../../../../components/common/data-display";
import { MenuItemCard } from "../../../../../components/restaurant";

export const MenuItemsDataView: React.FC<{
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}> = ({ viewMode, filteredData, handleRowClick, onEdit, onDelete }) => {
  return (
    <GenericDataView<MenuItem>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={menuItemTableColumns}
      gridColumns={menuItemGridColumns}
      getItemId={(item) => item.id}
      renderCard={(item, onClick) => (
        <MenuItemCard
          menuItem={item}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No menu items found"
    />
  );
};

// FORM FIELDS
export const MENU_ITEM_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Item Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter item name",
  },
  {
    key: "category",
    label: "Category",
    type: "text" as const,
    required: true,
    placeholder: "Enter category",
  },
  {
    key: "price",
    label: "Price",
    type: "number" as const,
    required: true,
    placeholder: "Enter price",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter description",
  },
  {
    key: "is_available",
    label: "Available",
    type: "select" as const,
    required: false,
    options: [
      { value: "true", label: "Available" },
      { value: "false", label: "Unavailable" },
    ],
  },
];
