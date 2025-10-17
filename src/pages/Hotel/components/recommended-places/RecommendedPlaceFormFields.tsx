/**
 * Recommended Place Form Fields Configuration
 *
 * Defines form fields for creating and editing recommended places.
 */

import { FormFieldConfig } from "../../../../hooks";

export const RECOMMENDED_PLACE_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "place_name",
    label: "Place Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter place name",
  },
  {
    key: "address",
    label: "Address",
    type: "text" as const,
    required: true,
    placeholder: "Enter address",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter description (optional)",
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
