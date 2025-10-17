/**
 * Menu Item Columns, Detail, DataView, and FormFields
 * All-in-one export file
 */

import { Menu, Tag, DollarSign } from "lucide-react";
import React from "react";
import { FormFieldConfig } from "../../../../../hooks";
import { StatusBadge } from "../../../../../components/common";
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
export const MenuItemDetail = ({ menuItem }: { menuItem: MenuItem }) => (
  <div className="grid grid-cols-1 gap-4">
    {menuItemDetailFields.map((field) => {
      const Icon = field.icon;
      const value =
        typeof field.accessor === "function"
          ? field.accessor(menuItem)
          : menuItem[field.key as keyof MenuItem];
      return (
        <div key={field.key} className="flex items-start space-x-3">
          {Icon && (
            <div className="mt-1">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500">{field.label}</p>
            <p className="mt-1 text-sm text-gray-900 break-words">
              {String(value)}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

// DATAVIEW
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";

/**
 * Menu Item Card Component for Grid View - IMAGE CARD
 */
const MenuItemCard: React.FC<{
  item: MenuItem;
  onClick: () => void;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
}> = ({ item, onClick, onEdit, onDelete }) => {
  const status = item.is_available ? "Available" : "Unavailable";

  // Build sections for content area
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [];

  sections.push({
    content: (
      <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded">
        {item.category}
      </span>
    ),
  });

  if (item.description) {
    sections.push({
      content: (
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      ),
    });
  }

  return (
    <GenericCard
      image={item.image_url || undefined}
      imageFallback={<Menu className="w-16 h-16 text-gray-400" />}
      title={<span className="line-clamp-1">{item.name}</span>}
      badge={{
        label: status,
        variant: "soft",
      }}
      price={{
        value: item.price,
        currency: "$",
        className: "text-xl font-bold text-orange-600",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(item) : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

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
          item={item}
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
