/**
 * Amenity Request Form Fields Configuration
 */

import { FormFieldConfig } from "../../../../../hooks";

// Form fields for creating new amenity requests
export const AMENITY_REQUEST_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "amenity_id",
    label: "Amenity ID",
    type: "text" as const,
    required: true,
    placeholder: "Enter amenity ID",
  },
  {
    key: "guest_id",
    label: "Guest ID",
    type: "text" as const,
    required: true,
    placeholder: "Enter guest ID",
  },
  {
    key: "request_date",
    label: "Request Date",
    type: "date" as const,
    required: true,
  },
  {
    key: "request_time",
    label: "Request Time",
    type: "text" as const,
    required: false,
    placeholder: "HH:MM",
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "completed", label: "Completed" },
      { value: "rejected", label: "Rejected" },
    ],
  },
  {
    key: "special_instructions",
    label: "Special Instructions",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter any special instructions...",
  },
];

// Form fields for editing amenity requests (only status can be updated)
export const AMENITY_REQUEST_EDIT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    required: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "completed", label: "Completed" },
      { value: "rejected", label: "Rejected" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];
