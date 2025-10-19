/**
 * Shop Order Form Fields Configuration
 */

import { FormFieldConfig } from "../../../../../hooks";

// Full fields for creating new shop orders
export const SHOP_ORDER_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "guest_id",
    label: "Guest ID",
    type: "text" as const,
    required: true,
    placeholder: "Enter guest ID",
  },
  {
    key: "delivery_date",
    label: "Delivery Date",
    type: "date" as const,
    required: true,
  },
  {
    key: "delivery_time",
    label: "Delivery Time",
    type: "text" as const,
    required: false,
    placeholder: "e.g., 14:00",
  },
  {
    key: "total_price",
    label: "Total Price",
    type: "number" as const,
    required: true,
    placeholder: "0.00",
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "preparing", label: "Preparing" },
      { value: "ready", label: "Ready" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "special_instructions",
    label: "Special Instructions",
    type: "textarea" as const,
    required: false,
    placeholder: "Any special instructions for this order",
  },
];

// Form fields for editing shop orders (only status can be updated)
export const SHOP_ORDER_EDIT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "preparing", label: "Preparing" },
      { value: "ready", label: "Ready" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];
