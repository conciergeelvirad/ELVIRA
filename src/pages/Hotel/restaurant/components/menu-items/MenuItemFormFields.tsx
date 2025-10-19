/**
 * Menu Item Form Fields Configuration
 *
 * Defines form fields for creating and editing menu items.
 */

import { FormFieldConfig } from "../../../../../hooks";

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
  {
    key: "image_url",
    label: "Menu Item Image",
    type: "file" as const,
    required: false,
    storageFolder: "MENU_ITEMS",
  },
];
