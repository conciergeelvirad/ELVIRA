/**
 * Restaurant Form Fields Configuration
 *
 * Defines form fields for creating and editing restaurants.
 */

import { FormFieldConfig } from "../../../../../hooks";

export const RESTAURANT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Restaurant Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter restaurant name",
  },
  {
    key: "cuisine",
    label: "Cuisine Type",
    type: "text" as const,
    required: true,
    placeholder: "Enter cuisine type (e.g., Italian, Chinese)",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter restaurant description",
  },
  {
    key: "is_active",
    label: "Active",
    type: "select" as const,
    required: false,
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
];
